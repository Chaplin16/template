const Product = require('../models/product');
const User = require('../models/user');
const firesystem = require('fs');
const multer = require('../middlewares/multer');
const auth = require('../middlewares/auth');

//route pour creer un product
exports.createProduct = (req, res, next) => {
    const product= JSON.parse(req.body.product);
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

//route pour voir tous les produits
exports.getAllProducts = (req, res, next) => {
    Product.findAll({ 
        include: [ 
            { model: User} 
        ],
        order:[[
            "createdAt", "DESC"
        ]]
     })
        .then(products => 
            res.status(200).json(products)
        )
        .catch(error => 
            res.status(404).json({ error })
        );
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
                .catch(error => res.status(404).json({ error:"erreur dans la requête" }));   
    }).catch(error => res.status(404).json({ error:"erreur dans la requête" })); 
        
};

//route pour modifier son profil 
exports.modifyProduct = (req, res, next) => {
    if(req.file) {
        const productObject = JSON.parse(req.body.product);
        Product.findOne({ 
            where: { id: req.params.id },
            include:{ model:User }
        })
            .then(product => { 
                product.update({
                    userId: productObject.userId,
                    title: productObject.title,
                    description: productObject.description,
                    price: productObject.price,
                    attachment: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                    })
                    .then(() => res.status(201).json({ message: "chouette!!!" }))
                    .catch(error => res.status(400).json({ message: "dommage1!!!" }));
            
            }).catch(error => res.status(400).json({  message: "dommage2!!!" }));
    }else{
        const newObject = req.body;
        Product.findOne({ where: { id: req.params.id } })
                .then(product => {
                    product.update({
                        userId: newObject.userId,
                        title: newObject.title,
                        description: newObject.description,
                        price: newObject.price,
                       
                    }).then(product => {
                        res.status(201).json({ 
                            message: product 
                    }).catch(error => res.status(404).json({ error:"erreur dans la requête1" })); 
                    })            
                })
                .catch(error => res.status(404).json({ error:"erreur dans la requête2" }));         
    }
}
