import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';

export async function renderPage() {
  const { renderFancyCard } = await import('remoteApp/ssr');
  const cardProps = {
    title: 'Rendered on remote server bundle',
    body: 'This HTML comes from remoteApp/ssr and is stitched into the host SSR output.'
  };

  const remoteMarkup = renderFancyCard(cardProps);
  const appHtml = renderToString(<App remoteMarkup={remoteMarkup} />);

  return {
    appHtml,
    bootData: cardProps
  };
}
