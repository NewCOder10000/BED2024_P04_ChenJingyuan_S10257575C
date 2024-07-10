const sql = require("mssql");
const dbConfig = require("../DBConfig");

class Book {
    constructor(book_id, Title, Author, Availability) {
        this.book_id = book_id;
        this.Title = Title;
        this.Author = Author;
        this.Availability = Availability;
    }

    static async getAllBooks() {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Books`;

        const request = connection.request();
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset.map(
            (row) => new Book(row.book_id, row.Title, row.Author, row.Availability)
        );
    }

    static async updateBookAvailability(book_id, Availability) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `UPDATE Books SET Availability = @Availability WHERE book_id = @book_id`

        const request = connection.request();
        request.input("book_id", book_id);
        request.input("Availability", Availability);

        await request.query(sqlQuery);

        connection.close();

        return {book_id, Availability};
    }
}

module.exports = Book;