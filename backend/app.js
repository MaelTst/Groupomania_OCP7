const express = require('express');
const cookieParser = require('cookie-parser')
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post')
const path = require('path');
const helmet = require("helmet");
const { Sequelize } = require('sequelize');
require('dotenv').config();
const app = express();

// Test connexion a la base de données
const sequelize = new Sequelize(`postgres://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}`)
async function test() { 
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}
test();

// Attribution des headers aux réponses du serveur
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Parse le body des requetes entrantes et transforme le contenu JSON en objet JS
// Utilisation du middleware Helmet afin de renforcer la sécurité de l'application via l'ajout de plusieurs headers
// Indique à Express qu'il doit se servir du répertoire statique "img" lors des requêtes sur la route /images/
// Définition des routers à utiliser pour les routes /api/sauces et /api/auth
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use('/images/', express.static(path.join(__dirname, 'img')));
app.use('/api/posts', postRoutes)
app.use('/api/user', userRoutes)

module.exports = app;

