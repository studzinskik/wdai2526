import sequelize from "../config/database.js";
import User from "./User.js";
import Product from "./Product.js";
import Review from "./Review.js";
import Order from "./Order.js";
import CartItem from "./CartItem.js";

User.hasMany(Review, { foreignKey: "UserId", onDelete: "CASCADE" });
Review.belongsTo(User, { foreignKey: "UserId" });

Product.hasMany(Review, { foreignKey: "ProductId", onDelete: "CASCADE" });
Review.belongsTo(Product, { foreignKey: "ProductId" });

User.hasMany(Order, { foreignKey: "UserId", onDelete: "CASCADE" });
Order.belongsTo(User, { foreignKey: "UserId" });

User.hasMany(CartItem, { foreignKey: "UserId", onDelete: "CASCADE" });
CartItem.belongsTo(User, { foreignKey: "UserId" });

Product.hasMany(CartItem, { foreignKey: "ProductId", onDelete: "CASCADE" });
CartItem.belongsTo(Product, { foreignKey: "ProductId" });

export { sequelize, User, Product, Review, Order, CartItem };
