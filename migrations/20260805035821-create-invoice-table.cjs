"use strict";

const { DataTypes, Sequelize } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.createTable(
        "Invoices",
        {
          id: {
            allowNull: false,
            type: DataTypes.UUID,
            primaryKey: true,
          },
          amount: {
            allowNull: false,
            type: DataTypes.DECIMAL(10, 2),
          },
          description: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          isPaid: {
            allowNull: false,
            type: DataTypes.BOOLEAN,
            defaultValue: false,
          },
          createdFor: {
            allowNull: false,
            type: DataTypes.STRING,
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
      await queryInterface.dropTable("Invoices", { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};