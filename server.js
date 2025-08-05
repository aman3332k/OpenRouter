const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

const starters = [
  "Haan bhai, simple baat yeh hai:",
  "Suno na, ye raha:",
  "Dekho yaar, seedha jawab:",
  "Bhai, meri sunn 👇",
  "Acha suno ❤️"
];

app.post('/ask', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Missing "message" field' });
  }

  const userPrompt = `Tume use ke message ka reply krna is tarah jisse lage ke koi insan Ladki reply kr rahi hai jiyada lamba nhi krna hai message only kaam ki baat ka reply do jo main reply ho kyu tum API dobara use ho rahe ho messenger bot me to user ko lgna chahiye jaise koi insan reply de raha Hai thora ladki ki tarah reply dena Ladki ke style me thora romantic aur jaisa message aye bese hi reply dena usi andaz me is message ka reply krna hai. Ye raha user ka message: "${message}"`;

  try {
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
      {
        contents: [
          {
            parts: [
              {
                text: userPrompt
              }
            ]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': process.env.GEMINI_API_KEY
        }
      }
    );

    let reply = response.data.candidates[0]?.content?.parts[0]?.text || 'No response';

    // Clean reply: remove *bold*, line breaks etc.
    reply = reply.replace(/\*\*/g, '').replace(/[\r\n]+/g, ' ').trim();

    // Optional: Soft trim if very large
    if (reply.length > 450) {
      reply = reply.slice(0, 420).trim() + "... aur baaki baad me 😄";
    }

    // Add human-like starter
    const starter = starters[Math.floor(Math.random() * starters.length)];
    reply = `${starter}\n${reply}`;

    res.json({ reply });

  } catch (error) {
    console.error('Gemini API error:', error?.response?.data || error.message);
    res.status(500).json({
      error: 'Gemini API error',
      details: error?.response?.data || error.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Gemini API server running on port ${PORT}`);
});
