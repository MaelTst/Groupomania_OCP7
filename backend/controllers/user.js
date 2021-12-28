const db = require("../models");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Controlleur pour la route POST /api/user/auth/signup - Création d'un utilisateur
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            db.users.create({
                email: req.body.email,
                password: hash,
                nickname: req.body.nickname
            })
                .then(() => res.status(201).json({ message: 'Utilisateur créé' }))
                .catch(error => res.status(400).json({ error }))
        })

        .catch(error => res.status(500).json({ error }))
};

// Controlleur pour la route POST /api/user/auth/login - Connexion d'un utilisateur
exports.login = (req, res, next) => {
    db.users.findOne({ where: { email: req.body.email } })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: "Cet utilisateur n'existe pas" });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: "Votre mot de passe est incorrect" });
                    }
                    let token = jwt.sign(
                        { userId: user.userId },
                        process.env.JWT,
                        { expiresIn: '8h' }
                    )
                    res
                        .status(200)
                        .cookie('access_token', token, {
                            httpOnly: true,
                            expires: new Date(Date.now() + 8 * 3600000)
                        })
                        .status(200).json({ message: "Connecté !" });

                })
                .catch(error => res.status(500).json({ error }))
        })
        .catch(error => res.status(500).json({ error }))
};

// Controlleur pour la route GET /api/user/ - Déconnexion d'un utilisateur
exports.logout = (req, res, next) => {
    res
        .status(200).cookie('access_token', "", {
            expires: new Date(Date.now() - 1)
        })
        .redirect(301, '/login')


}

// Controlleur pour la route GET /api/user/ - Affichage de tous les utilisateurs
exports.getAll = (req, res, next) => {
    db.users.findAll({
        attributes: ['nickname', 'imgUrl', 'id', 'loggedIn', 'isAdmin']
    })
        .then(users => res.status(200).json(users))
        .catch(error => res.status(400).json({ error }));
}

// Controlleur pour la route GET /api/user/:id - Affichage d'un utilisateur
exports.getOne = (req, res, next) => {
    db.users.findByPk(req.params.id, {
        attributes: ['nickname', 'imgUrl', 'id', 'loggedIn', 'isAdmin']
    })
        .then(user => res.status(200).json(user))
        .catch(error => res.status(404).json({ error }))
}

// Controlleur pour la route PUT /api/user/:id - Modification d'un utilisateur
exports.updateUser = (req, res, next) => {
    db.users.findByPk(req.params.id)
        .then(user => {
            if (user.userId === req.token.userId) {
                let imgUrl = req.file ? req.file.filename : user.imgUrl
                db.users.update({
                    nickname: req.body.nickname,
                    email: req.body.email,
                    imgUrl: imgUrl
                }, {
                    where: {
                        userId: user.userId
                    }
                })
                    .then(res.status(200).json({ message: "Utilisateur modifié" }))
                    .catch(error => res.status(500).json({ error }));
            } else {
                res.status(401).json({ error: `Vous n'êtes pas autorisé à modifier cet utilisateur` })
            }
        })
        .catch(error => res.status(400).json({ error }));
}

// Controlleur pour la route DELETE /api/user/:id - Suppression d'un utilisateur
exports.deleteUser = (req, res, next) => {
    db.users.findByPk(req.params.id)
        .then(user => {
            if (user.userId === req.token.userId) {
                //fs.unlink(`images/${user.imgUrl}`, () => {
                db.users.destroy({
                    where: {
                        id: req.params.id
                    }
                })
                    .then(res.status(200).json({ message: "L'utilisateur a été supprimé" }))
                    .catch(error => res.status(404).json({ error }));
                //});
            } else {
                res.status(401).json({ error: "Vous n'êtes pas autorisé à supprimer cet utilisateur" })
            }
        })
        .catch(error => res.status(404).json({ error }));
}