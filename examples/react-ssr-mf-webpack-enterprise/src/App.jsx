import React from 'react';
import { RemoteSlot } from './components/RemoteSlot';

export default function App() {
  return (
    <main className="shell">
      <h1>Container Web App (SSR + Module Federation)</h1>
      <p>
        This example mirrors your webpack+package setup, including environment-driven remotes,
        template selection, shared modules, and separate client/server builds.
      </p>
      <RemoteSlot />
    </main>
  );
}
