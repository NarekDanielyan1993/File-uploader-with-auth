'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    await queryInterface.createTable('Users', 
    { 
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING
        },
        emailOrPhoneNumber: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false
        },
        createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: new Date()
        },
        updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: new Date()
        }
    }); 
  },  

  down: async (queryInterface, Sequelize) => {
    
      await queryInterface.dropTable('users');
    
  }
};
