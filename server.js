const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();

// Serve static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));

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
    email: { type: String, required: true },
    password: { type: String, required: true } // Store hashed passwords
});
const Login = mongoose.model('Login', loginSchema, 'login');

// Mongoose schema for form submissions
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
        // Check if the user already exists
        const existingUser = await Login.findOne({ email: email });
        if (existingUser) {
            return res.status(400).send('User already exists. Please login.');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new Login({
            email: email,
            password: hashedPassword
        });

        // Save the user to the database
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
        
        // Find the user in the database
        const user = await Login.findOne({ email: email });
        if (!user) {
            return res.status(401).send('User not found. Please register.');
        }

        // Compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send('Invalid email or password.');
        }

        // Successful login - set user in session
        req.session.user = user;
        res.send('Login successful!');
    } catch (err) {
        console.error('Error during login:', err.message);
        res.status(500).send('Error during login.');
    }
});

// Handle form submission from form.html
app.post('/submit-form', async (req, res) => {
    try {
        const formData = new Form({
            fullName: req.body['full-name'],
            dob: req.body.dob,
            gender: req.body.gender,
            contactNumber: req.body['contact-number'],
            email: req.body.email,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            pincode: req.body.pincode,
            ugCollege: req.body['ug-college'],
            ugDegree: req.body['ug-degree'],
            ugYear: req.body['ug-year'],
            ugGrade: req.body['ug-grade'],
            pgCollege: req.body['pg-college'],
            pgDegree: req.body['pg-degree'],
            pgYear: req.body['pg-year'],
            pgGrade: req.body['pg-grade'],
            hostelRequired: req.body['hostel-required'],
            roomType: req.body['room-type']
        });
        await formData.save();
        res.send('Application submitted successfully!');
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



// // const express = require('express');
// // const mongoose = require('mongoose');
// // const bodyParser = require('body-parser');
// // const session = require('express-session');
// // const bcrypt = require('bcrypt');
// // const path = require('path');

// // const app = express();

// // // Serve static files from the 'public' directory
// // app.use(express.static(path.join(__dirname, 'public')));

// // // Middleware for parsing form data
// // app.use(bodyParser.urlencoded({ extended: true }));
// // app.use(bodyParser.json());

// // // Session management
// // app.use(session({
// //     secret: 'your-secret-key',  // Change this to a strong secret key
// //     resave: false,
// //     saveUninitialized: true
// // }));

// // // MongoDB Atlas Connection
// // const uri = 'mongodb+srv://lovelyvibe14:1422@vignesh1422.cytlt.mongodb.net/?retryWrites=true&w=majority&appName=vignesh1422';
// // mongoose.connect(uri)
// //     .then(() => console.log('MongoDB Atlas connected'))
// //     .catch(err => {
// //         console.error('MongoDB connection error:', err.message);
// //         process.exit(1);  // Exit the process if there's a connection error
// //     });

// // // Mongoose schema for login
// // const loginSchema = new mongoose.Schema({
// //     email: { type: String, required: true, unique: true },
// //     password: { type: String, required: true }
// // });
// // const Login = mongoose.model('Login', loginSchema, 'login');

// // // Mongoose schema for form submissions
// // const formSchema = new mongoose.Schema({
// //     fullName: String,
// //     dob: Date,
// //     gender: String,
// //     contactNumber: String,
// //     email: String,
// //     address: String,
// //     city: String,
// //     state: String,
// //     pincode: String,
// //     ugCollege: String,
// //     ugDegree: String,
// //     ugYear: String,
// //     ugGrade: String,
// //     pgCollege: String,
// //     pgDegree: String,
// //     pgYear: String,
// //     pgGrade: String,
// //     hostelRequired: String,
// //     roomType: String
// // });
// // const Form = mongoose.model('Form', formSchema, 'applications');

// // // Serve the home page (index.html)
// // app.get('/', (req, res) => {
// //     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// // });

// // // Handle form submission from form.html
// // app.post('/submit-form', async (req, res) => {
// //     try {
// //         const formData = new Form(req.body);
// //         await formData.save();
// //         res.send('Form submitted successfully!');
// //     } catch (err) {
// //         console.error('Error saving form data:', err.message);
// //         res.status(500).send('Error submitting form.');
// //     }
// // });

// // // Handle registration from login.html
// // app.post('/register', async (req, res) => {
// //     try {
// //         const existingUser = await Login.findOne({ email: req.body.email });
// //         if (existingUser) {
// //             return res.status(400).send('Email already exists.');
// //         }
// //         const hashedPassword = await bcrypt.hash(req.body.password, 10);
// //         const newUser = new Login({ email: req.body.email, password: hashedPassword });
// //         await newUser.save();
// //         res.send('User registered successfully!');
// //     } catch (err) {
// //         console.error('Error registering user:', err.message);
// //         res.status(500).send('Error during registration.');
// //     }
// // });

// // // Handle login from login.html
// // app.post('/login', async (req, res) => {
// //     try {
// //         const user = await Login.findOne({ email: req.body.email });
// //         if (user && await bcrypt.compare(req.body.password, user.password)) {
// //             req.session.user = user;  // Store user in session on successful login
// //             res.send('Login successful!');
// //         } else {
// //             res.status(401).send('Invalid email or password.');
// //         }
// //     } catch (err) {
// //         console.error('Login error:', err.message);
// //         res.status(500).send('Error during login.');
// //     }
// // });

// // // Start the server
// // const port = 5500;  // Use the same port
// // app.listen(port, () => {
// //     console.log(`Server is running on http://localhost:${port}`);
// // });


