const express = require('express');
const cookieParser = require('cookie-parser')
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post')
const path = require('path');
const helmet = require("helmet");
require('dotenv').config();
const app = express();


// Attribution des headers aux réponses du serveur
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.SITE_URL);
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

// Parse le body des requetes entrantes et transforme le contenu JSON en objet JS
// Utilisation du middleware CookieParser afin de parser les cookies des requêtes entrantes
// Utilisation du middleware Helmet afin de renforcer la sécurité de l'application via l'ajout de plusieurs headers
// Indique à Express qu'il doit se servir du répertoire statique "img" lors des requêtes sur la route /images/
// Définition des routers à utiliser pour les routes /api/posts et /api/user
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use('/images/', express.static(path.join(__dirname, 'img')));
app.use('/api/posts', postRoutes)
app.use('/api/user', userRoutes)

module.exports = app;