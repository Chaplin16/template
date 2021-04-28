const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const userControllers = require('../controllers/user');
const multer = require('../middlewares/multer');

//routes
router.post('/signup', userControllers.createAccount);
router.post('/login', userControllers.login);

router.get('/getAllUsers', auth, userControllers.getAllUsers);
router.put('/:id/profil/update',auth, userControllers.modifyProfil);
router.put('/:id/password/update', auth, userControllers.modifyUserPassword);

router.delete('/:id/delete', auth, userControllers.userDelete);



module.exports = router;
//router.put('/:id/avatar/update', auth, multer, userControllers.modifyUserAvatar);