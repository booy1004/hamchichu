import { useState } from 'react';
import HamsterGame from './games/hamster/HamsterGame';
import GuineaPigGame from './games/guinea/GuineaPigGame';
import './tab.css';

const TABS = [
  { id: 'hamster', label: '🐹 치즈먹방 애햄이', emoji: '🧀' },
  { id: 'guinea', label: '🐷 파프리카 사쿠야', emoji: '🫑' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('guinea');

  return (
    <div className="app-root">
      <nav className="tab-nav">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'tab-active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      <div className="tab-content">
        {activeTab === 'hamster' && <HamsterGame />}
        {activeTab === 'guinea' && <GuineaPigGame />}
      </div>
    </div>
  );
}
