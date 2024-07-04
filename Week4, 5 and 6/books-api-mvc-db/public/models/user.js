const mssql = require('mssql');

// Database configuration
const dbConfig = {
    user: 'ASUSGROUDONTHE3RD',
    password: 'OMG4life',
    server: 'ASUSGROUDON\SQLEXPRESS',
    database: 'bed_db',
    options: {
        encrypt: true, // for Azure
        trustServerCertificate: true // change to true for local dev / self-signed certs
    }
};

class User {
    constructor(id, username, email) {
        this.id = id;
        this.username = username;
        this.email = email;
    }

    static async createUser(user) {
        let pool;
        try {
            pool = await mssql.connect(dbConfig);
            const insertQuery = `INSERT INTO Users (username, email) OUTPUT INSERTED.* VALUES (@username, @email)`;
            const result = await pool.request()
                .input('username', mssql.VarChar, user.username)
                .input('email', mssql.VarChar, user.email)
                .query(insertQuery);

            return result.recordset[0]; // return the newly created user
        } catch (err) {
            console.error('SQL error', err);
            throw err;
        } finally {
            pool.close();
        }
    }

    static async getAllUsers() {
        let pool;
        try {
            pool = await mssql.connect(dbConfig);
            const selectQuery = 'SELECT * FROM Users';
            const result = await pool.request().query(selectQuery);

            return result.recordset; // return array of users
        } catch (err) {
            console.error('SQL error', err);
            throw err;
        } finally {
            pool.close();
        }
    }

    static async getUserById(id) {
        let pool;
        try {
            pool = await mssql.connect(dbConfig);
            const selectQuery = 'SELECT * FROM Users WHERE id = @id';
            const result = await pool.request()
                .input('id', mssql.Int, id)
                .query(selectQuery);

            return result.recordset[0] || null; // return user or null if not found
        } catch (err) {
            console.error('SQL error', err);
            throw err;
        } finally {
            pool.close();
        }
    }

    static async updateUser(id, updatedUser) {
        let pool;
        try {
            pool = await mssql.connect(dbConfig);
            const updateQuery = `UPDATE Users SET username = @username, email = @email WHERE id = @id`;
            await pool.request()
                .input('id', mssql.Int, id)
                .input('username', mssql.VarChar, updatedUser.username)
                .input('email', mssql.VarChar, updatedUser.email)
                .query(updateQuery);

            return { message: 'User updated successfully' };
        } catch (err) {
            console.error('SQL error', err);
            throw err;
        } finally {
            pool.close();
        }
    }

    static async deleteUser(id) {
        let pool;
        try {
            pool = await mssql.connect(dbConfig);
            const deleteQuery = 'DELETE FROM Users WHERE id = @id';
            await pool.request()
                .input('id', mssql.Int, id)
                .query(deleteQuery);

            return { message: 'User deleted successfully' };
        } catch (err) {
            console.error('SQL error', err);
            throw err;
        } finally {
            pool.close();
        }
    }

    static async searchUsers(searchTerm) {
        const connection = await sql.connect(dbConfig);

        try {
            const query = `
            SELECT *
            FROM Users
            WHERE username LIKE '%${searchTerm}%'
                OR email LIKE '%${searchTerm}%'
            `;

            const result = await connection.request().query(query);
            return result.recordset;
        } catch (error) {
            throw new Error("Error searching users"); // Or handle error differently
        } finally {
            await connection.close(); // Close connection even on errors
        }
    }

    static async getUsersWithBooks() {
        const connection = await sql.connect(dbConfig);

        try {
            const query = `
            SELECT u.id AS user_id, u.username, u.email, b.id AS book_id, b.title, b.author
            FROM Users u
            LEFT JOIN UserBooks ub ON ub.user_id = u.id
            LEFT JOIN Books b ON ub.book_id = b.id
            ORDER BY u.username;
            `;

            const result = await connection.request().query(query);

            // Group users and their books
            const usersWithBooks = {};
            for (const row of result.recordset) {
                const userId = row.user_id;
                if (!usersWithBooks[userId]) {
                    usersWithBooks[userId] = {
                        id: userId,
                        username: row.username,
                        email: row.email,
                        books: [],
                    };
                }
                usersWithBooks[userId].books.push({
                    id: row.book_id,
                    title: row.title,
                    author: row.author,
                });
            }

            return Object.values(usersWithBooks);
        } catch (error) {
            throw new Error("Error fetching users with books");
        } finally {
            await connection.close();
        }
    }
}

module.exports = User;
