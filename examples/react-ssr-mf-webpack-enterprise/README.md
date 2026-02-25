# Container-style React SSR + Module Federation Example

I used your webpack strategy and package structure to create this example:

- Environment-driven remotes (`REACT_APP_*_REMOTE_MFE`)
- Template-driven build switch (`REACT_APP_TEMPLATES`)
- Shared exports (`sharedSelectors`, `sharedActions`, `sharedComponents`, `sharedStore`)
- Separate client (`webpack.config.js`) and SSR (`webpack.ssr.js`) builds
- Fastify SSR server entrypoint (`server/index.js`)
- Redux Toolkit store (`configureStore`) is configured in `core/Store/store.js` and shared as a singleton across host/remotes via Module Federation.

## Files to review first

- `webpack.config.js` → mirrors your client build pipeline with SVG, SCSS modules, aliases, compression, and federation remotes.
- `webpack.ssr.js` → Node target SSR build with Module Federation `remoteType: "commonjs-module"`.
- `package.json` → aligns with your scripts (`build:client`, `build:ssr`, `start:ssr`, `verify`, `analyze`).

## Run flow

```bash
cp .env.example .env
npm install
npm run build
npm run start:ssr
```

Then open `http://localhost:4300`.

## Notes

- This repository environment may block npm registry access, so `npm install` can fail here.
- If so, run this example in your local/dev network where npm access is allowed.
