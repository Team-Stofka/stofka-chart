import React, { useEffect, useRef } from 'react';
import { createChart, UTCTimestamp, CandlestickSeries } from 'lightweight-charts';
import ResizeObserver from 'resize-observer-polyfill';
import './ChartArea.css';

const ChartArea: React.FC = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        background: { color: '#ffffff' },
        textColor: '#222222',
      },
      grid: {
        vertLines: { color: '#eeeeee' },
        horzLines: { color: '#eeeeee' },
      },
      crosshair: { mode: 0 },
      timeScale: { timeVisible: true, secondsVisible: true },
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#e53935',
      downColor: '#2196f3',
      wickUpColor: '#e53935',
      wickDownColor: '#2196f3',
      borderVisible: false,
    });

    const now = Math.floor(Date.now() / 1000) as UTCTimestamp;
    const mockData = Array.from({ length: 30 }).map((_, i) => {
      const time = (now - (30 - i) * 60) as UTCTimestamp;
      const open = 10000 + Math.random() * 100;
      const close = open + (Math.random() - 0.5) * 50;
      const high = Math.max(open, close) + Math.random() * 20;
      const low = Math.min(open, close) - Math.random() * 20;
      return { time, open, high, low, close };
    });

    candlestickSeries.setData(mockData);

    // ✅ 사이즈 반응형 적용
    const resizeObserver = new ResizeObserver(() => {
      chart.applyOptions({
        width: chartContainerRef.current!.clientWidth,
      });
    });
    resizeObserver.observe(chartContainerRef.current!);

    return () => {
      chart.remove();
      resizeObserver.disconnect();
    };
  }, []);

  return <div ref={chartContainerRef} className="chart-container" />;
};

export default ChartArea;
