module.exports = function htmlTemplate(appHtml, bootData) {
  return `<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SSR Federation Example (Runnable Demo)</title>
  </head>
  <body style="font-family: sans-serif; margin: 0; padding: 0; background: #fff; color: #111827;">
    <div id="root">${appHtml}</div>
    <script>window.__BOOT_DATA__ = ${JSON.stringify(bootData)};</script>
    <script src="http://localhost:3001/remoteEntry.js"></script>
    <script src="/client.js"></script>
  </body>
</html>`;
};
