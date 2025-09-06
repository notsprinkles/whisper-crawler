# 🕵️‍♀️ Whisper Crawler

> DOM Recon Scanner for ARIA Exploits, Whisper Traps & Accessibility-Based Phishing Vectors

Whisper Crawler is a CLI tool for scanning live websites and flagging **social engineering vulnerabilities hidden in accessibility features** like `aria-live`, misleading roles, keyword bait, and long hidden content. It’s ideal for red team reconnaissance or accessibility-focused security audits.

🔍 What It Detects
Red Flag Type	Description
aria-live	Invisible screen reader regions that speak without user interaction
misleading-role	Roles like textbox used on non-interactive elements (div, span, etc.)
long-hidden-text	Content over 300 characters hidden from view (aria-hidden, display:none, etc.)
keyword-bait	Suspicious terms in aria-* attributes (token, secure, verify, auth, etc.)

Each flag is scored with a risk level (Low, Medium, High) and exported in both JSON and Markdown format.

📂 Output

After each scan, you’ll get two files in /output:

✅ report-xxxxx.json – raw data for programmatic use

📝 report-xxxxx.md – pretty Markdown report with emoji, tables, and severity tags
# 🔍 Whisper Crawler Report

**Scanned:** https://example.com

| Type            | Tag   | Detail                                 | Risk   |
|-----------------|-------|----------------------------------------|--------|
| aria-live       | div   | "⚠️ Important update..."               | ⚠️ High |
| misleading-role | span  | role="textbox" on span                 | ⚠️ Medium |

🧠 Tech Stack

Node.js

Puppeteer (headless Chrome browser)

JSDOM (DOM parsing for analysis)

Chalk (CLI styling)

Markdown / JSON Export

## ⚡ Live Demo

```bash
git clone https://github.com/notsprinkles/whisper-crawler.git
cd whisper-crawler
npm install
node index.js https://target-website.com




