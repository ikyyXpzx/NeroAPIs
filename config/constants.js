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
            SSWEB_PC: '/tools/ssweb-pc',
            SSWEB_HP: '/tools/ssweb-hp'
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
    }
};