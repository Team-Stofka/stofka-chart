import React from 'react';
import './TickerInfo.css';
import { TickerData } from '../types';

interface Props {
  ticker?: TickerData;
  code: string;
}

const TickerInfo: React.FC<Props> = ({ ticker, code }) => {
  if (!ticker) return <div className="ticker-info">로딩 중...</div>;

  const isRise = ticker.change === 'RISE';
  const isFall = ticker.change === 'FALL';
  const priceClass = isRise ? 'up' : isFall ? 'down' : '';
  const arrow = isRise ? '▲' : isFall ? '▼' : '-';

  return (
    <div className="ticker-info">
      {/* 종목명 + 코드 */}
      <div className="coin-name">
        <span className="symbol">{code.replace('KRW-', '')}</span>
        <span className="code">{code}</span>
      </div>

      {/* 현재가 */}
      <div className="price-section">
        <div className={`trade-price ${priceClass}`}>
          {ticker.trade_price.toLocaleString()} <span className="currency">KRW</span>
        </div>
        <div className={`change ${priceClass}`}>
          {`${(ticker.change_rate * 100).toFixed(2)}%`} {arrow} {ticker.change_price.toLocaleString()}
        </div>
      </div>

      <div className="details-section">
        <div className="detail">
          <span className="label">고가</span>
          <span className="value up">{ticker.high_price.toLocaleString()}</span>
        </div>
        <div className="detail">
          <span className="label">저가</span>
          <span className="value down">{ticker.low_price.toLocaleString()}</span>
        </div>
        <div className="detail">
          <span className="label">거래량(24H)</span>
          <span className="value">{ticker.acc_trade_volume_24h.toFixed(3)} BTC</span>
        </div>
        <div className="detail">
          <span className="label">거래대금(24H)</span>
          <span className="value">{ticker.acc_trade_price_24h.toLocaleString()} KRW</span>
        </div>
      </div>
    </div>
  );
};

export default TickerInfo;
