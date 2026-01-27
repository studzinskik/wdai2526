import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Image, Button, Form, Alert, Spinner, Card } from "react-bootstrap";
import { FaStar, FaShoppingCart, FaTrash, FaEdit } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import ReviewForm from "../components/ReviewForm";
import api from "../services/api";

function ProductPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, user, isAdmin } = useAuth();
    
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [addingToCart, setAddingToCart] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/products/${id}`);
            setProduct(response.data);
            setReviews(response.data.Reviews || []);
        } catch (error) {
            console.error(error);
            setMessage({ type: "danger", text: "Nie udało się załadować produktu" });
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            navigate("/login", { state: { from: { pathname: `/product/${id}` } } });
            return;
        }

        setAddingToCart(true);
        try {
            await api.post("/cart", { productId: parseInt(id), quantity });
            setMessage({ type: "success", text: "Dodano do koszyka!" });
            setTimeout(() => setMessage({ type: "", text: "" }), 3000);
        } catch (error) {
            setMessage({ type: "danger", text: error.response?.data?.message || "Nie udało się dodać do koszyka" });
        } finally {
            setAddingToCart(false);
        }
    };

    const handleReviewAdded = (newReview) => {
        setReviews([newReview, ...reviews]);
        fetchProduct();
    };

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm("Czy na pewno chcesz usunąć tę opinię?")) return;
        
        try {
            await api.delete(`/reviews/${reviewId}`);
            setReviews(reviews.filter(r => r.id !== reviewId));
            fetchProduct();
        } catch (error) {
            setMessage({ type: "danger", text: "Nie udało się usunąć opinii" });
        }
    };

    const canDeleteReview = (review) => {
        return isAdmin || (user && review.UserId === user.id);
    };

    const hasUserReviewed = reviews.some(r => user && r.UserId === user.id);

    if (loading) {
        return (
            <Container className="py-5 text-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Ładowanie...</span>
                </Spinner>
            </Container>
        );
    }

    if (!product) {
        return (
            <Container className="py-5">
                <Alert variant="danger">Produkt nie istnieje</Alert>
            </Container>
        );
    }

    return (
        <Container className="py-4">
            {message.text && (
                <Alert variant={message.type} dismissible onClose={() => setMessage({ type: "", text: "" })}>
                    {message.text}
                </Alert>
            )}

            <Row className="mb-5">
                <Col md={5}>
                    <Image src={product.image} alt={product.title} fluid className="bg-white p-3 rounded" />
                </Col>
                <Col md={7}>
                    <h1>{product.title}</h1>
                    <p className="text-muted">{product.category}</p>
                    
                    <div className="d-flex align-items-center mb-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                                key={star}
                                className={star <= Math.round(parseFloat(product.rating)) ? "text-warning" : "text-muted"}
                            />
                        ))}
                        <span className="ms-2">
                            ({product.ratingCount} {
                                (product.ratingCount === 1) ? "opinia" :
                                (product.ratingCount % 10 >= 2 && product.ratingCount % 10 <= 4 && (product.ratingCount % 100 < 10 || product.ratingCount % 100 >= 20)) ? "opinie" :
                                "opinii"
                            })
                        </span>
                    </div>

                    <h2 className="text-primary mb-3">{parseFloat(product.price).toFixed(2).replace(".",",")} zł</h2>
                    
                    <p>{product.description}</p>

                    <p className={product.stock > 0 ? "text-success" : "text-danger"}>
                        {product.stock > 0 ? `Dostępne w magazynie: ${product.stock} szt.` : "Produkt wyprzedany"}
                    </p>

                    {product.stock > 0 && (
                        <div className="d-flex align-items-center gap-3">
                            <Form.Group style={{ width: "100px" }}>
                                <Form.Label>Liczba sztuk</Form.Label>
                                <Form.Control
                                    type="number"
                                    min="1"
                                    max={product.stock}
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                                />
                            </Form.Group>
                            <Button
                                variant="primary"
                                size="lg"
                                onClick={handleAddToCart}
                                disabled={addingToCart}
                                className="mt-4"
                            >
                                <FaShoppingCart className="me-2" />
                                {addingToCart ? "Dodaję..." : "Dodaj do koszyka"}
                            </Button>
                        </div>
                    )}
                </Col>
            </Row>

            <Row>
                <Col>
                    <h3 className="mb-4">Opinie klientów</h3>
                    
                    {isAuthenticated && !hasUserReviewed && (
                        <div className="mb-4">
                            <ReviewForm productId={id} onReviewAdded={handleReviewAdded} />
                        </div>
                    )}

                    {!isAuthenticated && (
                        <Alert variant="info" className="mb-4">
                            <a href="/login">Zaloguj się</a> aby napisać opinię
                        </Alert>
                    )}

                    {hasUserReviewed && (
                        <Alert variant="info" className="mb-4">
                            Już oceniłeś ten produkt
                        </Alert>
                    )}

                    {reviews.length === 0 ? (
                        <p className="text-muted">Bądź pierwszym, który oceni ten produkt!</p>
                    ) : (
                        reviews.map((review) => (
                            <Card key={review.id} className="mb-3">
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div>
                                            <div className="mb-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <FaStar
                                                        key={star}
                                                        className={star <= review.rating ? "text-warning" : "text-muted"}
                                                        size={14}
                                                    />
                                                ))}
                                            </div>
                                            <h6>{review.User?.firstName} {review.User?.lastName}</h6>
                                            <p className="mb-1">{review.message}</p>
                                            <small className="text-muted">
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </small>
                                        </div>
                                        {canDeleteReview(review) && (
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => handleDeleteReview(review.id)}
                                            >
                                                <FaTrash />
                                            </Button>
                                        )}
                                    </div>
                                </Card.Body>
                            </Card>
                        ))
                    )}
                </Col>
            </Row>
        </Container>
    );
}

export default ProductPage;
