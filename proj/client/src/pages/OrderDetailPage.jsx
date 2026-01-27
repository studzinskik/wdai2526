import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Card, Row, Col, Badge, Image, Spinner, Alert } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa";
import api from "../services/api";

function OrderDetailPage() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            const response = await api.get(`/orders/${id}`);
            setOrder(response.data);
        } catch (err) {
            setError("Nie udało się pobrać szczegółów zamówienia");
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const variants = {
            pending: "warning",
            processing: "info",
            shipped: "primary",
            delivered: "success",
            cancelled: "danger"
        };
        const labels = {
            pending: "Oczekujące",
            processing: "W trakcie",
            shipped: "Wysłane",
            delivered: "Dostarczone",
            cancelled: "Anulowane"
        };
        return <Badge bg={variants[status] || "secondary"}>{labels[status] || status}</Badge>;
    };

    if (loading) {
        return (
            <Container className="py-5 text-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Ładowanie...</span>
                </Spinner>
            </Container>
        );
    }

    if (error || !order) {
        return (
            <Container className="py-5">
                <Alert variant="danger">{error || "Zamówienie nie znalezione"}</Alert>
                <Link to="/orders" className="btn btn-primary">
                    <FaArrowLeft className="me-2" /> Powrót do zamówień
                </Link>
            </Container>
        );
    }

    return (
        <Container className="py-4">
            <Link to="/orders" className="btn btn-outline-secondary mb-4">
                <FaArrowLeft className="me-2" /> Powrót do zamówień
            </Link>

            <Card className="mb-4">
                <Card.Header>
                    <div className="d-flex justify-content-between align-items-center">
                        <h4 className="mb-0">Zamówienie #{order.id}</h4>
                        {getStatusBadge(order.status)}
                    </div>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={6}>
                            <p className="mb-1"><strong>Data zamówienia:</strong></p>
                            <p className="text-muted">
                                {new Date(order.createdAt).toLocaleDateString("pl-PL", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit"
                                })}
                            </p>
                        </Col>
                        <Col md={6}>
                            <p className="mb-1"><strong>Razem:</strong></p>
                            <p className="text-primary fs-4">{parseFloat(order.total).toFixed(2).replace(".",",")} zł</p>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <h5 className="mb-3">Pozycje zamówienia</h5>
            {order.items.map((item, index) => (
                <Card key={index} className="mb-3 order-item">
                    <Card.Body>
                        <Row className="align-items-center">
                            <Col xs={3} md={2}>
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fluid
                                    style={{ maxHeight: "80px", objectFit: "contain" }}
                                />
                            </Col>
                            <Col xs={9} md={6}>
                                <Link to={`/product/${item.productId}`} className="text-decoration-none">
                                    <h6 className="mb-1">{item.title}</h6>
                                </Link>
                                <p className="text-muted mb-0 small">
                                    {parseFloat(item.price).toFixed(2).replace(".",",")} zł × {item.quantity}
                                </p>
                            </Col>
                            <Col xs={12} md={4} className="text-md-end mt-2 mt-md-0">
                                <strong>{(parseFloat(item.price) * item.quantity).toFixed(2).replace(".",",")} zł</strong>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            ))}

            <Card className="mt-4">
                <Card.Body>
                    <Row>
                        <Col md={6}></Col>
                        <Col md={6}>
                            <div className="d-flex justify-content-between mb-2">
                                <span>Podsuma:</span>
                                <span>{parseFloat(order.total).toFixed(2).replace(".",",")} zł</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span>Dostawa:</span>
                                <span className="text-success">Darmowa</span>
                            </div>
                            <hr />
                            <div className="d-flex justify-content-between">
                                <strong>Razem:</strong>
                                <strong className="text-primary">{parseFloat(order.total).toFixed(2).replace(".",",")} zł</strong>
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default OrderDetailPage;
