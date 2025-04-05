// src/components/TickerInfo.tsx
import React from 'react';
import './TickerInfo.css';

const TickerInfo: React.FC = () => {
  return (
    <div className="ticker-info">
      <div className="ticker-left">
        <h2>비트코인 <span className="ticker-symbol">BTC/KRW</span></h2>
        <div className="price">123,653,000<span className="unit">KRW</span></div>
        <div className="change up">+0.20% ▲ 244,000</div>
      </div>

      <div className="ticker-right">
        <div className="ticker-detail">
          <span>고가</span>
          <strong>123,988,000</strong>
        </div>
        <div className="ticker-detail">
          <span>저가</span>
          <strong>122,912,000</strong>
        </div>
        <div className="ticker-detail">
          <span>거래량(24H)</span>
          <strong>2,212.559 BTC</strong>
        </div>
        <div className="ticker-detail">
          <span>거래대금(24H)</span>
          <strong>271,770,512,858 KRW</strong>
        </div>
      </div>
    </div>
  );
};

export default TickerInfo;
