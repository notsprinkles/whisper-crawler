const { JSDOM } = require('jsdom');

function analyzePage(html) {
  const dom = new JSDOM(html);
  const doc = dom.window.document;
  const redFlags = [];

  // Aria-live regions
  doc.querySelectorAll('[aria-live]').forEach(el => {
    redFlags.push({
      type: 'aria-live',
      tag: el.tagName.toLowerCase(),
      role: el.getAttribute('role'),
      content: el.textContent.trim().slice(0, 100),
      snippet: el.outerHTML.slice(0, 150)
    });
  });

  // Misleading roles
  doc.querySelectorAll('[role]').forEach(el => {
    const role = el.getAttribute('role');
    const tag = el.tagName.toLowerCase();

    if (role === 'textbox' && !['input', 'textarea'].includes(tag)) {
      redFlags.push({
        type: 'misleading-role',
        tag,
        role,
        content: el.textContent.trim().slice(0, 100),
        snippet: el.outerHTML.slice(0, 150)
      });
    }
  });

  // Long hidden content
  doc.querySelectorAll('[hidden], [aria-hidden="true"], [style*="display:none"]').forEach(el => {
    const text = el.textContent.trim();
    if (text.length > 300) {
      redFlags.push({
        type: 'long-hidden-text',
        tag: el.tagName.toLowerCase(),
        length: text.length,
        snippet: text.slice(0, 150)
      });
    }
  });

  // Keyword bait in aria-* attributes
  doc.querySelectorAll('*').forEach(el => {
    Array.from(el.attributes).forEach(attr => {
      if (attr.name.startsWith('aria-') && /(secure|verify|token|auth|login)/i.test(attr.value)) {
        redFlags.push({
          type: 'keyword-bait',
          tag: el.tagName.toLowerCase(),
          attr: attr.name,
          value: attr.value,
          snippet: el.outerHTML.slice(0, 150)
        });
      }
    });
  });

  return redFlags;
}

module.exports = analyzePage;
