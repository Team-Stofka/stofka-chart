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
  code: string; // 선택된 종목 코드
}

const ChartArea: React.FC<ChartAreaProps> = ({ code }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const [interval, setInterval] = useState('1s');

  // ✅ 초기 캔들 데이터를 요청하여 차트에 세팅하는 함수
  const fetchInitialCandles = async () => {
    try {
      const response = await fetch(`/candles?code=${code}&interval=${interval}&count=150`);
      const data = await response.json();

      const parsedData: CandlestickData[] = data.map((item: any) => {
        const time: UTCTimestamp = interval === '1s'
          ? Math.floor(item.id.timestamp / 1000) as UTCTimestamp
          : Math.floor(new Date(item.candleTime).getTime() / 1000) as UTCTimestamp;

        return {
          time,
          open: item.openingPrice,
          high: item.highPrice,
          low: item.lowPrice,
          close: item.tradePrice,
        };
      }).reverse();

      seriesRef.current?.setData(parsedData);
    } catch (error) {
      console.error('[ChartArea] 초기 캔들 요청 실패:', error);
    }
  };

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
      timeScale: {
        timeVisible: true,
        secondsVisible: interval === '1s',
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

    // ✅ 초기 캔들 로딩
    fetchInitialCandles();

    // ✅ Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      chart.applyOptions({
        width: chartContainerRef.current!.clientWidth,
      });
    });
    resizeObserver.observe(chartContainerRef.current!);

    // ✅ SSE 연결 (interval에 따라 endpoint 분기)
    const url = interval === '1s'
      ? `/stream/candle?code=${code}`
      : `/sse/connect?code=${code}`;

    const eventSource = new EventSource(url);

    eventSource.addEventListener('candle-data', (event) => {
      try {
        const { payload } = JSON.parse(event.data);

        if (payload.code !== code) return;
        if (interval !== '1s' && payload.type !== `candle.${interval}`) return;

        const ts = interval === '1s'
          ? Math.floor(payload.timestamp / 1000)
          : Math.floor(new Date(payload.timestamp).getTime() / 1000);

        const candle: CandlestickData = {
          time: ts as UTCTimestamp,
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
      <div ref={chartContainerRef} className="chart-container" />
    </div>
  );
};

export default ChartArea;
