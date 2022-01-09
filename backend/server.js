const http = require('http');
const app = require('./app');
const db = require("./models");
const bcrypt = require('bcrypt');

// Verifie que la valeur passée est un Int positif et le return, sinon return False
const normalizePort = val => {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.API_PORT || '3000');
app.set('port', port);

// Gestion des erreurs EACCES / EADDRINUSE
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// Synchronisation des models/tables & Création du compte administrateur si non détécté
const server = http.createServer(app);
server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  db.sequelize.sync()
    .then(function () {
      console.log('Tables synchronisées');
      console.log('Listening on ' + bind);
      db.users.findOne({ where: { isAdmin: true } })
        .then(user => {
          if (user) {
            console.log(`\nCompte administrateur existant : ${user.email}`);
          } else {
            console.log("\nAucun compte administrateur détécté\n");
            bcrypt.hash(process.env.ADMIN_PASSWORD, 10)
              .then(hash => {
                db.users.create({
                  email: process.env.ADMIN_EMAIL,
                  password: hash,
                  nickname: "SuperAdmin",
                  isAdmin: true
                })
                  .then(() => console.log(`Compte administrateur créé :\nEmail : ${process.env.ADMIN_EMAIL}\nMot de passe : ${process.env.ADMIN_PASSWORD}\nConservez bien vos identifiants`))
                  .catch(error => console.log(error.message))
              })
              .catch(error => console.log(error.message))
          }
        })
        .catch(error => console.log(error.message));
    })
    .catch(error => console.log(error.message));
});

server.listen(port);