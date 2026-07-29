import { Sequelize } from "sequelize";
import { config } from "./index.js";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: config.db.storage,
  logging: false,
});

export default sequelize;
