'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
      await queryInterface.createTable('Images', 
          { 
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false
                }, 
                name: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                ImagePath: {
                    type: Sequelize.STRING
                },
                type: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                mime: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                size: {
                    type: Sequelize.STRING,
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
    
    await queryInterface.dropTable('Images');
    
  }
};
