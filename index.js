require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();
app.use(express.static('public'))
app.use(cors());
app.use(express.json());

app.post('/generate-email', async (req, res) => {
    const { topic, details, tone } = req.body;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: `Write an email with the following topic: ${topic}. Here are the details: ${details}. The tone should be ${tone}.` }
                ],
                max_tokens: 150
            })
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error generating email' });
    }
});

app.listen(process.env.PORT);

