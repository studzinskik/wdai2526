import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Card, Badge, Spinner, Alert } from "react-bootstrap";
import { FaBox, FaChevronRight } from "react-icons/fa";
import api from "../services/api";

function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await api.get("/orders");
            setOrders(response.data);
        } catch (error) {
            console.error(error);
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

    return (
        <Container className="py-4">
            <h1 className="mb-4">Moje zamówienia</h1>

            {orders.length === 0 ? (
                <div className="text-center py-5">
                    <FaBox size={64} className="text-muted mb-4" />
                    <h3>Brak zamówień</h3>
                    <p className="text-muted mb-4">Gdy złożysz zamówienie, pojawi się ono tutaj.</p>
                    <Link to="/" className="btn btn-primary">Rozpocznij zakupy</Link>
                </div>
            ) : (
                orders.map((order) => (
                    <Card key={order.id} className="mb-3">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <h5 className="mb-1">Zamówienie #{order.id}</h5>
                                    <p className="text-muted mb-2">
                                        {new Date(order.createdAt).toLocaleDateString("pl-PL", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit"
                                        })}
                                    </p>
                                    <div className="mb-2">
                                        {getStatusBadge(order.status)}
                                    </div>
                                    <p className="mb-0">
                                        <strong>{order.items.length} elementy</strong> · Razem: <strong>{parseFloat(order.total).toFixed(2).replace(".",",")} zł</strong>
                                    </p>
                                </div>
                                <Link to={`/orders/${order.id}`} className="btn btn-outline-primary">
                                    Szczegóły <FaChevronRight />
                                </Link>
                            </div>
                        </Card.Body>
                    </Card>
                ))
            )}
        </Container>
    );
}

export default OrdersPage;
