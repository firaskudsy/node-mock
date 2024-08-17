
const dbHelper = require('../dbHelper');

async function getUsers(logToken) {
  const query = 'SELECT * FROM users';
  try {
    const value = await dbHelper.preparedStatement({
      statement: query,
      logTokens: logToken
    });
    return value.recordset;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  getUsers
};