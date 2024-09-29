const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();

// Middleware for parsing form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Session management
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

// MongoDB Atlas Connection
const uri = 'mongodb+srv://lovelyvibe14:1422@vignesh1422.cytlt.mongodb.net/?retryWrites=true&w=majority&appName=vignesh1422';
mongoose.connect(uri)
    .then(() => console.log('MongoDB Atlas connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Mongoose schema for login
const loginSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const Login = mongoose.model('Login', loginSchema, 'login');

// Serve the login page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Codes', 'login.html'));
});

// Handle registration from login.html
app.post('/register', async (req, res) => {
    try {
        const existingUser = await Login.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).send('Email already exists.');
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const loginData = new Login({
            email: req.body.email,
            password: hashedPassword
        });
        await loginData.save();
        res.send('User registered successfully!');
    } catch (err) {
        console.error('Error saving data:', err.message);
        res.status(500).send('Error saving data.');
    }
});

// Handle login from login.html
app.post('/login', async (req, res) => {
    try {
        const user = await Login.findOne({ email: req.body.email });
        if (user && await bcrypt.compare(req.body.password, user.password)) {
            req.session.user = user;
            res.send('Login successful!');
        } else {
            res.status(401).send('Invalid email or password.');
        }
    } catch (err) {
        console.error('Login error:', err.message);
        res.status(500).send('Error during login.');
    }
});

// Start the server
const port = 5501; // Different port from server.js
app.listen(port, () => {
    console.log(`Login server is running on http://localhost:${port}`);
});
