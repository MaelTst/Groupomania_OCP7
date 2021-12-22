module.exports = (sequelize, Sequelize) => {
    const Post = sequelize.define("post", {
        content: {
            type: Sequelize.TEXT,
            allowNull: false,
            validate: {
                isAlphanumeric: true,
                len: [6,30],
                notEmpty: true
            }
        },
        imgUrl: {
            type: Sequelize.STRING
        }
    });
  
    return Post;
  };