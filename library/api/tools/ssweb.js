// library/api/tools/ssweb.js
const axios = require('axios');
const fetch = require('node-fetch');

// Preset resolusi
const RESOLUTION_PRESETS = {
    'pc': { width: 1280, height: 720, device: 'Desktop (16:9)' },
    'laptop': { width: 1366, height: 768, device: 'Laptop (16:9)' },
    'tablet': { width: 768, height: 1024, device: 'Tablet (3:4)' },
    'mobile': { width: 375, height: 667, device: 'Mobile (9:16)' },
    'mobile-large': { width: 414, height: 896, device: 'Mobile Large (9:19.5)' }
};

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

const screenshot = async (req, res) => {
    const url = req.query.url;
    const device = req.query.device || 'pc';
    const width = req.query.width;
    const height = req.query.height;
    
    if (!url) {
        return res.status(400).json({ 
            error: "Missing 'url' parameter",
            usage: "/api/tools/ssweb?url=https://example.com&device=pc",
            available_devices: Object.keys(RESOLUTION_PRESETS),
            example: "/api/tools/ssweb?url=https://example.com&device=mobile"
        });
    }
    
    try {
        let screenshotOptions = {};
        
        // Jika menggunakan preset device
        if (RESOLUTION_PRESETS[device]) {
            screenshotOptions = { 
                width: RESOLUTION_PRESETS[device].width, 
                height: RESOLUTION_PRESETS[device].height 
            };
        } 
        // Jika menggunakan custom width/height
        else if (width && height) {
            const w = parseInt(width);
            const h = parseInt(height);
            
            if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) {
                return res.status(400).json({
                    error: "Invalid width or height parameters",
                    width: width,
                    height: height
                });
            }
            
            screenshotOptions = { width: w, height: h };
        } 
        // Default ke PC jika tidak ada parameter yang valid
        else {
            screenshotOptions = { width: 1280, height: 720 };
        }
        
        const resultpic = await takeScreenshot(url, screenshotOptions);
        const buffer = await fetch(resultpic).then((response) => response.buffer());
        
        res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': buffer.length,
            'X-Screenshot-Service': 'NeroAPIs Screenshot',
            'X-Original-URL': url,
            'X-Device': device,
            'X-Resolution': `${screenshotOptions.width}x${screenshotOptions.height}`,
            'X-Preset': RESOLUTION_PRESETS[device]?.device || 'custom'
        });
        res.end(buffer);
    } catch (e) {
        console.error('Screenshot Error:', e.message);
        return res.status(500).json({ 
            error: e.message,
            suggestion: 'Make sure the URL is accessible and starts with https://'
        });
    }
};

// Endpoint untuk mendapatkan info tentang resolusi yang tersedia
const getResolutions = async (req, res) => {
    return res.json({
        status: 'success',
        available_presets: RESOLUTION_PRESETS,
        usage: {
            basic: "/api/tools/ssweb?url=https://example.com&device=pc",
            custom: "/api/tools/ssweb?url=https://example.com&width=1920&height=1080",
            note: "Parameter 'device' akan meng-override 'width' dan 'height' jika diberikan"
        }
    });
};

module.exports = {
    takeScreenshot,
    screenshot,
    getResolutions,
    RESOLUTION_PRESETS
};