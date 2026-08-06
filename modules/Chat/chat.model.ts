import { DataTypes } from "sequelize";
import sequelize from "../../config/database";

const ThreadModel = sequelize.define(
  "Threads",
  {
    thread_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    freezeTableName: true,
  }
);

export default ThreadModel;
