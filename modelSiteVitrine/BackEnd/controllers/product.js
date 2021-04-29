const Product = require('../models/index').Product;
const firesystem = require('fs');
const multer = require('../middlewares/multer');
const auth = require('../middlewares/auth');


//route pour creer un product
// exports.createProduct = (req, res, next) => {
//     const product = req.file;
//         product.create({
//             attachment: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
//             title:product.title,
//             description: product.description,
//             price: product.price,
//             idUser: product.idUser
//             }).then(product => {
//                     res.status(201).json({ 
//                         message: product 
//                     })            
//             })
//             .catch(error => res.status(404).json({ error:"erreur dans la requête sans image" })); 
               
// }
exports.createProduct = (req, res, next) => {
    const product = req.body;
        Product.create({
            ...product,
             attachment: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, 
        }).then(() => { res.status(201).json({ message: 'produit crée!' }) })
        .catch((error) => { res.status(400).json({ error: error }) });
};

