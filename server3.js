const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Middleware for parsing form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Session management
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Make sure to use 'secure: true' in production with HTTPS
}));

// MongoDB Atlas Connection
const uri = 'mongodb+srv://lovelyvibe14:1422@vignesh1422.cytlt.mongodb.net/?retryWrites=true&w=majority&appName=vignesh1422';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Atlas connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Mongoose schemas
const loginSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const Login = mongoose.model('Login', loginSchema, 'login');

const formSchema = new mongoose.Schema({
    fullName: String,
    dob: Date,
    gender: String,
    contactNumber: String,
    email: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
    ugCollege: String,
    ugDegree: String,
    ugYear: String,
    ugGrade: String,
    pgCollege: String,
    pgDegree: String,
    pgYear: String,
    pgGrade: String,
    hostelRequired: String,
    roomType: String
});
const Form = mongoose.model('Form', formSchema, 'applications');

// Serve the login page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Codes', 'login.html'));
});

// Handle registration (Sign-up) from login.html
app.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user already exists
        const existingUser = await Login.findOne({ email });
        if (existingUser) {
            return res.status(400).send('User already exists. Please login.');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save the new user
        const newUser = new Login({ email, password: hashedPassword });
        await newUser.save();

        res.status(201).send('User registered successfully!');
    } catch (err) {
        console.error('Error during registration:', err.message);
        res.status(500).send('Error during registration.');
    }
});

// Handle login from login.html
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await Login.findOne({ email });
        if (!user) {
            return res.status(401).send('User not found. Please register.');
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send('Invalid email or password.');
        }

        // Set session for the user
        req.session.user = user;
        res.status(200).send('Login successful!');
    } catch (err) {
        console.error('Error during login:', err.message);
        res.status(500).send('Error during login.');
    }
});

// Handle form submission from form.html
app.post('/submit-form', async (req, res) => {
    try {
        const formData = new Form(req.body);
        await formData.save();
        res.status(200).send('Application submitted successfully!');
    } catch (err) {
        console.error('Error saving form data:', err.message);
        res.status(500).send('Error submitting application.');
    }
});

// Start the server
const port = 5500;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

