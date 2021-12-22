module.exports = (sequelize, Sequelize) => {
    const Comment = sequelize.define("comment", {
        content: {
            type: Sequelize.TEXT,
            allowNull: false,
            validate: {
                isAlphanumeric: true,
                len: [6,30],
                notEmpty: true
            }
        }
    });
  
    return Comment;
  };