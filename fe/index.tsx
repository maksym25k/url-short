import React, { useState } from 'react';
import { Shortener } from './shortener';
import { Dashboard } from './Dashboard';

export const Index: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'shortener' | 'dashboard'>('shortener');

  return (
    <div>
      <header>
        <nav>
          <button onClick={() => setActiveTab('shortener')}>Shortener</button>
          <button onClick={() => setActiveTab('dashboard')}>Dashboard</button>
        </nav>
      </header>

      <main>
        {activeTab === 'shortener' ? <Shortener /> : <Dashboard />}
      </main>
    </div>
  );
};

export default Index;