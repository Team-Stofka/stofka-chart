import React from 'react';
import Header from './components/Header';
import TickerInfo from './components/TickerInfo';
import ChartArea from './components/ChartArea';
import CoinList from './components/CoinLIst';
import './App.css'

function App() {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <section className="left-section">
          <TickerInfo />
          <ChartArea />
        </section>
        <aside className="right-section">
          <CoinList />
        </aside>
      </main>
    </div>
  );
}

export default App;

