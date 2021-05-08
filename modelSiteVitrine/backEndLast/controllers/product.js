const Product = require('../models/index').Product;
const firesystem = require('fs');
const multer = require('../middlewares/multer');
const auth = require('../middlewares/auth');

//route pour creer un product
exports.createProduct = (req, res, next) => {
    const product= JSON.parse(req.body.product);
    console.log(product)
    if(req.file) {
        Product.create({
            userId: product.userId,
            title: product.title,
            description: product.description,
            price: product.price,
            attachment: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, 
        }).then(() => { res.status(201).json({ 
            message: 'produit crée!' 
          }) 
        })
        .catch((error) => { res.status(400).json({ 
            error: error 
        }) });
    }
};

//route pour modifier un produit
exports.modifyProduct = (req, res, next) => {
    //si nouvelle image reçue dans la requete
        if(req.file) {
            Product.findOne({ _id: req.params.id })
            .then(product => {
                const filename = sauce.attachment.split('/images/')[1];
                firesystem.unlink(`images/${filename}`, (error => {
                    if(error) 
                        {console.log(error)}
                    else {
                        console.log("image effacée");
                    }
                })) 
            })
        };
        const product = req.file ?
            {   
                ...req.body,
                attachment: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
            } : { ...req.body };
        Product.updateOne({ _id: req.params.id }, { ...product, id: req.params.id }) //verification de l id du user modificateur
            .then(() => res.status(200).json({ message: 'produit modifiée !' }))
            .catch(error => res.status(400).json({ error }));
};

//route pour supprimer un produit
exports.deleteProduct = (req, res, next) => {
    Product.findOne({ 
        where: {
            id:req.params.id
        }
    }).then(product => {
        //if(product.userId == req.token.userId || req.token.isAdmin ){
            if(req.file){
                const filename = product.attachment.split('/images/')[1];
                firesystem.unlink(`images/${filename}`, (error => {
                    if(error) 
                        {console.log(error)}
                    else {
                        console.log("image effacée");
                    }
                })) 
            }
            Product.destroy({ where: { id: req.params.id } })
            .then(() => 
                res.status(200).json({ 
                    message: 'Votre produit est supprimé !' 
            }))
            .catch(error => 
                res.status(400).json({ 
                    error 
            }))
        // }else {
        //     res.status(401).json({ "message":"Vous n'avez pas les droits pour supprimer ce produit" }) 
        // }    
    })
        
};

