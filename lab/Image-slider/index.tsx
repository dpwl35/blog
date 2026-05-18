"use client";

import Slider01 from "./slider_01";
import "./style.scss";
import { useState } from "react";

const tabs = ["Slider 01", "Slider 02", "Slider 03"];

export default function Page() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="tab">
      <ul className="tab-list">
        {tabs.map((tab, index) => (
          <li
            key={index}
            className={`tab-item ${activeTab === index ? "active" : ""}`}
            onClick={() => setActiveTab(index)}
          >
            {tab}
          </li>
        ))}
      </ul>
      <div className="tab-content">
        {activeTab === 0 && <Slider01 />}
        {activeTab === 1 && <div>Tab 2 내용</div>}
        {activeTab === 2 && <div>Tab 3 내용</div>}
      </div>
    </div>
  );
}
