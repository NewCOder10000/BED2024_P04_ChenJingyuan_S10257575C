const express = require("express");
const booksController = require("./controllers/bookController");
const mssql = require("mssql");
const DBConfig = require("./DBConfig");
const bodyParser = require("body-parser");
const userController = require("./controllers/userController");
const jwt = require('jsonwebtoken')
const middleware = require("./middleware/authorize")

const app = express();
const port = 3000;

mssql.on('error', err => {
    console.log('SQL Global Error:', err);
});

(async () => {
    try {
        const pool = await mssql.connect(DBConfig);
        console.log('Connected to MSSQL database');
    } catch (err) {
        console.error('Error connecting to the database:', err);
    }
})();

app.use(bodyParser.json());

mssql.connect(DBConfig, (err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        throw err;
    }
    console.log('Connected to MSSQL database');
});

app.get("/books", verifyJWT, booksController.getAllBooks);
app.put("/books/:book_id/Availability", verifyJWT, booksController.updateBookAvailability);
app.post("/User/Register", userController.RegisterUser);

app.listen(port, () => {
    console.log(`Server running on port ${port}.`);
});