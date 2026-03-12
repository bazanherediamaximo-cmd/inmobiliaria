const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

app.post('/api/chat', async (req, res) => {
    try {
        const text = req.body.text;
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

        const response =await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    role: "user",
                    parts: [{
                        text: `Sos el asistente virtual de Prisma Estate, una inmobiliaria premium en Córdoba, Argentina. Respondé de forma breve (máximo 2 oraciones), profesional y amable a esto: ${text}`
                    }]
                }]
            })
        });

        const data = await response.json();

        if (data.error) {
            console.error("Error exacto de Google:", data.error.message);
            return res.json({ reply: "Hubo un error con la API. Revise la terminal." });
        }
        const aiText = data.candidates[0].content.parts[0].text;
        res.json({ reply: aiText });
    } catch (error) {
        console.error("Error en el servidor:", error);
        res.status(500).json({ error: "Hubo un problema conectando con Google Gemini" });
    }
});

app.listen(PORT, () => {
    console.log(`Backend seguro corriendo en http://localhost:${PORT}`);
});