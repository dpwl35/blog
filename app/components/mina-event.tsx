"use client";

import { useState, useEffect } from "react";

export default function MainEvent() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const date = now.toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  const time = now
    .toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .replace("오전 ", "")
    .replace("오후 ", "");

  return (
    <div className="main-flip">
      <div className="main-flip-item newspaper">
        <img src="/images/main/newspaper.png" alt="newspaper" />
      </div>
      <div className="main-flip-item pen">
        <img src="/images/main/pen.png" alt="pen" />
      </div>
      <div className="main-flip-item diary">
        <img src="/images/main/diary.png" alt="diary" />
      </div>
      <div className="main-flip-item phone">
        <div>
          <div className="phone-area">
            <div className="phone-area-view">
              <div className="phone-area-time">
                <span>{date}</span>
                <span>{time}</span>
              </div>
              <ul className="phone-area-todo">
                <li>
                  <label>
                    <input type="checkbox" />
                    <span>트렌드 리서치</span>
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" />
                    <span>레퍼런스 수집</span>
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" defaultChecked />
                    <span>블로그 포스트 작성</span>
                  </label>
                </li>
              </ul>
            </div>
          </div>
          <img src="/images/main/phone.png" alt="phone" />
        </div>
      </div>
    </div>
  );
}
