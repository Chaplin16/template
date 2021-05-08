'use strict';
const {Sequelize,DataTypes, database} = require('./connexion');

const Role = database.define('Role', {
    member: {
      allowNull: false,
      required: true,
      type: DataTypes.STRING,
    },
    admin: {
      allowNull: false,
      required: true,
      type:DataTypes.BOOLEAN,
    },
  }, {
    Sequelize,
    modelName: 'Role',
    paranoid: false
    }
);

module.exports = Role;