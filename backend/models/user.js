// Définition du modèle user
module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
        nickname: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            validate: {
                len: [6, 30],
                notEmpty: true
            }
        },
        userId: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
                notEmpty: true
            }
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        imgUrl: {
            type: Sequelize.STRING,
            defaultValue: null
        },
        isAdmin: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        loggedIn: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        banned: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        bannerUrl: {
            type: Sequelize.STRING,
            defaultValue: null
        },
        job: {
            type: Sequelize.STRING,
            defaultValue: null
        }
    });
    return User;
};