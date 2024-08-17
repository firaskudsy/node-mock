const express = require('express');
const router = express.Router();

const user = require('./api/user');



router.get('/users', user.getUsers);


module.exports = router;