import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Order = sequelize.define("Order", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    items: {
        type: DataTypes.JSON,
        allowNull: false
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM("pending", "processing", "shipped", "delivered", "cancelled"),
        defaultValue: "pending"
    },
    shippingAddress: {
        type: DataTypes.JSON,
        allowNull: true
    }
});

export default Order;
