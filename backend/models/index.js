require('dotenv').config();
const Sequelize = require('sequelize');
const sequelize = new Sequelize(`postgres://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}`)

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./user.js")(sequelize, Sequelize);
db.posts = require("./post.js")(sequelize, Sequelize);
db.comments = require("./comments.js")(sequelize, Sequelize);

db.users.hasMany(db.posts, {
    onDelete: 'CASCADE' })
db.users.hasMany(db.comments, {
    onDelete: 'CASCADE' })

db.posts.belongsTo(db.users)
db.posts.hasMany(db.comments, {
    onDelete: 'CASCADE' })

db.comments.belongsTo(db.posts)
db.comments.belongsTo(db.users)

module.exports = db;