import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

function ProductCard({ product }) {
    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        for (let i = 0; i < fullStars; i++) {
            stars.push(<FaStar key={i} className="text-warning" />);
        }
        if (hasHalfStar) {
            stars.push(<FaStarHalfAlt key="half" className="text-warning" />);
        }
        const remaining = 5 - stars.length;
        for (let i = 0; i < remaining; i++) {
            stars.push(<FaRegStar key={`empty-${i}`} className="text-warning" />);
        }
        
        return stars;
    };

    return (
        <Card className="product-card h-100">
            <Link to={`/product/${product.id}`}>
                <Card.Img
                    variant="top"
                    src={product.image}
                    alt={product.title}
                    className="product-image"
                />
            </Link>
            <Card.Body className="d-flex flex-column">
                <Card.Title className="fs-6">
                    <Link to={`/product/${product.id}`} className="text-decoration-none text-dark">
                        {product.title.length > 50 
                            ? product.title.substring(0, 50) + "..." 
                            : product.title}
                    </Link>
                </Card.Title>
                <Card.Text className="text-muted small mb-2">
                    {product.category}
                </Card.Text>
                <div className="mt-auto">
                    <div className="d-flex align-items-center mb-2">
                        <span className="rating-stars me-2">
                            {renderStars(parseFloat(product.rating))}
                        </span>
                        <small className="text-muted">({product.ratingCount})</small>
                    </div>
                    <Card.Text className="fw-bold fs-5 text-primary mb-0">
                        {parseFloat(product.price).toFixed(2).replace(".",",")} zł
                    </Card.Text>
                </div>
            </Card.Body>
        </Card>
    );
}

export default ProductCard;
