import { useState, useEffect } from "react";
import { Container, Row, Col, Form, InputGroup, Button, Spinner } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import ProductCard from "../components/ProductCard";
import api from "../services/api";

function HomePage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async (searchQuery = "", category = "") => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchQuery) params.append("search", searchQuery);
            if (category) params.append("category", category);
            
            const response = await api.get(`/products?${params.toString()}`);
            setProducts(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await api.get("/products/categories");
            setCategories(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchProducts(search, selectedCategory);
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        fetchProducts(search, category);
    };

    return (
        <Container className="py-4">
            <h1 className="mb-4">Produkty</h1>
            
            <Row className="mb-4">
                <Col md={6}>
                    <Form onSubmit={handleSearch}>
                        <InputGroup>
                            <Form.Control
                                type="text"
                                placeholder="Szukaj..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Button variant="primary" type="submit">
                                <FaSearch />
                            </Button>
                        </InputGroup>
                    </Form>
                </Col>
            </Row>

            <div className="category-filter mb-4">
                <Button
                    variant={selectedCategory === "" ? "primary" : "outline-primary"}
                    onClick={() => handleCategoryChange("")}
                    className="me-2 mb-2"
                >
                    wszystkie
                </Button>
                {categories.map((category) => (
                    <Button
                        key={category}
                        variant={selectedCategory === category ? "primary" : "outline-primary"}
                        onClick={() => handleCategoryChange(category)}
                        className="me-2 mb-2"
                    >
                        {category}
                    </Button>
                ))}
            </div>

            {loading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Ładowanie...</span>
                    </Spinner>
                </div>
            ) : products.length === 0 ? (
                <div className="text-center py-5">
                    <p className="text-muted">Nie znaleziono produktów</p>
                </div>
            ) : (
                <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                    {products.map((product) => (
                        <Col key={product.id}>
                            <ProductCard product={product} />
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
}

export default HomePage;
