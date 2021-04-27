'use strict';
const {Sequelize,DataTypes, database} = require('./connexion');

const User = database.define('User', {
    name: {
      allowNull: false,
      required: true,
      type: DataTypes.STRING,
    },
    firstName: {
      allowNull: false,
      required: true,
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      required: true,
      unique:true
  },
    password: {
      allowNull: false,
      required: true,
      type: DataTypes.STRING,
    },
    avatar: {
      allowNull: true,
      type: DataTypes.STRING,
    },
  }, {
    Sequelize,
    modelName: 'User',
    underscored: false,
    paranoid: false
    }
);

module.exports = User;
