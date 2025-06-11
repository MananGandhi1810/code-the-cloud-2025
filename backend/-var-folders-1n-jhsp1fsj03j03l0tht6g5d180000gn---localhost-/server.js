const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const apiEndpoints = require('./api').apiEndpoints;

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const OTP = '123456';
const defaultToken = '1a2b3c4d5e6f7g8h9i0j';

// In-memory data (simulating a database)
const users = [];

// Function to simulate delay
const simulateDelay = () => new Promise(res => setTimeout(res, Math.random() * 200));

// Function to simulate error
const simulateError = () => Math.random() < 0.02;

// Details endpoint
app.get('/details', (req, res) => {
  res.json({
    message: 'Mock API Server Details',
    endpoints: apiEndpoints.map(endpoint => ({
      name: endpoint.name,
      method: endpoint.method,
      description: `Mock endpoint for ${endpoint.name}`
    }))
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

apiEndpoints.forEach(endpoint => {
  app[endpoint.method.toLowerCase()](endpoint.name, async (req, res) => {
    // Simulate delay
    await simulateDelay();

    // Simulate error
    if (simulateError()) {
      return res.status(500).json({ message: 'Simulated server error', success: false });
    }

    // Check for Bearer token in headers (simulation)
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (endpoint.name === '/auth/user' && !token) {
      return res.status(401).json({ message: 'Unauthorized', success: false });
    }

    switch (endpoint.name) {
      case '/auth/login':
        const { email, password } = req.body;
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
          return res.json({
            data: {
              user: { id: 'user123', name: user.name, email: user.email, points: 100 },
              token: defaultToken
            },
            message: 'Login successful',
            success: true
          });
        } else {
          return res.status(401).json({ message: 'Invalid credentials', success: false });
        }

      case '/auth/register':
        const { name, email: newEmail, password: newPassword } = req.body;
        if (users.find(u => u.email === newEmail)) {
           return res.status(400).json({ message: 'Email already exists', success: false });
        }
        users.push({ name: name, email: newEmail, password: newPassword });
        return res.json({ message: 'Registration successful', success: true });

      case '/auth/user':
        return res.json({
          data: { id: 'user123', name: 'John Doe', email: 'john.doe@example.com' },
          success: true
        });

      case '/auth/forgot-password':
        const { email: forgotEmail } = req.body;
        // In real app, you would send an email with the OTP
        return res.json({ message: `OTP sent to ${forgotEmail}`, success: true });

      case '/auth/verify-otp':
        const { email: verifyEmail, otp } = req.body;
        if (otp === OTP) {
          return res.json({
            data: { token: defaultToken },
            message: 'OTP verified successfully',
            success: true
          });
        } else {
          return res.status(400).json({ message: 'Invalid OTP', success: false });
        }

      case '/auth/reset-password':
        const { email: resetEmail, password: resetPassword } = req.body;
        // In real app, you would update the password in the database
        return res.json({ message: 'Password reset successfully', success: true });

      default:
        return res.status(404).json({ message: 'Endpoint not found', success: false });
    }
  });
});

app.listen(port, () => {
  console.log(`Mock API server listening at http://localhost:${port}`);
});