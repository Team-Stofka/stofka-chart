import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import TickerInfo from './components/TickerInfo';
import ChartArea from './components/ChartArea';
import CoinList from './components/CoinLIst'; // 파일명 오타도 수정: CoinLIst → CoinList
import './App.css';

type TickerData = {
  code: string;
  trade_price: number;
  change: 'RISE' | 'FALL' | 'EVEN';
  change_price: number;
  change_rate: number;
  acc_trade_price_24h: number;
};

function App() {
  const [tickers, setTickers] = useState<Map<string, TickerData>>(new Map());

  useEffect(() => {
    const eventSource = new EventSource('http://localhost:8080/stream/ticker');

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setTickers((prev) => {
        const updated = new Map(prev);
        updated.set(data.code, data);
        return updated;
      });
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <section className="left-section">
          <TickerInfo />
          <ChartArea />
        </section>
        <aside className="right-section">
          <CoinList tickers={tickers} /> {/* ✅ 실시간 데이터 전달 */}
        </aside>
      </main>
    </div>
  );
}

export default App;
