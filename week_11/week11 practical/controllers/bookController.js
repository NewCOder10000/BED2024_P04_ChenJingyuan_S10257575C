const Book = require("../models/books");
const bcrypt = require("bcryptjs");

const getAllBooks = async (req, res) => {
    try {
        const books = await Book.getAllBooks();
        res.json(books);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving books");
    }
};

const updateBookAvailability = async (req, res) => {
    const book_id = parseInt(req.params.book_id);
    const newBookAvailability = req.body.Availability;

    try {
        const updatedBook = await Book.updateBookAvailability(book_id, newBookAvailability);
        if (!updatedBook) {
            return res.status(404).send("Book not found");
        }
        res.json(updatedBook);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error updating book");
    }
};

module.exports = {
    getAllBooks,
    updateBookAvailability
}