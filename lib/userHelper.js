const userDB = require('./db/user.db');

function getUsers(logTokens, callback) {
  userDB.getUsers(logTokens)
    .then((data) => {
      callback(data);
    }) .catch((error) => {
      callback(error);
    });
}

function getUser(logTokens, request, callback) {
  userDB.getUser(logTokens, request)
    .then((data) => {
      callback(data);
    }) .catch((error) => {
      callback(error);
    });
}
function addUser(logTokens, request, callback) {
  userDB.addUser(logTokens, request)
    .then((data) => {
      if(data.rowsAffected > 0) {
        callback({
          status: 200,
          message: 'User added successfully',
          msg:'success'
        });
      } else {
        callback({
          status: 201,
          message: 'User not added',
          msg:'error'
        });
      }
    }) .catch((error) => {
      callback(error);
    });
}
module.exports = {
  getUsers,
  getUser,
  addUser
};