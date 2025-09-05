import React, { useRef, useEffect, useState } from 'react';
import './AlertRollInformation.less';

interface AlertMessageProps {
  messages: any[];
  speed?: number; // 每帧滚动像素数，可调
}

const AlertMessage: React.FC<AlertMessageProps> = ({ messages, speed = 0.4 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [startScroll, setStartScroll] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // 计算滚动高度
  useEffect(() => {
    const calculateScrollHeight = () => {
      if (containerRef.current && contentRef.current) {
        const containerHeight = containerRef.current.clientHeight;
        const contentHeight = contentRef.current.scrollHeight;

        if (contentHeight > containerHeight) {
          setScrollHeight(contentHeight - containerHeight);
          setStartScroll(true);
        } else {
          setScrollHeight(0);
          setStartScroll(false);
        }
      }
    };

    calculateScrollHeight();
    window.addEventListener('resize', calculateScrollHeight);
    return () => window.removeEventListener('resize', calculateScrollHeight);
  }, [messages]);

  // 鼠标悬停暂停
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  // 精确滚动控制
  useEffect(() => {
    if (!startScroll || !containerRef.current || !contentRef.current) return;

    let offset = 0;
    let rafId: number;

    const step = () => {
      if (!isPaused) {
        offset += speed;
        if (offset > scrollHeight) offset = 0;
        contentRef.current!.style.transform = `translateY(-${offset}px)`;
      }
      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [startScroll, isPaused, scrollHeight, speed]);

  return (
    <div
      className="alert-container"
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="alert-content" ref={contentRef}>
        {messages.map((message) => (
          <a
            key={message.id}
            href={`/alert-cur-events/${message.id}`}
            title={`${message.target_ident}: ${message.rule_name}`}
          >
            <div className="row">
              <div className="row-item" style={{ flex: 1, margin: '0 5px' }}>
                {message.target_ident}
              </div>
              <div className="row-item" style={{ flex: 1.5, margin: '0 5px 0 0' }}>
                {message.rule_name}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default AlertMessage;
