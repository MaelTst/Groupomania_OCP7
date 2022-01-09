// Définition du modèle like
module.exports = (sequelize, Sequelize) => {
  const Like = sequelize.define("like", {});
  return Like;
};