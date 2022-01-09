// Définition du modèle post
module.exports = (sequelize, Sequelize) => {
    const Post = sequelize.define("post", {
        content: {
            type: Sequelize.TEXT,
            allowNull: false,
            validate: {
                len: [6, 300],
                notEmpty: true
            }
        },
        imgUrl: {
            type: Sequelize.STRING
        }
    });
    return Post;
};