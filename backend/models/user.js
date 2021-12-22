const { Sequelize, Model, DataTypes } = require('sequelize');
require('dotenv').config();
const sequelize = new Sequelize(`postgres://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}`)
//const Post = require('./post');

class User extends Model { }

User.init({
    nickname: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isAlphanumeric: true,
            len: [6,30],
            notEmpty: true
        }
    },
    userId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
            notEmpty: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    imgUrl: {
        type: DataTypes.STRING,
        defaultValue: "placeholder.jpg"
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    loggedIn: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: true,
    sequelize,
    modelName: 'User'
});

//User.hasMany(Post);
module.exports = User;

User.sync()