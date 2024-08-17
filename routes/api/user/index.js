const userHelper = require('./../../../lib/userHelper');

function getUsers(req, res, next) {
  userHelper.getUsers(req.logTokens, (data) => {
    res.json(data);
  });
}

module.exports = {
  getUsers
};