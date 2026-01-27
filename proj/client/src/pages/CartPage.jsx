import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Card, Button, Form, Image, Alert, Spinner } from "react-bootstrap";
import { FaTrash, FaPlus, FaMinus, FaShoppingCart } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function CartPage() {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    
    const [cart, setCart] = useState({ items: [], total: "0,00", itemCount: 0 });
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    useEffect(() => {
        if (isAuthenticated) {
            fetchCart();
        } else {
            setLoading(false);
        }
    }, [isAuthenticated]);

    const fetchCart = async () => {
        try {
            const response = await api.get("/cart");
            setCart(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;
        
        setUpdating(true);
        try {
            const response = await api.put(`/cart/${itemId}`, { quantity: newQuantity });
            setCart(response.data);
        } catch (error) {
            setMessage({ type: "danger", text: error.response?.data?.message || "Failed to update cart" });
        } finally {
            setUpdating(false);
        }
    };

    const removeItem = async (itemId) => {
        setUpdating(true);
        try {
            const response = await api.delete(`/cart/${itemId}`);
            setCart(response.data);
        } catch (error) {
            setMessage({ type: "danger", text: "Nie udało się usunąć produktu" });
        } finally {
            setUpdating(false);
        }
    };

    const handleCheckout = async () => {
        setUpdating(true);
        try {
            const response = await api.post("/orders");
            setMessage({ 
                type: "success", 
                text: (
                    <span>
                        Zamówienie zostało złożone!
                        <Link to={`/orders/${response.data.id}`} className="alert-link">
                            Zobacz zamówienie
                        </Link>
                    </span>
                )
            });
            setCart({ items: [], total: "0,00", itemCount: 0 });
        } catch (error) {
            setMessage({ type: "danger", text: error.response?.data?.message || "Nie udało się złożyć zamówienia" });
        } finally {
            setUpdating(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <Container className="py-5 text-center">
                <FaShoppingCart size={64} className="text-muted mb-4" />
                <h2>Twój koszyk już na ciebie czeka!</h2>
                <p className="text-muted mb-4">Zaloguj się, aby zobaczyć swój koszyk i złożyć zamówienie.</p>
                <Button as={Link} to="/login" variant="primary" size="lg">
                    Zaloguj się
                </Button>
            </Container>
        );
    }

    if (loading) {
        return (
            <Container className="py-5 text-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Ładowanie...</span>
                </Spinner>
            </Container>
        );
    }

    return (
        <Container className="py-4">
            <h1 className="mb-4">Koszyk</h1>

            {message.text && (
                <Alert variant={message.type} dismissible onClose={() => setMessage({ type: "", text: "" })}>
                    {message.text}
                </Alert>
            )}

            {cart.items.length === 0 ? (
                <div className="text-center py-5">
                    <FaShoppingCart size={64} className="text-muted mb-4" />
                    <h3>Twój koszyk jest pusty</h3>
                    <p className="text-muted mb-4">Wygląda na to, że nie dodałeś jeszcze żadnych produktów.</p>
                    <Button as={Link} to="/" variant="primary">
                        Rozpocznij zakupy
                    </Button>
                </div>
            ) : (
                <Row>
                    <Col lg={8}>
                        {cart.items.map((item) => (
                            <Card key={item.id} className="mb-3">
                                <Card.Body>
                                    <Row className="align-items-center">
                                        <Col xs={3} md={2}>
                                            <Image
                                                src={item.Product.image}
                                                alt={item.Product.title}
                                                fluid
                                                style={{ maxHeight: "80px", objectFit: "contain" }}
                                            />
                                        </Col>
                                        <Col xs={9} md={4}>
                                            <Link to={`/product/${item.Product.id}`} className="text-decoration-none">
                                                <h6 className="mb-1">{item.Product.title}</h6>
                                            </Link>
                                            <p className="text-muted mb-0 small">
                                                {parseFloat(item.Product.price).toFixed(2).replace(".", ",")} zł / szt.
                                            </p>
                                        </Col>
                                        <Col xs={6} md={3} className="mt-2 mt-md-0">
                                            <div className="d-flex align-items-center">
                                                <Button
                                                    variant="outline-secondary"
                                                    size="sm"
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    disabled={updating || item.quantity <= 1}
                                                >
                                                    <FaMinus />
                                                </Button>
                                                <Form.Control
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                                                    className="mx-2 text-center"
                                                    style={{ width: "60px" }}
                                                    min="1"
                                                    max={item.Product.stock}
                                                />
                                                <Button
                                                    variant="outline-secondary"
                                                    size="sm"
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    disabled={updating || item.quantity >= item.Product.stock}
                                                >
                                                    <FaPlus />
                                                </Button>
                                            </div>
                                        </Col>
                                        <Col xs={4} md={2} className="mt-2 mt-md-0 text-end">
                                            <strong>{(parseFloat(item.Product.price) * item.quantity).toFixed(2).replace(".", ",")} zł</strong>
                                        </Col>
                                        <Col xs={2} md={1} className="mt-2 mt-md-0 text-end">
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => removeItem(item.id)}
                                                disabled={updating}
                                            >
                                                <FaTrash />
                                            </Button>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        ))}
                    </Col>
                    
                    <Col lg={4}>
                        <Card className="sticky-top" style={{ top: "80px" }}>
                            <Card.Body>
                                <h4 className="mb-4">Podsumowanie</h4>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Produkty ({cart.itemCount}):</span>
                                    <span>{cart.total} zł</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Dostawa:</span>
                                    <span className="text-success">Darmowa</span>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between mb-4">
                                    <strong>Razem:</strong>
                                    <strong className="text-primary">{cart.total} zł</strong>
                                </div>
                                <Button
                                    variant="primary"
                                    size="lg"
                                    className="w-100"
                                    onClick={handleCheckout}
                                    disabled={updating}
                                >
                                    {updating ? "Przetwarzanie..." : "Dalej"}
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}
        </Container>
    );
}

export default CartPage;
