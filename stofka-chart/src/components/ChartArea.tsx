import React, { useEffect, useRef, useState } from 'react';
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
  code: string; // 선택된 종목 코드 전달
}

const ChartArea: React.FC<ChartAreaProps> = ({ code }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null); // 차트 DOM 참조
  const chartRef = useRef<IChartApi | null>(null); // 차트 인스턴스 참조
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null); // 캔들 시리즈 참조
  const [interval, setInterval] = useState('1s'); // 선택된 봉 간격 상태

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // 1. 차트 생성
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

    // 2. 캔들 시리즈 추가
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#e53935',
      downColor: '#2196f3',
      wickUpColor: '#e53935',
      wickDownColor: '#2196f3',
      borderVisible: false,
    });

    seriesRef.current = candlestickSeries;

    // 3. 리사이즈 감지하여 차트 크기 조정
    const resizeObserver = new ResizeObserver(() => {
      chart.applyOptions({
        width: chartContainerRef.current!.clientWidth,
      });
    });

    resizeObserver.observe(chartContainerRef.current!);

    // 4. interval에 따라 적절한 SSE 연결
    const url = interval === '1s'
      ? `/stream/candle?code=${code}`
      : `/sse/connect?code=${code}`;

    const eventSource = new EventSource(url);

    eventSource.addEventListener('candle-data', (event) => {
      try {
        const { payload } = JSON.parse(event.data);

        if (payload.code !== code) return;

        // interval이 1s가 아닌 경우, type 체크 (예: candle.1m, candle.3m ...)
        if (interval !== '1s' && payload.type !== `candle.${interval}`) return;

        const ts = Math.floor(new Date(payload.timestamp).getTime() / 1000) as UTCTimestamp;
        const candle: CandlestickData = {
          time: ts,
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
  }, [code, interval]);

  return (
    <div>
      {/* 봉 간격 선택 드롭다운 */}
      <div className="interval-select">
        <select value={interval} onChange={(e) => setInterval(e.target.value)}>
          <option value="1s">초</option>
          <option value="1m">1분</option>
          <option value="3m">3분</option>
          <option value="5m">5분</option>
          <option value="10m">10분</option>
          <option value="15m">15분</option>
          <option value="30m">30분</option>
          <option value="1h">1시간</option>
          <option value="4h">4시간</option>
          <option value="1d">1일</option>
        </select>
      </div>

      {/* 차트 컨테이너 */}
      <div ref={chartContainerRef} className="chart-container" />
    </div>
  );
};

export default ChartArea;
