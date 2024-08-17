
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

async function getUser(logToken, request) {
  const acf2id = request.acf2id;
  const query = `SELECT * FROM dbo.Users WHERE username = '${acf2id}'`;
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
  getUsers,
  getUser
};