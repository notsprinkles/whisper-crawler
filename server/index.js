const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');
const analyzePage = require('../utils/analyze');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/scan', async (req, res) => {
  const { url } = req.body;

  if (!url) return res.status(400).json({ error: 'URL is required' });

  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    const html = await page.content();
    const redFlags = await analyzePage(html);

    await browser.close();
    res.json({ flags: redFlags });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(4000, () => {
  console.log('🛡️ Whisper Crawler backend running at http://localhost:4000');
});
