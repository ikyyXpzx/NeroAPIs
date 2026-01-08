// library/utils/helpers.js

/**
 * Validate URL
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid URL
 */
function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
}

/**
 * Sanitize input string
 * @param {string} input - Input string
 * @returns {string} - Sanitized string
 */
function sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    return input.trim().replace(/[<>]/g, '');
}

/**
 * Format response for consistency
 * @param {object} data - Response data
 * @param {string} status - Status (success/error)
 * @param {string} message - Optional message
 * @returns {object} - Formatted response
 */
function formatResponse(data, status = 'success', message = '') {
    return {
        status: status,
        data: data,
        message: message,
        timestamp: new Date().toISOString()
    };
}

/**
 * Generate API documentation URL
 * @param {string} endpoint - API endpoint
 * @returns {string} - Documentation URL
 */
function getApiDocUrl(endpoint) {
    return `/api/info#${endpoint.replace('/', '')}`;
}

/**
 * Log API request
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
function logRequest(req, res) {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.originalUrl;
    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('user-agent') || 'Unknown';
    
    console.log(`[${timestamp}] ${method} ${url} - IP: ${ip} - UA: ${userAgent}`);
}

module.exports = {
    isValidUrl,
    sanitizeInput,
    formatResponse,
    getApiDocUrl,
    logRequest
};