// library/api/ai/gemini.js
const { GoogleGenAI } = require('@google/genai');

const geminiChat = async (req, res) => {
    const text = req.query.text;
    const apikey = req.query.apikey;
    
    if (!text || !apikey) {
        return res.status(400).json({ 
            error: "Missing 'text' or 'apikey' parameter",
            usage: "/api/ai/gemini?text=Your question&apikey=Your_Gemini_API_Key"
        });
    }
    
    try {
        const ai = new GoogleGenAI({ apiKey: apikey });
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: text
        });
        
        const replyText = response?.text ?? response?.output?.[0]?.content ?? JSON.stringify(response);
        return res.json({ 
            status: 'success',
            text: replyText,
            model: 'gemini-2.5-flash-lite'
        });
    } catch (e) {
        console.error('Gemini API Error:', e.message);
        return res.status(500).json({ 
            status: 'error',
            error: e.message,
            suggestion: 'Check your API key and try again'
        });
    }
};

const geminiWithSystem = async (req, res) => {
    const text = req.query.text;
    const system = req.query.system;
    const apikey = req.query.apikey;
    
    if (!text || !system || !apikey) {
        return res.status(400).json({ 
            error: "Missing 'text', 'system' or 'apikey' parameter",
            usage: "/api/ai/geminiwithsysteminstruction?text=Your question&system=System instruction&apikey=Your_Gemini_API_Key"
        });
    }
    
    try {
        const ai = new GoogleGenAI({ apiKey: apikey });
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: text,
            config: {
                systemInstruction: system,
            },
        });
        
        return res.json({ 
            status: 'success',
            text: response.text,
            model: 'gemini-2.5-flash-lite',
            hasSystemInstruction: true
        });
    } catch (e) {
        console.error('Gemini with System Error:', e.message);
        return res.status(500).json({ 
            status: 'error',
            error: e.message
        });
    }
};

module.exports = {
    geminiChat,
    geminiWithSystem
};