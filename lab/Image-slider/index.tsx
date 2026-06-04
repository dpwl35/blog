'use client';

import Slider01 from './slider_01';
import Slider02 from './slider_02';
import Slider03 from './slider_03';
import './style.scss';
import { useState } from 'react';

const tabs = [
  '01 Scroll Distortion Slider',
  '02 Scroll & Hover Distortion',
  '03 Ripple Click Slider',
];

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
        {activeTab === 0 && <Slider01 />}
        {activeTab === 1 && <Slider02 />}
        {activeTab === 2 && <Slider03 />}
      </div>
    </div>
  );
}
