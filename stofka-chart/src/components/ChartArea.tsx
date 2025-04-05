import React, { useEffect, useRef } from 'react';
import {
  createChart,
  UTCTimestamp,
  CandlestickSeries,
  IChartApi,
  ISeriesApi,
} from 'lightweight-charts';
import ResizeObserver from 'resize-observer-polyfill';
import './ChartArea.css';

const ChartArea: React.FC = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  // ✅ 명시적으로 타입 지정
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

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

    chartRef.current = chart;

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#e53935',
      downColor: '#2196f3',
      wickUpColor: '#e53935',
      wickDownColor: '#2196f3',
      borderVisible: false,
    });

    seriesRef.current = candlestickSeries;

    // ✅ 반응형 리사이징
    const resizeObserver = new ResizeObserver(() => {
      chart.applyOptions({
        width: chartContainerRef.current!.clientWidth,
      });
    });
    resizeObserver.observe(chartContainerRef.current!);

    // ✅ SSE 연결
    const eventSource = new EventSource('http://localhost:8080/stream/candle');

    eventSource.onmessage = (event) => {
      try {
        const { payload } = JSON.parse(event.data);

        const candle = {
          time: Math.floor(payload.timestamp / 1000) as UTCTimestamp,
          open: payload.opening_price,
          high: payload.high_price,
          low: payload.low_price,
          close: payload.trade_price,
        };

        seriesRef.current?.update(candle);
      } catch (err) {
        console.error('Invalid SSE data:', err);
      }
    };

    return () => {
      chart.remove();
      eventSource.close();
      resizeObserver.disconnect();
    };
  }, []);

  return <div ref={chartContainerRef} className="chart-container" />;
};

export default ChartArea;
