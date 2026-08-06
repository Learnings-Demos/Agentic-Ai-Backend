"use strict";

const { DataTypes, Sequelize } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable(
        "Threads",
        {
          thread_id: {
            allowNull: false,
            type: DataTypes.UUID,
            primaryKey: true,
          },
          title: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          status: {
            type: DataTypes.ENUM,
            values: ["ACTIVE", "INACTIVE"],
            allowNull: false,
            defaultValue: "ACTIVE",
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
      await queryInterface.dropTable("Threads", { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
