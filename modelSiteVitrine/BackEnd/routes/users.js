const express = require('express');
const router = express.Router();

//const auth = require('../middlewares/auth');

//routes
router.post('/signup', multer, userControllers.createAccount);
router.post('/login',  userControllers.login);


module.exports = router;