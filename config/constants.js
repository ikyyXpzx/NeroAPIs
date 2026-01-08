// config/constants.js
module.exports = {
    API_PATHS: {
        AI: {
            GEMINI: '/ai/gemini',
            GEMINI_SYSTEM: '/ai/geminiwithsysteminstruction'
        },
        DOWNLOADER: {
            VIDEOY: '/downloader/videy',
            THREADS: '/downloader/threads'
        },
        TOOLS: {
            SSWEB: '/tools/ssweb',
            SSWEB_RESOLUTIONS: '/tools/ssweb/resolutions'
        }
    },
    ERROR_MESSAGES: {
        MISSING_PARAMS: "Missing required parameters",
        INVALID_URL: "Invalid URL parameter",
        SERVER_ERROR: "Internal server error",
        API_KEY_REQUIRED: "API key is required"
    },
    HTTP_STATUS: {
        OK: 200,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        NOT_FOUND: 404,
        INTERNAL_ERROR: 500
    },
    // Device presets untuk screenshot
    DEVICE_PRESETS: {
        'pc': { width: 1280, height: 720, label: 'Desktop (16:9)' },
        'laptop': { width: 1366, height: 768, label: 'Laptop (16:9)' },
        'tablet': { width: 768, height: 1024, label: 'Tablet (3:4)' },
        'mobile': { width: 375, height: 667, label: 'Mobile (9:16)' },
        'mobile-large': { width: 414, height: 896, label: 'Mobile Large (9:19.5)' }
    }
};