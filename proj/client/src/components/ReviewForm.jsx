import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { FaStar } from "react-icons/fa";
import api from "../services/api";

function ReviewForm({ productId, onReviewAdded }) {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (rating === 0) {
            setError("Proszę wybrać ocenę");
            return;
        }
        if (!message.trim()) {
            setError("Treść opinii jest wymagana");
            return;
        }
        if (message.trim().length < 10) {
            setError("Opinia musi mieć co najmniej 10 znaków");
            return;
        }

        setLoading(true);

        try {
            const response = await api.post(`/products/${productId}/reviews`, {
                rating,
                message: message.trim()
            });

            setSuccess("Opinia wysłana pomyślnie!");
            setRating(0);
            setMessage("");
            
            if (onReviewAdded) {
                onReviewAdded(response.data);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Nie udało się wysłać opinii");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form onSubmit={handleSubmit} className="review-form bg-light p-4 rounded">
            <h5 className="mb-3">Napisz opinię</h5>
            
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Form.Group className="mb-3">
                <Form.Label>Ocena</Form.Label>
                <div>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                            key={star}
                            size={24}
                            className={`star-input ${star <= (hover || rating) ? "filled" : ""}`}
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(0)}
                            style={{ cursor: "pointer", color: star <= (hover || rating) ? "#ffc107" : "#ddd" }}
                        />
                    ))}
                </div>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Twoja opinia</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Wpisz swoją opinię tutaj..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                />
            </Form.Group>

            <Button variant="primary" type="submit" disabled={loading}>
                {loading ? "Wysyłanie..." : "Wyślij opinię"}
            </Button>
        </Form>
    );
}

export default ReviewForm;
