import React, { useState } from 'react';
import './CoinList.css';
import { TickerData } from '../types'; // ✅ 불러오기

interface CoinListProps {
  tickers: Map<string, TickerData>;
  onSelect: (code: string) => void; // ✅ 클릭 시 알려줄 함수
  selectedCode: string; // ✅ 현재 선택된 종목
}

const CoinList: React.FC<CoinListProps> = ({ tickers, onSelect, selectedCode }) => {
  const [sortConfig, setSortConfig] = useState({
    key: 'acc_trade_price_24h',
    direction: 'desc',
  });

  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      } else {
        return { key, direction: 'desc' };
      }
    });
  };

  const sortedTickers = Array.from(tickers.values()).sort((a, b) => {
    const aValue = a[sortConfig.key as keyof TickerData];
    const bValue = b[sortConfig.key as keyof TickerData];
  
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
    }
    return 0;
  });
  

  const renderArrow = (key: string) => {
    if (sortConfig.key !== key) return <span className="arrow">⇅</span>;
    return <span className="arrow active">{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>;
  };

  return (
    <div className="coin-list">
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('code')}>코인 {renderArrow('code')}</th>
            <th onClick={() => handleSort('trade_price')}>현재가 {renderArrow('trade_price')}</th>
            <th onClick={() => handleSort('change_price')}>전일대비 {renderArrow('change_price')}</th>
            <th onClick={() => handleSort('acc_trade_price_24h')}>거래대금 {renderArrow('acc_trade_price_24h')}</th>
          </tr>
        </thead>
        <tbody>
          {sortedTickers.map((ticker) => {
            const isSelected = ticker.code === selectedCode;
            const isRise = ticker.change === 'RISE';
            const isFall = ticker.change === 'FALL';

            return (
              <tr
                key={ticker.code}
                onClick={() => onSelect(ticker.code)}
                className={isSelected ? 'selected' : ''}
              >
                <td>{ticker.code.replace('KRW-', '')}</td>
                <td className={isRise ? 'up' : isFall ? 'down' : ''}>
                  {ticker.trade_price.toLocaleString()}
                </td>
                <td className={isRise ? 'up' : isFall ? 'down' : ''}>
                  {(isRise ? '▲' : isFall ? '▼' : '')}{' '}
                  {ticker.change_price.toLocaleString()} (
                  {(ticker.change_rate * 100).toFixed(2)}%)
                </td>
                <td>{(ticker.acc_trade_price_24h / 1e8).toFixed(1)}억</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CoinList;
