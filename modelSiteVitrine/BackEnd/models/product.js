const User = require('../models/user');

'use strict';
const {Sequelize,DataTypes, database} = require('./connexion');

const Product = database.define('Product', {
    userId:{
      type: Sequelize.INTEGER,
      references: { model: User, key: 'id' },
    },
      attachment: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    title: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    description: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    price: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
  }, {
    Sequelize,
    modelName: 'Product',
    paranoid: false
    }
);


Product.belongsTo(User);  

module.exports = Product;