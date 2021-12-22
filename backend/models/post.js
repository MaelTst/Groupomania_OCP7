const { Sequelize, Model, DataTypes } = require('sequelize');
require('dotenv').config();
const sequelize = new Sequelize(`postgres://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}`)
const User = require('./user');

class Post extends Model { }

Post.init({
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            isAlphanumeric: true,
            len: [6,30],
            notEmpty: true
        }
    },
    imgUrl: {
        type: DataTypes.STRING
    }
}, {
    timestamps: true,
    sequelize,
    modelName: 'Post'
});

Post.belongsTo(User, {
    onDelete: 'CASCADE'
});
module.exports = Post;

Post.sync()
