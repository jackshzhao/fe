import React, { useRef, useEffect, useState } from 'react';
import { getEvents } from '@/services/application'; 
import {formatYearTimesHour,} from './utils';
import './AlertRollInformation.less';

interface AlertMessageProps {
  messages:any[];
}

const AlertMessage: React.FC<AlertMessageProps> = ({ messages }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [startScroll, setStartScroll] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const calculateScrollHeight = () => {
    
      if (contentRef.current && containerRef.current) {
        const containerHeight = containerRef.current.clientHeight;
        const contentHeight = contentRef.current.scrollHeight;

        if (contentHeight > containerHeight) {
          setScrollHeight(contentHeight - containerHeight);
          setStartScroll(true); // 启动滚动
        } else {
          setScrollHeight(0);
          setStartScroll(false); // 停止滚动
        }
      }
    };

    calculateScrollHeight();
    window.addEventListener('resize', calculateScrollHeight);

    return () => {
      window.removeEventListener('resize', calculateScrollHeight);
    };
  }, [messages]);

  const handleMouseEnter = () => {
    setIsPaused(true); // 鼠标移入时停止滚动
  };

  const handleMouseLeave = () => {
    setIsPaused(false); // 鼠标移出时继续滚动
  };

  return (
    <div className="alert-container" ref={containerRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div
        className={`alert-content ${startScroll && !isPaused ? 'scrolling' : ''}`}
        ref={contentRef}
        style={{ '--scroll-height': `${scrollHeight}px` } as React.CSSProperties}
      >
        {messages.map((message, index) => (
          <a href={`/alert-cur-events/${message.id}`}>
            <div key={index} className="row" title={`${message.target_ident}: ${message.rule_name}`}>
            <div
              className="row-item"
              style={{
                flex: '1',
                margin: '0px 5px 0px 5px',
              }}
              //title={message.target_ident} // tooltip 显示完整信息
            >
              {message.target_ident}
            </div>

            <div
              className="row-item"
              style={{
                flex: '1.5',
                margin: '0px 5px 0px 0px',
              }}
              
            >
              {message.rule_name}
            </div>
              {/* <div style={{flex:'1',textAlign:'center',}}>{item.trigger_time}</div>      */}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default AlertMessage;
