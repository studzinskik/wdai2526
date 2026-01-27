import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { FaShoppingCart, FaUser, FaSignOutAlt, FaSignInAlt, FaCog, FaBoxOpen} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import api from "../services/api";

function Navigation() {
    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const navigate = useNavigate();
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        if (isAuthenticated) {
            fetchCartCount();
        } else {
            setCartCount(0);
        }
    }, [isAuthenticated]);

    const fetchCartCount = async () => {
        try {
            const response = await api.get("/cart");
            setCartCount(response.data.itemCount || 0);
        } catch (error) {
            console.error(error);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
            <Container>
                <Navbar.Brand as={Link} to="/">
                    Sklep
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Produkty</Nav.Link>
                    </Nav>
                    <Nav>
                        <Nav.Link as={Link} to="/cart" className="position-relative">
                            <FaShoppingCart size={20} className="me-2" />
                            Koszyk
                        </Nav.Link>
                        {isAuthenticated && (
                            <Nav.Link as={Link} to="/orders" title="Moje zamówienia">
                                <FaBoxOpen size={20} className="me-2" />
                                Moje zamówienia
                            </Nav.Link>
                        )}
                        {isAdmin && (
                            <Nav.Link as={Link} to="/admin" title="Panel administracyjny">
                                <FaCog size={20} className="me-2" />
                                Panel administracyjny
                            </Nav.Link>
                        )}
                        {isAuthenticated ? (
                            <NavDropdown 
                                title={
                                    <span>
                                        <FaUser className="me-2" />
                                        {user.firstName}
                                    </span>
                                } 
                                id="user-dropdown"
                                align="end"
                            >
                                <NavDropdown.Item onClick={handleLogout}>
                                    <FaSignOutAlt className="me-2" />
                                    Wyloguj się
                                </NavDropdown.Item>
                            </NavDropdown>
                        ) : (
                            <Nav.Link as={Link} to="/login">
                                <FaSignInAlt className="me-2" />
                                Zaloguj się
                            </Nav.Link>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Navigation;
