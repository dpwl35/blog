'use client';

import Scroll01 from './scroll_01';
import './style.scss';
import { useState } from 'react';

const tabs = ['01 Scroll Animation', '02 Scroll Animation'];

export default function Page() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className='tab'>
      <ul className='tab-list'>
        {tabs.map((tab, index) => (
          <li
            key={index}
            className={`tab-item ${activeTab === index ? 'active' : ''}`}
            onClick={() => setActiveTab(index)}
          >
            {tab}
          </li>
        ))}
      </ul>
      <div className='tab-content'>
        {activeTab === 0 && <Scroll01 />}
        {activeTab === 1 && <p>2</p>}
      </div>
    </div>
  );
}
