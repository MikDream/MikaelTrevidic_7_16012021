const bcrypt = require('bcrypt');
const users = require('../models/user');

exports.signup = (req, res, next) => {
    if(!(/^([^\s@]{2,})+@([^\s@]{2,})+(\.{1})+([a-z]|[0-9]{0,})+[^\s@]+$/.test(req.body.email))){
        return res.status(400).json({error: "Format de l'email invalide !"});
    }
    if(!(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/.test(req.body.password))){
        return res.status(400).json({error: 'Format du mot de passe invalide !'});
    }
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            users.create({
                name: req.body.name,
                password: hash,
                email: req.body.email
            })
                .then(() => res.status(201).json({message: 'Utilisateur créé !'}))
                .catch(error => res.status(400).json({error}));
        })
        .catch(error => res.status(500).json({error}));
};

exports.login = (req, res, next) => {
    users.findOne( { where: { email: req.body.email} } )
        .then(user => {
            if(!user){
                return res.status(401).json({error: 'Utilisateur non trouvé !'});
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if(!valid){
                        return res.status(401).json({error: 'Mot de passe incorrect !'});
                    }
                    res.status(200).json({ message: 'Utilisateur connecté !' });
                })
                .catch(error => res.status(500).json({error}));
        })
        .catch(error => res.status(500).json({error}));
};

exports.test = (req, res, next) => {
    users.findAll()
        .then(user => res.status(200).json(user))
        .catch(error => res.status(400).json({error}));
};