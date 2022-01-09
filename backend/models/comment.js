module.exports = (sequelize, Sequelize) => {
    const Comment = sequelize.define("comment", {
        content: {
            type: Sequelize.TEXT,
            allowNull: false,
            validate: {
                len: [6,300],
                notEmpty: true
            }
        }
    });
  
    return Comment;
  };