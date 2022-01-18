const db = require("../models");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const { Op } = require("sequelize");

// Controlleur pour la route POST /api/user/auth/signup - Création d'un utilisateur
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            db.users.create({
                email: req.body.email,
                password: hash,
                nickname: req.body.nickname
            })
                .then(user => {
                    let token = jwt.sign(
                        { userId: user.userId },
                        process.env.JWT,
                        { expiresIn: '8h' }
                    )
                    res
                        .status(200)
                        .cookie('access_token', token, {
                            httpOnly: true,
                            domain: process.env.SITE_DOMAIN,
                            expires: new Date(Date.now() + 8 * 3600000)
                        })
                        .cookie('isLoggedIn', true, {
                            httpOnly: false,
                            domain: process.env.SITE_DOMAIN,
                            expires: new Date(Date.now() + 8 * 3600000)
                        })
                        .cookie('ID', user.id, {
                            httpOnly: false,
                            domain: process.env.SITE_DOMAIN,
                            expires: new Date(Date.now() + 8 * 3600000)
                        })
                        .json({ id: user.id, createdAt: user.createdAt, email: user.email, userId: user.userId, imgUrl: user.imgUrl, isAdmin: user.isAdmin, nickname: user.nickname });
                })
                .catch(error => res.status(400).json({ error }))
        })
        .catch(error => res.status(500).json({ error }))
};

// Controlleur pour la route POST /api/user/auth/login - Connexion d'un utilisateur
exports.login = (req, res, next) => {
    db.users.findOne({ where: { email: req.body.email } })
        .then(user => {
            if (!user) {
                return res.status(401).json({ code: 1, message: "Cet utilisateur n'existe pas" });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ code: 2, message: "Le mot de passe est incorrect" });
                    }
                    if (user.banned === true) { return res.status(401).json({ code: 3, message: "Votre compte a été banni" }); }
                    let token = jwt.sign(
                        { userId: user.userId },
                        process.env.JWT,
                        { expiresIn: '8h' }
                    )
                    res
                        .status(200)
                        .cookie('access_token', token, {
                            httpOnly: true,
                            domain: process.env.SITE_DOMAIN,
                            expires: new Date(Date.now() + 8 * 3600000)
                        })
                        .cookie('isLoggedIn', true, {
                            httpOnly: false,
                            domain: process.env.SITE_DOMAIN,
                            expires: new Date(Date.now() + 8 * 3600000)
                        })
                        .cookie('ID', user.id, {
                            httpOnly: false,
                            domain: process.env.SITE_DOMAIN,
                            expires: new Date(Date.now() + 8 * 3600000)
                        })
                        .json({ id: user.id, createdAt: user.createdAt, email: user.email, userId: user.userId, imgUrl: user.imgUrl, isAdmin: user.isAdmin, nickname: user.nickname });
                })
                .catch(error => res.status(500).json({ error }))
        })
        .catch(error => res.status(500).json({ error }))
};

// Controlleur pour la route GET /api/user/auth/logout - Déconnexion d'un utilisateur
exports.logout = (req, res, next) => {
    res
        .status(200)
        .cookie('access_token', "", {
            domain: process.env.SITE_DOMAIN,
            expires: new Date(Date.now() - 1)
        })
        .cookie('isLoggedIn', false, {
            domain: process.env.SITE_DOMAIN,
            expires: new Date(Date.now() - 1)
        })
        .cookie('ID', "", {
            domain: process.env.SITE_DOMAIN,
            expires: new Date(Date.now() - 1)
        })
        .json({ message: "Deconnecté" })
}

// Controlleur pour la route GET /api/user/ - Affichage de tous les utilisateurs
exports.getAll = (req, res, next) => {
    db.users.findAll({
        order: [['nickname', 'ASC']],
        attributes: ['nickname', 'imgUrl', 'id', 'loggedIn', 'isAdmin'],
        where: { userId: { [Op.not]: req.token.userId } }
    })
        .then(users => res.status(200).json(users))
        .catch(error => res.status(400).json({ error }));
}

// Controlleur pour la route GET /api/user/:id - Affichage d'un utilisateur
exports.getOne = (req, res, next) => {
    db.users.findByPk(req.params.id, {
        attributes: ['userId', 'id', 'nickname', 'email', 'imgUrl', 'isAdmin', 'loggedIn', 'createdAt', 'updatedAt']
    })
        .then(user => {
            if (user.userId === req.token.userId) { res.status(200).json({ id: user.id, nickname: user.nickname, email: user.email, imgUrl: user.imgUrl, isAdmin: user.isAdmin, loggedIn: user.loggedIn, createdAt: user.createdAt, updatedAt: user.updatedAt }) }
            else { res.status(200).json({ nickname: user.nickname, imgUrl: user.imgUrl, id: user.id, loggedIn: user.loggedIn, isAdmin: user.isAdmin, createdAt: user.createdAt }) }
        })
        .catch(error => res.status(404).json({ error }))
}

// Controlleur pour la route PUT /api/user/:id - Modification d'un utilisateur
exports.updateUser = (req, res, next) => {
    db.users.findOne({ where: { userId: req.token.userId } })
        .then(userFrom => {
            db.users.findByPk(req.params.id)
                .then(user => {
                    if (user.userId === req.token.userId || userFrom.isAdmin === true) {
                        if (req.body.password) {
                            bcrypt.hash(req.body.password, 10)
                                .then(hash => {
                                    db.users.update({ password: hash }, { where: { userId: user.userId } })
                                        .then(res.status(200).json({ message: "Mot de passe modifié" }))
                                        .catch(error => res.status(500).json({ error }));
                                })
                                .catch(error => res.status(500).json({ error }));
                        } else {
                            let imgUrl = req.file ? req.file.filename : user.imgUrl
                            let nickname = req.body.nickname ? req.body.nickname : user.nickname
                            let banned = 0
                            if (userFrom.isAdmin === true) { banned = req.body.banned ? req.body.banned : 0 }
                            db.users.update({
                                nickname: nickname,
                                imgUrl: imgUrl,
                                banned: banned
                            }, {
                                where: {
                                    userId: user.userId
                                }
                            })
                                .then(res.status(200).json({ message: "Utilisateur modifié" }))
                                .catch(error => res.status(500).json({ error }));
                        }
                    } else {
                        res.status(401).json({ error: `Vous n'êtes pas autorisé à modifier cet utilisateur` })
                    }
                })
                .catch(error => res.status(404).json({ error }));
        })
        .catch(error => res.status(404).json({ error }));
}

// Controlleur pour la route DELETE /api/user/:id - Suppression d'un utilisateur
exports.deleteUser = (req, res, next) => {
    db.users.findOne({ where: { userId: req.token.userId } })
        .then(userFrom => {
            db.users.findByPk(req.params.id)
                .then(user => {
                    if (user.userId === req.token.userId || userFrom.isAdmin === true) {
                        if (user.imgUrl) {
                            const filename = user.imgUrl.split('/images/')[1]
                            fs.unlink(`img/${filename}`, () => {
                                db.users.destroy({ where: { id: req.params.id } })
                                    .then(res.status(200).json({ message: "L'utilisateur a été supprimé" }))
                                    .catch(error => res.status(500).json({ error }));
                            })
                        } else {
                            db.users.destroy({ where: { id: req.params.id } })
                                .then(res.status(200).json({ message: "L'utilisateur a été supprimé" }))
                                .catch(error => res.status(500).json({ error }));
                        }
                    } else {
                        res.status(401).json({ error: "Vous n'êtes pas autorisé à supprimer cet utilisateur" })
                    }
                })
                .catch(error => res.status(404).json({ error }));
        })
        .catch(error => res.status(404).json({ error }));
}