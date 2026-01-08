// index.js
const express = require('express');
const path = require('path');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api', apiRoutes);

// Serve frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve script.js
app.get('/script.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'script.js'));
});

// Serve listapi.json
app.get('/listapi.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'data', 'listapi.json'));
});

// Serve CSS
app.get('/css/style.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'css', 'style.css'));
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🔥 NeroAPIs running on http://localhost:${PORT}`);
        console.log(`📚 API Documentation: http://localhost:${PORT}`);
    });
}

module.exports = app;