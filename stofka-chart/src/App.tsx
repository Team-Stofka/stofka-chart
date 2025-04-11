import { useEffect, useState } from 'react';
import Header from './components/Header';
import TickerInfo from './components/TickerInfo';
import ChartArea from './components/ChartArea';
import CoinList from './components/CoinList';
import { TickerData } from './types';
import './App.css';

function App() {
  const [tickers, setTickers] = useState<Map<string, TickerData>>(new Map());
  const [selectedCoin, setSelectedCoin] = useState('KRW-BTC'); // ✅ 선택된 종목 상태

  useEffect(() => {
    const eventSource = new EventSource(`stofka.naver.com:32242/stream/ticker`);
  
    eventSource.addEventListener("ticker-data", (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("[SSE] 수신된 ticker 데이터:", data); // ✅ 로그 찍힘 확인
  
        setTickers((prev) => {
          const updated = new Map(prev);
          updated.set(data.code, data);
          return updated;
        });
      } catch (err) {
        console.error("[SSE] 파싱 에러:", err);
      }
    });
  
    eventSource.onerror = (err) => {
      console.error("[SSE] 연결 오류:", err);
    };
  
    return () => {
      eventSource.close();
      console.log("[SSE] 연결 종료");
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
