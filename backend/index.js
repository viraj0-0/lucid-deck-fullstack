// index.js
require('dotenv').config();
const express = require('express');
// const fetch = require('node-fetch'); // you have this in package.json
const rateLimit = require('express-rate-limit'); // install if missing
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const GEMINI_KEY = process.env.GEMINI_API_KEY || ''; // must be set in .env for real calls
const ALLOWED_ORIGIN = (process.env.ALLOWED_ORIGIN || 'http://localhost:5173').replace(/\/$/, ''); // strip trailing slash

// Basic rate limiter (tune for your needs)
const limiter = rateLimit({
  windowMs: 15 * 1000, // 15s
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(express.json({ limit: '1mb' }));
app.use(limiter);
app.use(cors({ origin: ALLOWED_ORIGIN }));

// Simple request logger (helpful while developing)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health route
app.get('/', (req, res) => {
  res.json({ ok: true, message: 'Backend up', pid: process.pid });
});


app.post('/api/gemini', async (req, res) => {
  try {
    // Log a short preview of body for debug
    const preview = JSON.stringify(req.body).slice(0, 2000);
    console.log('[/api/gemini] body preview:', preview);

    if (!req.body?.messages) {
      return res.status(400).json({ error: 'Missing messages in body' });
    }


const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`;
    const payload = {
      contents: req.body.messages,
      systemInstruction: { parts: [{ text: req.body.systemInstruction || '' }] },
      generationConfig: req.body.generationConfig || { temperature: 0.0, maxOutputTokens: 2048 }
    };

    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const text = await r.text();
    // Forward the response exactly (status + body)
    res.status(r.status).type('application/json').send(text);
    } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({
      error: 'Internal proxy error',
      details: err.message || String(err)
    });
  }
});


app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
  console.log(`Allowed origin: ${ALLOWED_ORIGIN}`);
  if (!GEMINI_KEY) {
    console.warn('Warning: GEMINI_API_KEY is not set. Set it in .env for real Gemini calls.');
  }
});

