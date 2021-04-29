const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const productControllers = require('../controllers/product');
const multer = require('../middlewares/multer');

// ROUTES PRODUCT
router.post('/', auth, multer, productControllers.createProduct);
router.put('/:id/update', auth, multer, productControllers.modifyProduct);
//router.get('/getProducts/:UserId', auth, productControllers.getProducts);
router.get('/getAll', auth, productControllers.getAllProducts);


router.delete('/:id/delete', auth, multer, productControllers.deleteProduct);


module.exports = router;