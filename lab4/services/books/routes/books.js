const express = require("express");
const Book = require("../models/Book");
const { requireAuth } = require("../middleware/auth");
const router = express.Router();

// GET /api/books
router.get("/", async (req, res) => {
    const books = await Book.findAll();
    res.json(books);
});

// GET /api/books/:bookId
router.get("/:bookId", async (req, res) => {
    const b = await Book.findByPk(req.params.bookId);

    if (!b) {
        return res.status(404).json({error: "Not found"});
    };

    res.json(b);
});

// POST /api/books (protected)
router.post("/", requireAuth, async (req, res) => {
    const { title, author, year } = req.body;

    if(!title || !author) {
        return res.status(400).json({error: "Missing fields"});
    }

    const book = await Book.create({ title, author, year });
    res.json({ id: book.id });
});

// DELETE /api/books/:bookId (protected)
router.delete("/:bookId", requireAuth, async (req, res) => {
    const b = await Book.findByPk(req.params.bookId);
    
    if(!b) {
        return res.status(404).json({error: "Not found"});
    }

    await b.destroy();
    res.json({ ok: true });
});

module.exports = router;