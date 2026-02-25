import React from 'react';
import { renderToString } from 'react-dom/server';
import FancyCard from './FancyCard';

export function renderFancyCard(props) {
  return renderToString(<FancyCard {...props} />);
}
