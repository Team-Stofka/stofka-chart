import React, { useEffect, useRef } from 'react';
import {
    createChart,
    IChartApi,
    ISeriesApi,
    UTCTimestamp,
    CandlestickData,
  } from 'lightweight-charts';
  
import ResizeObserver from 'resize-observer-polyfill';
import './ChartArea.css';

interface ChartAreaProps {
  code: string; // 선택된 종목 전달
}

const ChartArea: React.FC<ChartAreaProps> = ({ code }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // 새 차트 생성

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
        timeScale: {
          timeVisible: true,
          secondsVisible: true,
        },
      });
    chartRef.current = chart;

    const candlestickSeries = chart.addCandlestickSeries({
        upColor: '#e53935',
        downColor: '#2196f3',
        wickUpColor: '#e53935',
        wickDownColor: '#2196f3',
        borderVisible: false,
      });

    seriesRef.current = candlestickSeries;

    const resizeObserver = new ResizeObserver(() => {
      chart.applyOptions({
        width: chartContainerRef.current!.clientWidth,
      });
    });

    resizeObserver.observe(chartContainerRef.current!);

    // ✅ 선택한 종목 기반 SSE 연결
    const eventSource = new EventSource(`/stream/candle?code=${code}`);

    eventSource.addEventListener("candle-data", (event) => {
      try {
        const { payload } = JSON.parse(event.data);
  
        if (payload.code !== code) return;
  
        const candle: CandlestickData = {
          time: Math.floor(payload.timestamp / 1000) + 9 * 60 * 60 as UTCTimestamp,
          open: payload.opening_price,
          high: payload.high_price,
          low: payload.low_price,
          close: payload.trade_price,
        };
  
        seriesRef.current?.update(candle);
      } catch (err) {
        console.error('[ChartArea] SSE candle-data 파싱 에러:', err);
      }
    });
  
    eventSource.onerror = (err) => {
      console.error('[ChartArea] SSE 연결 오류:', err);
    };
  
    return () => {
      chart.remove();
      eventSource.close();
      resizeObserver.disconnect();
    };
  }, [code]);

  return <div ref={chartContainerRef} className="chart-container" />;
};

export default ChartArea;
