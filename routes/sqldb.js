const express = require('express');
const router = express.Router();

const user = require('./api/user');



router.get('/users', user.getUsers);
router.get('/user/:acf2id', user.getUser);


module.exports = router;