const db = require('../models');
const fs = require('fs');
const { Op } = require("sequelize");

// Controlleur pour la route POST /api/posts/ - Création d'un post
exports.createPost = (req, res, next) => {
    db.users.findOne({
        attributes: ["id"],
        where: { userId: req.token.userId }
    })
        .then(user => {
            db.posts.create({
                content: req.body.content,
                imgUrl: req.file ? `${process.env.API_URL}/images/${req.file.filename}` : null,
                userId: user.id
            })
                .then(() => res.status(201).json({ message: "Post créé" }))
                .catch(error => res.status(400).json({ message: error }));
        })
        .catch(error => res.status(404).json({ error }));
}

// Controlleur pour la route GET /api/posts/ - Affichage de tous les posts et commentaires associés
exports.getAll = (req, res, next) => {
    db.posts.findAll({
        order: [['createdAt', 'DESC'], [db.comments, 'createdAt', 'ASC']],
        include: [
            {
                model: db.users,
                attributes: ["id", "nickname", "imgUrl", "isAdmin", "loggedIn"]
            },
            {
                model: db.comments,
                include: [{ model: db.users, attributes: ["id", "nickname", "imgUrl", "isAdmin", "loggedIn"] }]
            },
            {
                model: db.likes,
                attributes: ["userId"],
                include: [{ model: db.users, attributes: ["nickname"] }]
            }]
    })
        .then(posts => res.status(200).json(posts))
        .catch(error => res.status(400).json({ error }));
}

// Controlleur pour la route GET /api/posts/user/:id - Affichage des posts d'un utilisateurs
exports.getUserPost = (req, res, next) => {
    db.posts.findAll({
        where: { userId: req.params.id },
        order: [['createdAt', 'DESC'], [db.comments, 'createdAt', 'ASC']],
        include: [
            {
                model: db.users,
                attributes: ["id", "nickname", "imgUrl", "isAdmin", "loggedIn"]
            },
            {
                model: db.comments,
                include: [{ model: db.users, attributes: ["id", "nickname", "imgUrl", "isAdmin", "loggedIn"] }]
            },
            {
                model: db.likes,
                attributes: ["userId"],
                include: [{ model: db.users, attributes: ["nickname"] }]
            }]
    })
        .then(posts => res.status(200).json(posts))
        .catch(error => res.status(404).json({ error }))
}

// Controlleur pour la route GET /api/posts/mostlikedpics - Affichage des 5 images postées les plus likées => manque systeme like pour l'instant, à finir plus tard
exports.getMostLikedPics = (req, res, next) => {
    db.posts.findAll({
        where: {
            imgUrl: {
                [Op.not]: null
            }
        },
        attributes: [
            "imgUrl",
            [
                db.sequelize.literal(
                    '(SELECT COUNT(*) FROM likes WHERE "postId" = post.id)'
                ),
                "count",
            ],
        ],
        order: [[db.sequelize.literal("count"), "DESC"]],
        limit: 5,
        include: [
            {
                model: db.users,
                attributes: ["nickname", "imgUrl"],
            },
        ]
    })
        .then(posts => res.status(200).json(posts))
        .catch(error => res.status(400).json({ error }));
}



// Controlleur pour la route PUT /api/posts/:id - Modification d'un post
exports.updatePost = (req, res, next) => {
    db.posts.findOne({
        where: { id: req.params.id },
        include: db.users
    })
        .then(post => {
            if (post.user.userId === req.token.userId) {
                let imgUrl = req.file ? req.file.filename : post.imgUrl
                db.posts.update({
                    content: req.body.content,
                    imgUrl: imgUrl
                }, {
                    where: {
                        id: post.id
                    }
                })
                    .then(() => res.status(200).json({ message: "Post modifié !" }))
                    .catch(error => res.status(400).json({ error }));
            } else {
                res.status(401).json({ error: "Vous n'êtes pas autorisé à modifier ce post" })
            }
        })
        .catch(error => res.status(400).json({ error }));
}

// Controlleur pour la route DELETE /api/posts/:id - Suppression d'un post
exports.deletePost = (req, res, next) => {
    db.posts.findOne({
        where: { id: req.params.id },
        include: db.users
    })
        .then(post => {
            if (post.user.userId === req.token.userId) {
                if (post.imgUrl) {
                    const filename = post.imgUrl.split('/images/')[1]
                    fs.unlink(`img/${filename}`, () => {
                        db.posts.destroy({ where: { id: post.id } })
                            .then(() => res.status(200).json({ message: `Le post a été supprimé` }))
                            .catch(error => res.status(404).json({ error }));
                    })
                } else {
                    db.posts.destroy({ where: { id: post.id } })
                        .then(() => res.status(200).json({ message: `Le post a été supprimé` }))
                        .catch(error => res.status(404).json({ error }));
                }
            } else {
                res.status(401).json({ error: "Vous n'êtes pas autorisé à supprimer ce post" })
            }
        })
        .catch(error => res.status(404).json({ error }));
}







// COMMENTAIRES
// Controlleur pour la route POST /api/posts/:id/comment - Création d'un commentaire
exports.createComment = (req, res, next) => {
    db.users.findOne({
        attributes: ["id"],
        where: { userId: req.token.userId }
    })
        .then(user => {
            db.comments.create({
                content: req.body.content,
                userId: user.id,
                postId: req.params.id
            })
                .then(() => res.status(201).json({ message: "Commentaire créé" }))
                .catch(error => res.status(400).json({ message: error }));
        })
        .catch(error => res.status(404).json({ error }));
}

// Controlleur pour la route DELETE /api/posts/:id/comment/:commentId - Suppression d'un commentaire
exports.deleteComment = (req, res, next) => {
    db.comments.findOne({
        where: { id: req.params.commentId },
        include: db.users
    })
        .then(comment => {
            if (comment.user.userId === req.token.userId) {
                db.comments.destroy({
                    where: {
                        id: comment.id
                    }
                })
                    .then(() => res.status(200).json({ message: `Le commentaire a été supprimé` }))
                    .catch(error => res.status(404).json({ error }));
            } else {
                res.status(401).json({ error: "Vous n'êtes pas autorisé à supprimer ce commentaire" })
            }
        })
        .catch(error => res.status(404).json({ error }));
}

// Controlleur pour la route PUT /api/posts/:id - Modification d'un commentaire
exports.updateComment = (req, res, next) => {
    db.comments.findOne({
        where: { id: req.params.commentId },
        include: db.users
    })
        .then(comment => {
            if (comment.user.userId === req.token.userId) {
                db.comments.update({
                    content: req.body.content
                }, {
                    where: {
                        id: comment.id
                    }
                })
                    .then(() => res.status(200).json({ message: "Commentaire modifié !" }))
                    .catch(error => res.status(400).json({ error }));
            } else {
                res.status(401).json({ error: "Vous n'êtes pas autorisé à modifier ce commentaire" })
            }
        })
        .catch(error => res.status(400).json({ error }));
}






exports.likePost = (req, res, next) => {
    db.users.findOne({
        attributes: ["id"],
        where: { userId: req.token.userId }
    })
        .then(user => {
            db.likes.findOne({
                where: { userId: user.id, postId: req.params.id }
            })
                .then(isLiked => {
                    if (isLiked) {
                        db.likes.destroy({
                            where: { userId: user.id, postId: req.params.id }
                        })
                            .then(() => res.status(200).json({ message: "Like retiré" }))
                            .catch(error => res.status(500).json({ message: error }));
                    }
                    else {
                        db.likes.create({
                            userId: user.id,
                            postId: req.params.id
                        })
                            .then(() => res.status(200).json({ message: "Like ajouté" }))
                            .catch(error => res.status(500).json({ message: error }));
                    }
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(404).json({ error }));
}