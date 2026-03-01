import React from 'react';

export default function FancyCard({ title, body }) {
  return (
    <article style={{ border: '2px solid #0ea5e9', padding: 16, borderRadius: 10 }}>
      <h2>{title}</h2>
      <p>{body}</p>
    </article>
  );
}
