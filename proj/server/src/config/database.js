import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, "../../database.db");

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: dbPath,
    logging: false,
    define: {
        freezeTableName: true
    }
});

export default sequelize;
