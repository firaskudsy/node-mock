const userDB = require('./db/user.db');

function getUsers(logTokens, callback) {
  userDB.getUsers(logTokens)
    .then((data) => {
      callback(data);
    }) .catch((error) => {
      callback(error);
    });
}

module.exports = {
  getUsers
};