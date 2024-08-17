const sql = require('mssql');
const { memoizePromise } = require('./memoized');

require('dotenv').config();

const config = {
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: true,
    enableArithAbort: true,
  },
};

const getConnection = memoizePromise((db) => {
  const pool = new sql.ConnectionPool(config);
  pool.on("error", (err) => {
    // logger.error(`Connection pool error: ${util.inspect(err)}`); // Datadog monitor. If this log is modified or deleted, then the ass
    // FIXME - do we need to do anything to the pool now
  });
  return pool.connect();
});


function getPreparedStatementInputs(preparedStatement, values, replaceValue, logTokens) {
  let data = {};

  for (let i = 0; values && i < values.length; i++) {
    if (values[i].name !== 'imageData') {
      // logger.info('Adding input: ', values[i], logTokens);
    }
    preparedStatement.input(values[i].name, values[i].type);
    data[values[i].name] = values[i].value === undefined && replaceValue !== null && replaceValue.name.toLowerCase() == values[i].name.toLowerCase()
      ? replaceValue.value
      : values[i].value;
  }

  return data;
}

function preparedStatement({ statement, values, database, logTokens }) {
  return getConnection(database)
    .then((connection) => {
      // log.trace(`got connection - ${connection.config.database}`);
      const ps = new sql.PreparedStatement(connection);
      let data = getPreparedStatementInputs(ps, values, null, logTokens);

      return ps.prepare(statement).then(() => {
        return ps.execute(data)
          .then((result) => {
            // logger.info("Got results", result);
            // return result.recordset;
            return result;
          })
          .finally(() => {
            ps.unprepare();
          });
      });
    })
    .catch((err) => {
      // logger.error(statement, err, logTokens);
      throw err;
    });
}

async function runTransaction({ statements, database, logTokens }) {
  try {
    // Setup connection and transaction
    const connection = await getConnection(database);
    const transaction = new sql.Transaction(connection);
    await transaction.begin();
  } catch (err) {
    throw err;
  }

  try {
    // Execute prepared statements
    let results = [];
    let replaceValue = null; // This will be something like an id that is needed from the first insertion

    // This is executed sequentially and not in parallel.
    // This allows us to control the order (e.g., delete Products record last), but it'll be slower.
    for (let statement of statements) {
      const preparedStatement = new sql.PreparedStatement(transaction);
      let data = getPreparedStatementInputs(preparedStatement, statement.values, replaceValue, logTokens);
      await preparedStatement.prepare(statement.query);

      try {
        let result = await preparedStatement.execute(data);
        results.push(result.recordset);

        if (statement.replaceValueKey) {
          replaceValue = {
            name: statement.replaceValueKey,
            value: result.recordset[0][statement.replaceValueKey],
          };
          // Store the value so subsequent queries can use it
        }
      } finally {
        await preparedStatement.unprepare();
      }
    }

    // All queries succeeded - commit and return results
    await transaction.commit();
    return results;
  } catch (err) {
    // Rollback if any query fails
    await transaction.rollback();
    // logger.error("Transaction failed and rollbacked", err, logTokens);
    throw err;
  }
}

module.exports = {
preparedStatement,
  runTransaction,
  getPreparedStatementInputs,
  getConnection
};
