const User = require('../models/index').User;
const firesystem = require('fs');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken'); //creation de token et verification
const passwordValidator = require('password-validator');
const multer = require('../middlewares/multer');

//creation du schema
let schema = new passwordValidator();
schema
    .is().min(8) //au moins 8 caractères
    .is().max(20) // pas plus de 20 caractères
    .has().uppercase() // au moins une minuscule
    .has().lowercase() // au moins une majuscule
    .has().digits(1) // au moins un chiffre
    .has().not().spaces()  //pas d espaces                         
    .is().not().oneOf(['Passw0rd', 'Password123']); // pas de mdp bateau


//enregistrement des nouveaux utilisateurs dans BDD
//regex et hachage du mot de passe
exports.createAccount = (req, res, next) => {
    if (!schema.validate(req.body.password)) {
        res.status(400).json({ error: "le mot de passe doit contenir au moins 8 caractères dont 1chiffre, 1 lettre majuscule et 1 minuscule" });
    } else {
         bcrypt.hash(req.body.password, 10) //hash le mot de passe, on execute 10 fois l algorithme de hachage
             .then(hash => {//on recupere le hash du MDP et on le met ds un objet pour l enregistrer dans la BDD
                User.create({
                    name: req.body.name,
                    firstName: req.body.firstName,
                    email: req.body.email,
                    password: hash
                }).then(() => res.status(201).send({ message: "Nouvel utilisateur créé !" }))
                .catch(error => res.status(400).json({ error: "éléments manquants" }));
             })
             .catch(error => res.status(500).json({ error }));
    }
};

// connections des utilisateurs deja existants
exports.login = (req, res, next) => {
    const email = req.body.email;
    User.findOne({ where: { email } })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: `Il n y a pas d'utilisateur avec ce mail ${email}!` });
            }

            const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]{2,}\.[a-zA-Z]{2,4}$/;
            if (!regexEmail.test(req.body.email)) {
                res.status(401).json({ error: "Rentrez un mail valide" })
                return false
            }

            bcrypt.compare(req.body.password, user.password) // on compare le mdp qui est envoye dans la requete avec le mdp hashé qui est dans la BDD,
                .then(valid => {
                    if (!valid) {
                        return res.status(401).send({ error: 'Mot de passe incorrect !' });
                    } 
                    res.status(200).json({
                        user: user.toJSON(),
                        token: jsonwebtoken.sign( //fonction sign prend en argument
                            { 
                                id: user.id,
                             }, //1 argument : les données que l on veut encoder à l int de ce token
                            `${process.env.TOP_SECRET}`, // 2ieme argument : clef secrete de l encodage 
                            { expiresIn: '24h' } // chq TOKEN dure 24h 
                        )
                    });
                })
                .catch(error => res.status(500).send({ message: error }));
        })
        .catch(error =>
            res.status(500).send({ error })
        );
};

//route pour voir le profil d'un utilisateur
// exports.getOneUser = (req, res, next) => {
//     User.findOne({ where: { id: req.params.id } })
//         .then(user => res.status(200).json(user))
//         .catch(error => res.status(404).json({ error }));
// };

//route pour voir les utilisateurs PB A VOIR!!!!  
exports.getAllUsers = (req, res, next) => {  
    User.findAll()
        .then(users => res.status(200).json(users))
        .catch(error => res.status(404).json({ error }));
};

//route pour modifier son profil 
exports.modifyProfil = (req, res, next) => {
    if(req.body){
        User.findOne({ where: { id: req.params.id } })
            .then(user => {
                const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]{2,}\.[a-zA-Z]{2,4}$/;
                if (!regexEmail.test(req.body.email)) {
                    res.status(401).json({ error: "Rentrez un mail valide" })
                    return false
                }
                user.update({
                    name: req.body.name,
                    firstName: req.body.firstName,
                    email: req.body.email,
                })

            .then(() => res.status(200).json({ 
                message: user 
            }))
            .catch(error => res.status(400).json({ 
                error 
            }));
            
        })
    }
}

//route pour changer le mot de passe
exports.modifyUserPassword = (req, res, next) => {
    if(req.body){
        User.findOne({ where: { id: req.params.id } })
            .then(user => {
                bcrypt.compare(req.body.password, user.password) // on compare le mdp qui est envoye dans la requete avec le mdp hashé qui est dans la BDD,
                    .then(valid => {
                        if (!valid) {
                            return res.status(401).send({ error: 'Mot de passe incorrect !' });
                        }else {
                            if (!schema.validate(req.body.newPassword)) {
                                res.status(400).json({ error: "Votre mot de passe doit contenir au moins 8 caractères dont 1chiffre, 1 lettre majuscule et 1 lettre minuscule" });
                                
                            } else {
                                bcrypt.hash(req.body.newPassword, 10) //hash le mot de passe, on execute 10 fois l algorithme de hachage
                                .then(hash => {   
                                    user.update({ password: hash })
                                        .then(() =>
                                            res.status(200).json({ message: 'Votre mot de passe est modifié!' }))
                                        .catch(error =>
                                            res.status(400).json({ error }) );
                                }).catch(error => res.status(400).json({ error }) );              
                            } 
                        }
                    }).catch(error => res.status(400).json({ error }) );  

              
            }).catch(error => res.status(400).json({ error }) );  
    }
}
// route pour supprimer le compte de l'utilisateur
exports.userDelete = (req, res, next) => {
    const id = req.params.id
        if(id == req.token.id ){   //  pour verifier si admin || req.token.isAdmin
                User.destroy({ where: { id: id } })
                    .then(() => 
                        res.status(200).json({ 
                            message: 'utilisateur supprimé !' 
                    }))
                    .catch(error => 
                        res.status(400).json({ 
                            error 
                    }))
        }else{
            console.log("vous ne pouvez pas effacer cet utilisateur")
        }
};

//route pour changer d'avatar  
// exports.modifyUserAvatar = (req, res, next) => {
//     if(req.file){
//     User.findOne({ where: { id: req.params.id } })
//     .then(user => {
//         const filename = user.avatar.split('/images/')[1];
//             firesystem.unlink(`images/${filename}`, (error => {
//                 if(error) 
//                     {console.log(error)}
//                 else {
//                     console.log("image effacée");
//                 }
//             })) 
//         const avatar = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
   
//             user.update({ avatar: avatar }) 
                
//                 .then(() => res.status(200).json( avatar))
//                 .catch(error => res.status(400).json({ error }));
//         }) 
//         .catch(error => 
//             res.status(500).json({ error: 'Problème de serveur!!' })   
//         );
//     }else {
//         console.log("erreur lors de la modification de l'avatar")
//     }
// };