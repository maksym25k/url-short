import React, { useState } from 'react';

export const Dashboard: React.FC = () => {
  const [link, setLink] = useState('');

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    
  };

  return (
    <section>
      <h2>Dashboard</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="dash-link">Link:</label>
          <input
            id="dash-link"
            type="text"
            required
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </section>
  );
};