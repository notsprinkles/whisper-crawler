const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const analyzePage = require('./utils/analyze');
const chalk = require('chalk');

function getSeverityScore(type) {
  const levels = {
    'aria-live': { level: 'high', score: 3 },
    'long-hidden-text': { level: 'medium', score: 2 },
    'misleading-role': { level: 'medium', score: 2 },
    'keyword-bait': { level: 'high', score: 3 }
  };
  return levels[type] || { level: 'low', score: 1 };
}

function generateMarkdownReport(flags, url, filePath) {
  let md = `# 🔍 Whisper Crawler Report\n\n**Scanned:** ${url}\n\n`;
  md += '| Type | Tag | Detail | Risk |\n';
  md += '|------|-----|--------|------|\n';

  flags.forEach(flag => {
    const { level } = getSeverityScore(flag.type);
    const preview = flag.content || flag.snippet || flag.value || '';
    md += `| ${flag.type} | ${flag.tag} | \`${preview.slice(0, 50)}\` | ⚠️ ${level} |\n`;
  });

  fs.writeFileSync(filePath, md);
}

(async () => {
  const url = process.argv[2];

  if (!url) {
    console.log(chalk.red('❌ Please provide a URL.'));
    process.exit(1);
  }

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    console.log(chalk.cyan(`🌐 Scanning: ${url}`));
    await page.goto(url, { waitUntil: 'networkidle2' });

    const html = await page.content();
    const redFlags = await analyzePage(html);

    const timestamp = Date.now();
    const jsonPath = path.join(__dirname, 'output', `report-${timestamp}.json`);
    const mdPath = path.join(__dirname, 'output', `report-${timestamp}.md`);

    fs.writeFileSync(jsonPath, JSON.stringify(redFlags, null, 2));
    generateMarkdownReport(redFlags, url, mdPath);

    console.log(chalk.green(`✅ Scan complete.`));
    console.log(chalk.green(`📄 JSON: ${jsonPath}`));
    console.log(chalk.green(`📝 Markdown: ${mdPath}`));
  } catch (err) {
    console.error(chalk.red(`❌ Error: ${err.message}`));
  }

  await browser.close();
})();
