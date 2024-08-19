
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
async function addUser(logToken, request) {
  const user = request.user;
  const firstname = request.firstname;
  const lastname = request.lastname;
  const email = request.email;

  const query = `INSERT INTO dbo.Users (UserName,Password, Host, Access, FirstName, LastName, Location, Team, Comments, Email, new )
  VALUES('${user}', '', '', '', '${firstname}', '${lastname}', '', '', 'Add by user', '${email}', '1')`;


  try {
    const value = await dbHelper.preparedStatement({
      statement: query,
      logTokens: logToken
    });
    return value;
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
  getUser,
  addUser
};