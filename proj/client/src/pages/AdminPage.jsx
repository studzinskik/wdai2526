import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table, Button, Form, Modal, Alert, Spinner } from "react-bootstrap";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import api from "../services/api";

function AdminPage() {
    const [products, setProducts] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: "", text: "" });
    
    const [showProductModal, setShowProductModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [productForm, setProductForm] = useState({
        title: "",
        price: "",
        description: "",
        category: "",
        image: "",
        stock: 100
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [productsRes, reviewsRes] = await Promise.all([
                api.get("/products"),
                fetchAllReviews()
            ]);
            setProducts(productsRes.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllReviews = async () => {
        const productsRes = await api.get("/products");
        const allReviews = [];
        
        for (const product of productsRes.data.slice(0, 10)) {
            try {
                const reviewsRes = await api.get(`/products/${product.id}/reviews`);
                reviewsRes.data.forEach(r => {
                    allReviews.push({ ...r, productTitle: product.title });
                });
            } catch (e) {}
        }
        
        setReviews(allReviews);
    };

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        
        try {
            if (editingProduct) {
                await api.put(`/products/${editingProduct.id}`, productForm);
                setMessage({ type: "success", text: "Produkt zaktualizowany pomyślnie" });
            } else {
                await api.post("/products", productForm);
                setMessage({ type: "success", text: "Produkt utworzony pomyślnie" });
            }
            
            setShowProductModal(false);
            setEditingProduct(null);
            setProductForm({ title: "", price: "", description: "", category: "", image: "", stock: 100 });
            fetchData();
        } catch (error) {
            setMessage({ type: "danger", text: error.response?.data?.message || "Nie udało się zapisać produktu" });
        }
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setProductForm({
            title: product.title,
            price: product.price,
            description: product.description || "",
            category: product.category,
            image: product.image || "",
            stock: product.stock
        });
        setShowProductModal(true);
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm("Czy na pewno chcesz usunąć ten produkt?")) return;
        
        try {
            await api.delete(`/products/${id}`);
            setMessage({ type: "success", text: "Produkt usunięty pomyślnie" });
            fetchData();
        } catch (error) {
            setMessage({ type: "danger", text: "Nie udało się usunąć produktu" });
        }
    };

    const handleDeleteReview = async (id) => {
        if (!window.confirm("Czy na pewno chcesz usunąć tę opinię?")) return;
        
        try {
            await api.delete(`/reviews/${id}`);
            setMessage({ type: "success", text: "Opinia usunięta pomyślnie" });
            setReviews(reviews.filter(r => r.id !== id));
        } catch (error) {
            setMessage({ type: "danger", text: "Nie udało się usunąć opinii" });
        }
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
            <h1 className="mb-4">Panel administracyjny</h1>

            {message.text && (
                <Alert variant={message.type} dismissible onClose={() => setMessage({ type: "", text: "" })}>
                    {message.text}
                </Alert>
            )}

            <Row>
                <Col lg={12}>
                    <div className="admin-section">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h4>Produkty</h4>
                            <Button variant="primary" onClick={() => {
                                setEditingProduct(null);
                                setProductForm({ title: "", price: "", description: "", category: "", image: "", stock: 100 });
                                setShowProductModal(true);
                            }}>
                                <FaPlus className="me-2" /> Dodaj
                            </Button>
                        </div>
                        
                        <Table responsive striped bordered hover>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nazwa</th>
                                    <th>Kategoria</th>
                                    <th>Cena</th>
                                    <th>Stan</th>
                                    <th>Akcje</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id}>
                                        <td>{product.id}</td>
                                        <td>{product.title.substring(0, 40)}...</td>
                                        <td>{product.category}</td>
                                        <td>{parseFloat(product.price).toFixed(2).replace(".",",")} zł</td>
                                        <td>{product.stock}</td>
                                        <td>
                                            <Button 
                                                variant="outline-primary" 
                                                size="sm" 
                                                className="me-2"
                                                onClick={() => handleEditProduct(product)}
                                            >
                                                <FaEdit />
                                            </Button>
                                            <Button 
                                                variant="outline-danger" 
                                                size="sm" 
                                                onClick={() => handleDeleteProduct(product.id)}
                                            >
                                                <FaTrash />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>

                    <div className="admin-section mt-4">
                        <h4 className="mb-3">Opinie</h4>
                        
                        {reviews.length === 0 ? (
                            <p className="text-muted">Brak opinii</p>
                        ) : (
                            <Table responsive striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Produkt</th>
                                        <th>Ocena</th>
                                        <th>Treść</th>
                                        <th>Użytkownik</th>
                                        <th>Akcje</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reviews.map((review) => (
                                        <tr key={review.id}>
                                            <td>{review.id}</td>
                                            <td>{review.productTitle?.substring(0, 30)}...</td>
                                            <td>{"⭐".repeat(review.rating)}</td>
                                            <td>{review.message.substring(0, 50)}...</td>
                                            <td>{review.User?.firstName} {review.User?.lastName}</td>
                                            <td>
                                                <Button 
                                                    variant="outline-danger" 
                                                    size="sm"
                                                    onClick={() => handleDeleteReview(review.id)}
                                                >
                                                    <FaTrash />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )}
                    </div>
                </Col>
            </Row>

            <Modal show={showProductModal} onHide={() => setShowProductModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{editingProduct ? "Edytuj" : "Dodaj"}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleProductSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Nazwa</Form.Label>
                            <Form.Control
                                type="text"
                                value={productForm.title}
                                onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                                required
                            />
                        </Form.Group>
                        
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Cena</Form.Label>
                                    <Form.Control
                                        type="number"
                                        step="0.01"
                                        value={productForm.price}
                                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Stan magazynowy</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={productForm.stock}
                                        onChange={(e) => setProductForm({ ...productForm, stock: parseInt(e.target.value) })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        
                        <Form.Group className="mb-3">
                            <Form.Label>Kategoria</Form.Label>
                            <Form.Control
                                type="text"
                                value={productForm.category}
                                onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>URL Obrazka</Form.Label>
                            <Form.Control
                                type="url"
                                value={productForm.image}
                                onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                            />
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                            <Form.Label>Opis</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={productForm.description}
                                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowProductModal(false)}>
                            Anuluj
                        </Button>
                        <Button variant="primary" type="submit">
                            {editingProduct ? "Zaktualizuj" : "Utwórz"}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
}

export default AdminPage;
