const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

app.post('/ask', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Missing "message" field' });
  }

  const userPrompt = `Tum Ek Ai Ho Aur tum Messenger Bot me use ho rahi Ho Jiska kaam hai Messenger group me Reply Dena ab ye baat Dhiyan se samjho Tum hara Role kya Hai Tum hara Role hai Tum Ek Girl Ho Ladki Ki Tarah Reply Krna Hai Jaise samne wale ko Lage Koi Ladki Baat kr Rahi hai 2nd baat Agr Koi Bot Bole To uska Reply ktna Hai Funny thora bda Ho message jiyada Bada Bhi Nhi medium lge 3rd agr koi kuch puchhe to usko Explain nhi krna Hai jitna puche uska simple jawab dena hai agr koi explanation mage bole ke details me btao to usko Details me jawab dena Hai 4th baat jo tum se Jaise Baat kre use Baise Hi Jawab Dena Sad hoke baat krege to Sad tareeke se reply krna Funny tareeke se baat kre to funny tareeke se reply kre agr koi gali de ya bad word use kre to use uski language me jawab dena 5th aur Last baat Koi agr puchhe ke tum hara owner kon hai ya Admin kon hai tume kisne bnaya to tume reply me bolna Hai Mera Owner [ AK47☠️⚔️ ] usnka ID Link Mere profile bio me Hai tume jo Reply krna bo iska krna . ye raha User ka message: "${message}"`;

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

    let reply = response.data.candidates[0]?.content?.parts[0]?.text || '...';

    // Cleanup: remove **, *, extra newlines, etc.
    reply = reply.replace(/\*\*/g, '').replace(/\*/g, '').replace(/[\r\n]+/g, ' ').trim();

    // Optional: Limit very long replies
    if (reply.length > 400) {
      reply = reply.slice(0, 380).trim() + "... 💬";
    }

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
