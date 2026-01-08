// routes/api.js
const express = require('express');
const router = express.Router();

// Import API modules
const geminiAI = require('../library/api/ai/gemini');
const videyDownloader = require('../library/api/downloader/videy');
const threadsDownloader = require('../library/api/downloader/threads');
const sswebTools = require('../library/api/tools/ssweb');

// AI Endpoints
router.get('/ai/gemini', geminiAI.geminiChat);
router.get('/ai/geminiwithsysteminstruction', geminiAI.geminiWithSystem);

// Downloader Endpoints
router.get('/downloader/videy', videyDownloader.videyDownload);
router.get('/downloader/threads', threadsDownloader.threadsDownload);

// Tools Endpoints
router.get('/tools/ssweb-pc', sswebTools.screenshotPC);
router.get('/tools/ssweb-hp', sswebTools.screenshotMobile);

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'NeroAPIs',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// API info endpoint
router.get('/info', (req, res) => {
    res.json({
        name: 'NeroAPIs',
        version: '1.0.0',
        description: 'Powerful API Collection for Developers',
        endpoints: {
            ai: ['/ai/gemini', '/ai/geminiwithsysteminstruction'],
            downloader: ['/downloader/videy', '/downloader/threads'],
            tools: ['/tools/ssweb-pc', '/tools/ssweb-hp']
        },
        documentation: '/listapi.json'
    });
});

module.exports = router;