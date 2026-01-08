// library/api/downloader/threads.js
const axios = require('axios');

const threadsDownload = async (req, res) => {
    const url = req.query.url;
    
    if (!url) {
        return res.status(400).json({ 
            error: "Missing 'url' parameter",
            usage: "/api/downloader/threads?url=https://www.threads.net/t/Cx5XxXxXxXx"
        });
    }
    
    try {
        const apiUrl = `https://snapthreads.net/api/download?url=${encodeURIComponent(url)}`;
        
        const response = await axios.get(apiUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36",
                "Referer": "https://snapthreads.net/id",
                "Accept": "*/*",
                "X-Requested-With": "XMLHttpRequest"
            },
            timeout: 15000
        });
        
        if (response.data && response.data.directLink) {
            return res.json({ 
                status: 'success',
                original_url: url,
                download_url: response.data.directLink,
                platform: 'threads'
            });
        } else {
            return res.status(404).json({ 
                status: 'error',
                message: "Failed to get download link from Threads",
                data: response.data
            });
        }
    } catch (error) {
        console.error("Threads Download Error:", error.message);
        return res.status(500).json({ 
            status: 'error',
            message: "Error downloading from Threads",
            error: error.message
        });
    }
};

module.exports = {
    threadsDownload
};