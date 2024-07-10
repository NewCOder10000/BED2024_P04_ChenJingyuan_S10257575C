const User = require("../models/Users.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function RegisterUser(req, res) {
    const { Username, Password, Role } = req.body;

    try {
        // Validate user data
        // ... your validation logic here ...
        const Username = req.body.Username;
        const Password = req.body.Password;
        const Role = req.body.Role;

        const onlyLetters = /^[A-Za-z]+$/.test(Password);
        const onlyNumbers = /^[0-9]+$/.test(Password);

        if (typeof Username !== "string" || Username.trim() === "") {
            return res.status(400).json({ message: "Username cannot be a empty string." })
        }

        if (Password.length < 6 || onlyLetters || onlyNumbers) {
            return res.status(400).json({ message: "Password must be at least 6 characters long, and must contain a mixture of numbers and letters." })
        }

        if (typeof Role !== "string" || Role.trim() === "") {
            return res.status(400).json({ message: "Username cannot be a empty string." })
        }

        const existingUser = await User.getUserByUsername(Username);
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const PasswordHash = await bcrypt.hash(Password, salt);

        const NewUser = await User.RegisterUser(Username, PasswordHash, Role);

        res.json(NewUser);
        return res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function login(req, res) {
    const { Username, Password } = req.body;

    try {
        // Validate user credentials
        const user = await User.getUserByUsername(Username);
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Compare password with hash
        const DBPassword = await User.getDBPassword(Username)
        const isMatch = await bcrypt.compare(Password, DBPassword);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const payload = {
            id: user.id,
            role: user.role,
        };
        const token = jwt.sign(payload, "your_secret_key", { expiresIn: "3600s" }); // Expires in 1 hour

        return res.status(200).json({ token });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    RegisterUser,
    login
}