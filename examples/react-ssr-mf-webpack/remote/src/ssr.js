function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderFancyCard(props) {
  const title = escapeHtml(props.title || 'Untitled');
  const body = escapeHtml(props.body || '');

  return `<article style="border:2px solid #0ea5e9;padding:16px;border-radius:10px;background:#f0f9ff;">
    <h2 style="margin-top:0;">${title}</h2>
    <p style="margin-bottom:0;">${body}</p>
  </article>`;
}

module.exports = { renderFancyCard };
