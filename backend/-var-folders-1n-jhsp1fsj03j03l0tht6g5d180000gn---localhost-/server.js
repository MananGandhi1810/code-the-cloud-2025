import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { apiEndpoints } from './api.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

const OTP = '123456';
const USERS = {};
let userCounter = 0;

// Function to simulate delay
const delay = () => new Promise(res => setTimeout(res, Math.random() * 200));

// Function to simulate errors
const shouldError = () => Math.random() < 0.02;

// Details endpoint
app.get('/details', (req, res) => {
  res.json({
    endpoints: apiEndpoints.map(endpoint => ({
      name: endpoint.name,
      method: endpoint.method,
      description: `Mock endpoint for ${endpoint.name}`
    })),
    message: 'Mock API server details'
  });
});

app.post('/auth/login', async (req, res) => {
    await delay();
    if (shouldError()) return res.status(500).json({ message: 'Simulated server error' });

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required', success: false });
    }

    //Basic email and password check.
    if(email !== 'test@example.com' || password !== 'password'){
        return res.status(401).json({ message: 'Invalid credentials', success: false });
    }

    const userId = Object.keys(USERS).find(key => USERS[key].email === email);
    const user = USERS[userId];

    const token = '1a2b3c4d5e6f7g8h9i0j';

    res.json({
        data: {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                points: 100
            },
            token: token
        },
        message: 'Login successful',
        success: true
    });
});

app.post('/auth/register', async (req, res) => {
    await delay();
    if (shouldError()) return res.status(500).json({ message: 'Simulated server error' });

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required', success: false });
    }

    userCounter++;
    const userId = `user${userCounter}`;
    USERS[userId] = {
        id: userId,
        name: name,
        email: email
    }

    res.json({
        message: 'Registration successful',
        success: true
    });
});

app.post('/auth/forgot-password', async (req, res) => {
    await delay();
    if (shouldError()) return res.status(500).json({ message: 'Simulated server error' });

    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required', success: false });
    }

    res.json({
        message: 'OTP sent to your email',
        success: true
    });
});

app.post('/auth/verify-otp', async (req, res) => {
    await delay();
    if (shouldError()) return res.status(500).json({ message: 'Simulated server error' });

    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ message: 'Email and OTP are required', success: false });
    }

    if (otp !== OTP) {
        return res.status(400).json({ message: 'Invalid OTP', success: false });
    }

    const token = '1a2b3c4d5e6f7g8h9i0j';

    res.json({
        data: {
            token: token
        },
        message: 'OTP verification successful',
        success: true
    });
});

app.post('/auth/reset-password', async (req, res) => {
    await delay();
    if (shouldError()) return res.status(500).json({ message: 'Simulated server error' });

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required', success: false });
    }

    res.json({
        message: 'Password reset successful',
        success: true
    });
});

app.get('/auth/user', async (req, res) => {
    await delay();
    if (shouldError()) return res.status(500).json({ message: 'Simulated server error' });

    // Simulate checking for a bearer token in the headers
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    // In real app, would verify token here.

    const userId = Object.keys(USERS).find(key => USERS[key].email === 'test@example.com');
    const user = USERS[userId];

    if (!user) {
        return res.status(404).json({ message: 'User not found', success: false });
    }

    res.json({
        data: {
            id: user.id,
            name: user.name,
            email: user.email
        },
        success: true
    });
});

app.listen(port, () => {
  console.log(`Mock API server listening at http://localhost:${port}`);
});