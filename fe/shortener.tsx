import React, { useState } from 'react';

export const Shortener: React.FC = () => {
  const [url, setUrl] = useState('');
  const [alias, setAlias] = useState('');
  const [output, setOutput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to generate or fetch shortened link goes here
    setOutput(alias ? `https://short.link/${alias}` : 'https://short.link/xyz123');
  };

  return (
    <section>
      <h2>URL Shortener</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="url">Destination URL:</label>
          <input
            id="url"
            type="url"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="alias">Custom Alias (optional):</label>
          <input
            id="alias"
            type="text"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
          />
        </div>
        <button type="submit">Shorten</button>
      </form>

      <div>
        <label htmlFor="output">Shortened URL:</label>
        <input id="output" type="text" readOnly value={output} />
      </div>
    </section>
  );
};