# React SSR + Microfrontend Example (Webpack Module Federation)

This folder now includes two things:

1. **A runnable zero-install demo** that works in restricted environments.
2. **Webpack Module Federation config examples** (`webpack/*.js`) showing the host/remote SSR wiring pattern.

## Run (works without npm install)

From this folder:

```bash
node remote/src/server.js
node host/src/server.js
```

Then open `http://localhost:3000`.

## What you will see

- The host server fetches remote SSR markup from `http://localhost:3001/ssr`.
- The host injects that HTML into `<section id="remote-slot">`.
- In the browser, `remoteEntry.js` exposes `window.remoteApp.get('./FancyCard')` and host `client.js` re-renders the remote slot to simulate client hydration.

## Webpack configs included

- `webpack/host.client.js`
- `webpack/host.server.js`
- `webpack/remote.client.js`
- `webpack/remote.server.js`

These files demonstrate how SSR + federation is typically wired with webpack (including server-side `remoteType: "commonjs-module"`).
