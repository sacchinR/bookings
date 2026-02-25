import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import App from './App';

const bootData = window.__BOOT_DATA__;

hydrateRoot(document.getElementById('root'), <App remoteMarkup={document.getElementById('remote-slot').innerHTML} />);

(async () => {
  const { default: FancyCard } = await import('remoteApp/FancyCard');
  hydrateRoot(document.getElementById('remote-slot'), <FancyCard {...bootData} />);
})();
