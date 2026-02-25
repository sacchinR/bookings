const fastify = require('fastify')({ logger: true });

function renderShell() {
  return `<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Container SSR shell</title>
  </head>
  <body>
    <div id="root">
      <main style="font-family:Arial,sans-serif;max-width:900px;margin:2rem auto;padding:0 1rem;">
        <h1>Container SSR shell</h1>
        <p>SSR is active. Client bundle should hydrate this shell in production mode.</p>
        <div id="remote-slot">Remote SSR placeholders render here.</div>
      </main>
    </div>
  </body>
</html>`;
}

fastify.get('/health', async () => ({ status: 'ok', service: 'container-ssr-example' }));
fastify.get('/', async (_req, reply) => reply.type('text/html').send(renderShell()));

fastify.listen({ host: '0.0.0.0', port: 4300 }).catch((err) => {
  fastify.log.error(err);
  process.exit(1);
});
