import React from 'react';

export function SharedCard({ title, children }) {
  return (
    <article style={{ border: '1px solid #d1d5db', borderRadius: 12, padding: 16 }}>
      <h3>{title}</h3>
      <div>{children}</div>
    </article>
  );
}
