module.exports = {
    user: "PolytechnicLibrary",
    password: "MC4Life",
    server: "ASUSGROUDON//SQLEXPRESS",
    database: "PolytecnicLibrary",
    trustServerCertificate: true,
    options: {
        port: 1433,
        connectionTimeout: 60000,
        requestTimeout: 30000
    },
    pool: {
        max: 9999999,
        min: 0,
        idleTimeoutMillis:30000
    }
};