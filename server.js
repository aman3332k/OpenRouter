const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

app.post('/ask', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Missing "message" field' });
    }

    // User ka prompt
    const userPrompt = `Tum ek AI ho jo Messenger bot me use ho rahi hai. Tum ek friendly ladki jaise casual tone me jawab dogi. User ka message: "${message}"`;

    // OpenRouter API request
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: process.env.OPENROUTER_MODEL || "google/gemma-3-27b-it", // Change in .env if needed
        messages: [
          {
            role: 'system',
            content: 'You are a helpful female AI Messenger bot who responds in a girl-like, friendly conversational tone.'
          },
          {
            role: 'user',
            content: userPrompt
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': process.env.SITE_URL || 'https://example.com',
          'X-Title': process.env.SITE_TITLE || 'MessengerBot-AK'
        }
      }
    );

    // Extract reply
    let reply = response.data?.choices?.[0]?.message?.content || 'Mujhe samajh nahi aaya 💬';

    // Clean formatting
    reply = reply
      .replace(/\*\*/g, '') // bold hatao
      .replace(/\*/g, '')   // italics hatao
      .replace(/[\r\n]+/g, ' ') // new lines hatao
      .trim();

    // Limit reply length
    if (reply.length > 400) {
      reply = reply.slice(0, 380).trim() + "... 💬";
    }

    res.json({ reply });

  } catch (error) {
    console.error('OpenRouter API error:', error?.response?.data || error.message);
    res.status(500).json({
      error: 'OpenRouter API error',
      details: error?.response?.data || error.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 OpenRouter API server running on port ${PORT}`);
});
