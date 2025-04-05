import React, { useState } from 'react';
import './CoinList.css';

interface TickerData {
  code: string;
  trade_price: number;
  change: 'RISE' | 'FALL' | 'EVEN';
  change_price: number;
  change_rate: number;
  acc_trade_price_24h: number;
}

interface CoinListProps {
  tickers: Map<string, TickerData>;
}

const CoinList: React.FC<CoinListProps> = ({ tickers }) => {
  const [sortConfig, setSortConfig] = useState({
    key: 'acc_trade_price_24h',
    direction: 'desc',
  });

  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === 'asc' ? 'desc' : 'asc',
        };
      } else {
        return { key, direction: 'desc' };
      }
    });
  };

  const sortedTickers = Array.from(tickers.values()).sort((a, b) => {
    const { key, direction } = sortConfig;
    const aValue = a[key as keyof TickerData];
    const bValue = b[key as keyof TickerData];

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return direction === 'asc' ? aValue - bValue : bValue - aValue;
    }
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return direction === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    return 0;
  });

  const renderArrow = (key: string) => {
    if (sortConfig.key !== key) return <span className="arrow">⇅</span>;
    return (
      <span className="arrow active">
        {sortConfig.direction === 'asc' ? '▲' : '▼'}
      </span>
    );
  };

  return (
    <div className="coin-list">
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('code')}>
              코인 {renderArrow('code')}
            </th>
            <th onClick={() => handleSort('trade_price')}>
              현재가 {renderArrow('trade_price')}
            </th>
            <th onClick={() => handleSort('change_price')}>
              전일대비 {renderArrow('change_price')}
            </th>
            <th onClick={() => handleSort('acc_trade_price_24h')}>
              거래대금 {renderArrow('acc_trade_price_24h')}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedTickers.map((ticker) => {
            const isRise = ticker.change === 'RISE';
            const isFall = ticker.change === 'FALL';

            return (
              <tr key={ticker.code}>
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
