// library/api/tools/ssweb.js
const axios = require('axios');
const fetch = require('node-fetch');

async function takeScreenshot(url, options = {}) {
    const { width = 1280, height = 720, full_page = false, device_scale = 1 } = options;
    
    try {
        if (!url.startsWith('https://')) {
            throw new Error('URL must start with https://');
        }
        
        const { data } = await axios.post('https://gcp.imagy.app/screenshot/createscreenshot', {
            url: url,
            browserWidth: parseInt(width),
            browserHeight: parseInt(height),
            fullPage: full_page,
            deviceScaleFactor: parseInt(device_scale),
            format: 'png'
        }, {
            headers: {
                'content-type': 'application/json',
                referer: 'https://imagy.app/full-page-screenshot-taker/',
                'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36'
            },
            timeout: 30000
        });
        
        if (!data.fileUrl) {
            throw new Error('No screenshot URL returned from service');
        }
        
        return data.fileUrl;
    } catch (error) {
        throw new Error(`Screenshot failed: ${error.message}`);
    }
}

const screenshotPC = async (req, res) => {
    const url = req.query.url;
    
    if (!url) {
        return res.status(400).json({ 
            error: "Missing 'url' parameter",
            usage: "/api/tools/ssweb-pc?url=https://example.com"
        });
    }
    
    try {
        const resultpic = await takeScreenshot(url, { width: 1280, height: 720 });
        const buffer = await fetch(resultpic).then((response) => response.buffer());
        
        res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': buffer.length,
            'X-Screenshot-Service': 'NeroAPIs Screenshot',
            'X-Original-URL': url
        });
        res.end(buffer);
    } catch (e) {
        console.error('Screenshot PC Error:', e.message);
        return res.status(500).json({ 
            error: e.message,
            suggestion: 'Make sure the URL is accessible and starts with https://'
        });
    }
};

const screenshotMobile = async (req, res) => {
    const url = req.query.url;
    
    if (!url) {
        return res.status(400).json({ 
            error: "Missing 'url' parameter",
            usage: "/api/tools/ssweb-hp?url=https://example.com"
        });
    }
    
    try {
        const resultpic = await takeScreenshot(url, { width: 720, height: 1280 });
        const buffer = await fetch(resultpic).then((response) => response.buffer());
        
        res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': buffer.length,
            'X-Screenshot-Service': 'NeroAPIs Screenshot',
            'X-Original-URL': url,
            'X-Device': 'mobile'
        });
        res.end(buffer);
    } catch (e) {
        console.error('Screenshot Mobile Error:', e.message);
        return res.status(500).json({ 
            error: e.message,
            suggestion: 'Make sure the URL is accessible and starts with https://'
        });
    }
};

module.exports = {
    takeScreenshot,
    screenshotPC,
    screenshotMobile
};