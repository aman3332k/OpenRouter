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

  const userPrompt = `Tum Ek Ai Ho Aur tum Messenger Bot me use ho rahi tume reply krna hai . ye raha User ka message: "${message}"`;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: "mistralai/mixtral-8x7b", // you can change this to another model like 'openai/gpt-3.5-turbo' or 'meta-llama/llama-3-70b-instruct'
        messages: [
          {
            role: 'system',
            content: 'You are a helpful female AI Messenger bot who responds in a girl-like conversational tone.'
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
          'HTTP-Referer': 'https://yourdomain.com', // Optional: Replace with your domain or project
          'X-Title': 'MessengerBot-AK' // Optional: Project title
        }
      }
    );

    let reply = response.data.choices[0]?.message?.content || '...';

    // Cleanup
    reply = reply.replace(/\*\*/g, '').replace(/\*/g, '').replace(/[\r\n]+/g, ' ').trim();

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
  console.log(`OpenRouter API server running on port ${PORT}`);
});
