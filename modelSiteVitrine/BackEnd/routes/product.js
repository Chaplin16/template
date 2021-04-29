const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const productControllers = require('../controllers/product');
const multer = require('../middlewares/multer');

// ROUTES PRODUCT
router.post('/', auth, multer, productControllers.createProduct);

//router.get('/getProducts/:UserId', auth, productControllers.getProducts);
// router.get('/getAll', auth, productControllers.getAllProducts);

// router.delete('/:id/delete', auth, productControllers.productDelete);


module.exports = router;