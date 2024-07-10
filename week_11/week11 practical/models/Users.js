const sql = require("mssql");
const dbConfig = require("../DBConfig");

class User {
    constructor(user_id, Username, PasswordHash, Role) {
        this.user_id = user_id;
        this.Username = Username;
        this.PasswordHash = PasswordHash;
        this.Role = Role;
    }

    static async RegisterUser(Username, PasswordHash, Role) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `INSERT into Users (Username, PasswordHash, Role) Values (@Username, @PasswordHash, @Role)`;

        const request = connection.request();
        request.input("Username", Username);
        request.input("PasswordHash", PasswordHash);
        request.input("Role", Role);

        const result = await request.query(sqlQuery);

        connection.close();

        return {Username, PasswordHash, Role};
    }

    static async getUserByUsername(Username) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Users WHERE Username = @Username`;

        const request = connection.request();
        request.input("Username", Username);

        const result = await request.query(sqlQuery);

        connection.close();

        if (result.recordset.length > 0) {
            const User = result.recordset[0];
            return User.Username;
        } else {
            return null;
        }
    }

    static async getDBPassword(Username) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Users WHERE Username = @Username`;

        const request = connection.request();
        request.input("Username", Username);

        const result = await request.query(sqlQuery);

        connection.close();

        if (result.recordset.length > 0) {
            const User = result.recordset[0];
            return User.PasswordHash;
        } else {
            return null;
        }
    }
}


module.exports = User;