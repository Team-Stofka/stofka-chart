import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import TickerInfo from './components/TickerInfo';
import ChartArea from './components/ChartArea';
import CoinList from './components/CoinLIst';
import { TickerData } from './types';
import './App.css';

function App() {
  const [tickers, setTickers] = useState<Map<string, TickerData>>(new Map());
  const [selectedCoin, setSelectedCoin] = useState('KRW-BTC'); // ✅ 선택된 종목 상태

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
          {/* ✅ selectedCoin에 해당하는 ticker만 전달 */}
          <TickerInfo ticker={tickers.get(selectedCoin)} code={selectedCoin} />
          <ChartArea code={selectedCoin} />
        </section>
        <aside className="right-section">
          <CoinList
            tickers={tickers}
            onSelect={setSelectedCoin}
            selectedCode={selectedCoin}
          />
        </aside>
      </main>
    </div>
  );
}

export default App;
