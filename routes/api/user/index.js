const userHelper = require('./../../../lib/userHelper');

function getUsers(req, res, next) {
  userHelper.getUsers(req.logTokens, (data) => {
    res.json(data);
  });
}

function getUser(req, res, next) {
  userHelper.getUser(req.logTokens, req.params, (data) => {
    res.json(data);
  });
}

module.exports = {
  getUsers,
  getUser
};