// library/api/downloader/videy.js
const videyDownload = async (req, res) => {
    const url = req.query.url;
    
    if (!url) {
        return res.status(400).json({ 
            error: "Missing 'url' parameter",
            usage: "/api/downloader/videy?url=https://videy.co/video_id"
        });
    }
    
    try {
        const videoId = url.split("=")[1];
        if (!videoId) {
            return res.status(400).json({ 
                error: "Invalid 'url' parameter",
                example: "https://videy.co/watch?v=video_id"
            });
        }
        
        const downloadUrl = `https://cdn.videy.co/${videoId}.mp4`;
        
        return res.json({ 
            status: 'success',
            original_url: url,
            download_url: downloadUrl,
            video_id: videoId,
            format: 'mp4'
        });
    } catch (e) {
        console.error('Videy Download Error:', e.message);
        return res.status(500).json({ 
            status: 'error',
            error: e.message
        });
    }
};

module.exports = {
    videyDownload
};