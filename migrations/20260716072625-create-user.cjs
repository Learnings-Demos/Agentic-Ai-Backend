"use strict";

const { DataTypes, Sequelize } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable(
        "Users",
        {
          id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID,
          },
          name: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
          },
          password: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
          },
          updatedAt: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
          },
        },
        {
          transaction,
          freezeTableName: true,
        }
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable("Users", { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
