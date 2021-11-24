'use strict';
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    content: DataTypes.STRING,
    attachment: DataTypes.STRING,
    likes: DataTypes.INTEGER,
    disLikes: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    usersLiked: '',
    usersDisliked: ''
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.Message.belongsTo(models.User, {
          as: 'User',
          foreignKey: {
            name: 'userId',
            allowNull: false,
          }
        });
        models.Message.hasMany(models.Like);
      }
    }
  });
  return Message;
};