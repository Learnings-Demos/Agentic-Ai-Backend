import { Sequelize, Dialect } from "sequelize";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const sequelize = new Sequelize({
  host: process.env.DATABASE_HOST as string,
  dialect: process.env.DIALECT as Dialect,
  port: 5432,
  logging: false,
  database: process.env.DATABASE as string,
  username: process.env.DATABASE_USERNAME as string,
  password: process.env.DATABASE_PASSWORD as string,
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database Connected..!!");
  } catch (error) {
    console.error("Unable to connect to the database", error);
  }
})();

export default sequelize;
