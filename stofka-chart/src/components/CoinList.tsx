import React from 'react';
import './CoinList.css';

interface Coin {
  name: string;
  symbol: string;
  price: number;
  change: number; // + or -
  volume: string;
}

const coins: Coin[] = [
  { name: '비트코인', symbol: 'BTC/KRW', price: 123653000, change: -0.2, volume: '271,771백만' },
  { name: '이더리움', symbol: 'ETH/KRW', price: 2673000, change: +0.1, volume: '102,579백만' },
  { name: '리플', symbol: 'XRP/KRW', price: 3125, change: +0.6, volume: '582,375백만' },
  { name: '솔라나', symbol: 'SOL/KRW', price: 178200, change: -1.3, volume: '107,539백만' },
  { name: '테더', symbol: 'USDT/KRW', price: 1474.5, change: 0, volume: '116,686백만' },
];

const CoinList: React.FC = () => {
  return (
    <div className="coin-list">
      <h3>코인 시세</h3>
      <table>
        <thead>
          <tr>
            <th>이름</th>
            <th>현재가</th>
            <th>등락률</th>
            <th>거래대금</th>
          </tr>
        </thead>
        <tbody>
          {coins.map((coin, index) => (
            <tr key={index}>
              <td>{coin.name} <span className="symbol">{coin.symbol}</span></td>
              <td>{coin.price.toLocaleString()}</td>
              <td className={coin.change > 0 ? 'up' : coin.change < 0 ? 'down' : ''}>
                {coin.change > 0 && '▲ '}
                {coin.change < 0 && '▼ '}
                {Math.abs(coin.change).toFixed(2)}%
              </td>
              <td>{coin.volume}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CoinList;
