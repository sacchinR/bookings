const http = require('http');
const fs = require('fs');
const path = require('path');
const template = require('./template');

const port = 3000;
const clientPath = path.resolve(__dirname, './client.js');

function send(res, status, contentType, body) {
  res.writeHead(status, {
    'Content-Type': contentType,
    'Content-Length': Buffer.byteLength(body)
  });
  res.end(body);
}

async function fetchRemoteSsrMarkup(bootData) {
  const query = new URLSearchParams({
    title: bootData.title,
    body: bootData.body
  });

  const response = await fetch(`http://localhost:3001/ssr?${query.toString()}`);
  if (!response.ok) {
    throw new Error(`remote SSR failed with status ${response.status}`);
  }

  const payload = await response.json();
  return payload.html;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === '/health') {
    send(res, 200, 'application/json; charset=utf-8', JSON.stringify({ status: 'ok', service: 'host' }));
    return;
  }

  if (url.pathname === '/client.js') {
    const code = fs.readFileSync(clientPath, 'utf8');
    send(res, 200, 'text/javascript; charset=utf-8', code);
    return;
  }

  if (url.pathname === '/') {
    const bootData = {
      title: 'Rendered on remote server (SSR)',
      body: 'Host stitched this HTML into the page, then client replaced it with a client-rendered remote card.'
    };

    try {
      const remoteMarkup = await fetchRemoteSsrMarkup(bootData);
      const appHtml = `
      <main style="max-width: 760px; margin: 2rem auto; padding: 0 1rem;">
        <h1 style="margin-bottom: 0.5rem;">React SSR + Microfrontend (Webpack-style federation demo)</h1>
        <p style="margin-top: 0; color: #374151;">This page is server-rendered by the host and includes remote SSR HTML.</p>
        <section id="remote-slot">${remoteMarkup}</section>
      </main>`;

      send(res, 200, 'text/html; charset=utf-8', template(appHtml, bootData));
    } catch (error) {
      send(res, 500, 'text/plain; charset=utf-8', `Failed to render page: ${error.message}`);
    }
    return;
  }

  send(res, 404, 'application/json; charset=utf-8', JSON.stringify({ error: 'not found' }));
});

server.listen(port, () => {
  console.log(`host listening on http://localhost:${port}`);
});
