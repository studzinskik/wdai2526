import { Review, Product, User } from "../models/index.js";

export const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        
        const reviews = await Review.findAll({
            where: { ProductId: productId },
            include: [{
                model: User,
                attributes: ["id", "firstName", "lastName"]
            }],
            order: [["createdAt", "DESC"]]
        });
        
        res.json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const createReview = async (req, res) => {
    try {
        const { productId } = req.params;
        const { rating, message } = req.body;
        const userId = req.user.id;
        const email = req.user.email;

        if (!rating || !message) {
            return res.status(400).json({ message: "Rating and message are required" });
        }
        
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Rating must be between 1 and 5" });
        }
        
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        
        const existingReview = await Review.findOne({
            where: { UserId: userId, ProductId: productId }
        });
        
        if (existingReview) {
            return res.status(400).json({ message: "You have already reviewed this product" });
        }
        
        const review = await Review.create({
            rating,
            message,
            email,
            UserId: userId,
            ProductId: productId
        });
        
        const allReviews = await Review.findAll({ where: { ProductId: productId } });
        const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
        await product.update({
            rating: avgRating.toFixed(1),
            ratingCount: allReviews.length
        });
        
        const reviewWithUser = await Review.findByPk(review.id, {
            include: [{
                model: User,
                attributes: ["id", "firstName", "lastName"]
            }]
        });
        
        res.status(201).json(reviewWithUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, message, email } = req.body;
        const userId = req.user.id;
        
        const review = await Review.findByPk(id);
        
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }
        
        if (review.UserId !== userId) {
            return res.status(403).json({ message: "Not authorized to edit this review" });
        }
        
        if (rating && (rating < 1 || rating > 5)) {
            return res.status(400).json({ message: "Rating must be between 1 and 5" });
        }
        
        await review.update({
            rating: rating || review.rating,
            message: message || review.message,
            email: email || review.email
        });
        
        const product = await Product.findByPk(review.ProductId);
        const allReviews = await Review.findAll({ where: { ProductId: review.ProductId } });
        const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
        await product.update({
            rating: avgRating.toFixed(1),
            ratingCount: allReviews.length
        });
        
        const reviewWithUser = await Review.findByPk(review.id, {
            include: [{
                model: User,
                attributes: ["id", "firstName", "lastName"]
            }]
        });
        
        res.json(reviewWithUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;
        
        const review = await Review.findByPk(id);
        
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }
        
        if (review.UserId !== userId && userRole !== "admin") {
            return res.status(403).json({ message: "Not authorized to delete this review" });
        }
        
        const productId = review.ProductId;
        await review.destroy();
        
        const product = await Product.findByPk(productId);
        const allReviews = await Review.findAll({ where: { ProductId: productId } });
        
        if (allReviews.length > 0) {
            const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
            await product.update({
                rating: avgRating.toFixed(1),
                ratingCount: allReviews.length
            });
        } else {
            await product.update({ rating: 0, ratingCount: 0 });
        }
        
        res.json({ message: "Review deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
