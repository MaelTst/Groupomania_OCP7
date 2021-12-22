const Post = require('../models/post');
const User = require('../models/user');
const fs = require('fs');

// Controlleur pour la route POST /api/posts/ - Création d'un post
exports.createPost = (req, res, next) => {
    let imgUrl = req.file ? req.file.filename : null
    User.findOne({
        attributes: ["id"],
        where: { userId: req.token.userId }
    })
        .then(user => {
            Post.create({
                content: req.body.content,
                imgUrl: imgUrl,
                UserId: user.id
            })
                .then(() => res.status(201).json({ message: "Post créé" }))
                .catch(error => res.status(400).json({ message: error }));
        })
        .catch(error => res.status(404).json({ error }));
}

// Controlleur pour la route GET /api/posts/ - Affichage de tous les posts
exports.getAll = (req, res, next) => {
    Post.findAll()
        .then(posts => res.status(200).json(posts))
        .catch(error => res.status(400).json({ error }));
}

// Controlleur pour la route GET /api/posts/user/:id - Affichage des posts d'un utilisateurs
exports.getUserPost = (req, res, next) => {
    Post.findAll({
        where: { UserId: req.params.id }
    })
        .then(posts => res.status(200).json(posts))
        .catch(error => res.status(404).json({ error }))
}

// Controlleur pour la route PUT /api/posts/:id - Modification d'un post
exports.updatePost = (req, res, next) => {
    Post.findOne({
        where: { id: req.params.id },
        include: User
    })
        .then(post => {
            if (post.User.userId === req.token.userId) {
                let imgUrl = req.file ? req.file.filename : post.imgUrl
                Post.update({
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
    Post.findOne({
        where: { id: req.params.id },
        include: User
    })
        .then(post => {
            if (post.User.userId === req.token.userId) {
                if (post.imgUrl) { fs.unlink(`images/${post.imgUrl}`) }
                Post.destroy({
                    where: {
                        id: post.id
                    }
                })
                    .then(() => res.status(200).json({ message: `Le post a été supprimé` }))
                    .catch(error => res.status(404).json({ error }));
            } else {
                res.status(401).json({ error: "Vous n'êtes pas autorisé à supprimer ce post" })
            }
        })
        .catch(error => res.status(404).json({ error }));
}

















// Controlleur pour la route POST /api/sauces/:id/like - Like/Dislike d'une sauce
// Récupère les informations de la sauce correspondante au paramètre id de la requête
// Initialise des flags liked/disliked afin de déterminer si l'utilisateur a déjà liké/disliké la sauce
// Gère les trois cas possibles (1,0,-1) via une instruction switch en fonction des flags préalablement créés
exports.likeSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            let liked = sauce.usersLiked.find(id => id === req.token.userId)
            let disliked = sauce.usersDisliked.find(id => id === req.token.userId)
            switch (req.body.like) {
                case 1:
                    if (!liked && !disliked) {
                        Sauce.updateOne({ _id: sauce.id }, { $push: { usersLiked: req.token.userId }, $inc: { likes: 1 } })
                            .then(() => res.status(200).json({ message: `Avis ajouté` }))
                            .catch(error => res.status(400).json({ error }));
                    } else {
                        res.status(400).json({ error: "Vous avez déjà un avis actif pour cette sauce" })
                    }
                    break;
                case 0:
                    if (liked) {
                        Sauce.updateOne({ _id: sauce.id }, { $pull: { usersLiked: req.token.userId }, $inc: { likes: -1 } })
                            .then(() => res.status(200).json({ message: `Avis modifié` }))
                            .catch(error => res.status(400).json({ error }));
                    }
                    if (disliked) {
                        Sauce.updateOne({ _id: sauce.id }, { $pull: { usersDisliked: req.token.userId }, $inc: { dislikes: -1 } })
                            .then(() => res.status(200).json({ message: `Avis modifié` }))
                            .catch(error => res.status(400).json({ error }));
                    }
                    break;
                case -1:
                    if (!liked && !disliked) {
                        Sauce.updateOne({ _id: sauce.id }, { $push: { usersDisliked: req.token.userId }, $inc: { dislikes: 1 } })
                            .then(() => res.status(200).json({ message: `Avis ajouté` }))
                            .catch(error => res.status(400).json({ error }));
                    } else {
                        res.status(400).json({ error: "Vous avez déjà un avis actif pour cette sauce" })
                    }
                    break;
                default:
                    break;
            }
        })
        .catch(error => res.status(500).json({ error }));
}