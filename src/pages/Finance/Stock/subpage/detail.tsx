import React, { useEffect, useState } from 'react';
import { List, Avatar, Card, Col, Row } from 'antd';
import { useSearchParams } from 'react-router-dom';
import * as echarts from 'echarts';
import axios from 'axios';

interface StockData {
  symbol: '';
  name: '';
  price: 0;
  changesPercentage: 0;
  change: 0;
  dayLow: 0;
  dayHigh: 0;
  yearHigh: 0;
  yearLow: 0;
  marketCap: 0;
  priceAvg50: 0;
  priceAvg200: 0;
  exchange: '';
  volume: 0;
  avgVolume: 0;
  open: 0;
  previousClose: 0;
  eps: 0;
  pe: 0;
  earningsAnnouncement: '2022-11-08T13:30:00.000+0000';
  sharesOutstanding: 0;
  timestamp: 0;
}

function splitData(rawData: number[][]) {
  let categoryData = [];
  let values = [];
  let volumes = [];
  for (let i = 0; i < rawData.length; i++) {
    categoryData.push(rawData[i].splice(0, 1)[0]);
    values.push(rawData[i]);
    volumes.push([i, rawData[i][4], rawData[i][0] > rawData[i][1] ? 1 : -1]);
  }

  return {
    categoryData: categoryData,
    values: values,
    volumes: volumes,
  };
}

function calculateMA(dayCount: number, data: number[][]) {
  const result = [];
  for (let i = 0, len = data.length; i < len; i++) {
    if (i < dayCount) {
      result.push('-');
      continue;
    }
    let sum = 0;
    for (let j = 0; j < dayCount; j++) {
      sum += data[i - j][1];
    }
    result.push(+(sum / dayCount).toFixed(3));
  }
  return result;
}

const StockList: React.FC = () => {
  const [stockData, setStockData] = useState<any[]>([]);
  const [symbols, setSymbols] = useState<string>('AAPL');
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const searchParams = useSearchParams()[0] as URLSearchParams; // 明确指定类型
  const [apiError, setApiError] = useState<string | null>(null);
  const initialSymbolParam =
    searchParams.get('symbol') || localStorage.getItem('savedSymbol') || 'AAPL';

  useEffect(() => {
    setSymbols(initialSymbolParam);

    // 使用fetch进行API请求
    fetch(
      `https://financialmodelingprep.com/api/v3/quote/${symbols}?apikey=2ee60182d8454db2bcfa75ada7e1c478`,
    )
      .then((response) => response.json())
      .then((data) => {
        if (data['Error Message']) {
          setApiError(data['Error Message']);
        } else {
          // 从API响应中提取数据
          setStockData(data);
          // 保存 symbol 到 localStorage
          localStorage.setItem('savedSymbol', symbols);
        }
      })
      .catch((error) => {
        console.error('Error fetching stock data:', error);
      });

    // // Fetch historical stock price data
    // fetch(
    //   `https://financialmodelingprep.com/api/v3/historical-price-full/${symbols}?apikey=2ee60182d8454db2bcfa75ada7e1c478`,
    // )
    //   .then((response) => response.json())
    //   .then((data) => {
    //     setHistoricalData(data.historical || []);
    //   })
    //   .catch((error) => {
    //     console.error('Error fetching historical data:', error);
    //   });
  }, [symbols]); // 监听symbols变化

  // Create a ref to hold the ECharts instance
  const chartRef = React.useRef<any>();

  useEffect(() => {
    // 创建ECharts实例
    chartRef.current = echarts.init(document.getElementById('chart-container'));

    // 发起请求获取股价数据
    fetch(
      `https://financialmodelingprep.com/api/v3/historical-price-full/${symbols}?apikey=2ee60182d8454db2bcfa75ada7e1c478`,
    )
      .then((response) => response.json())
      .then((data) => {
        if (data['Error Message']) {
          setApiError(data['Error Message']);
        } else {
          // 数据处理
          const rawData = data.historical || [];
          rawData.reverse();
          const categoryData = [];
          const values = [];
          const volumes = [];

          for (let i = 0; i < rawData.length; i++) {
            categoryData.push(rawData[i].date);
            values.push([rawData[i].open, rawData[i].close, rawData[i].low, rawData[i].high]);
            volumes.push(rawData[i].volume);
          }

          // ECharts配置项
          const option = {
            title: {
              text: symbols,
              left: 'center', // 居中标题
              textStyle: {
                color: 'white', // 将文字颜色设置为纯白色
              },
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'cross',
              },
            },
            legend: {
              data: [symbols, 'MA5', 'MA10', 'MA20', 'MA30'],
              bottom: 10,
              left: 'center',
              textStyle: {
                color: 'white', // 设置图例文字颜色为纯白色
              },
            },
            grid: [
              {
                left: '10%',
                right: '8%',
                height: '50%',
              },
              {
                left: '10%',
                right: '8%',
                top: '63%',
                height: '16%',
              },
            ],
            xAxis: [
              {
                type: 'category',
                data: categoryData, // 翻转横坐标
                boundaryGap: false,
                axisLine: { onZero: false },
                splitLine: { show: false },
                min: 'dataMin',
                max: 'dataMax',
                axisLabel: {
                  textStyle: {
                    color: 'white', // 将y轴标签文字颜色设置为纯白色
                  },
                },
              },
              {
                type: 'category',
                gridIndex: 1,
                data: categoryData,
                boundaryGap: false,
                axisLine: { onZero: false },
                axisTick: { show: false },
                splitLine: { show: false },
                axisLabel: { show: false },
                min: 'dataMin',
                max: 'dataMax',
              },
            ],
            yAxis: [
              {
                scale: true,
                splitArea: {
                  show: true,
                },
                axisLabel: {
                  textStyle: {
                    color: 'white', // 将y轴标签文字颜色设置为纯白色
                  },
                },
              },

              {
                scale: true,
                gridIndex: 1,
                splitNumber: 2,
                axisLabel: { show: false },
                axisLine: { show: false },
                axisTick: { show: false },
                splitLine: { show: false },
              },
            ],
            dataZoom: [
              {
                type: 'inside',
                xAxisIndex: [0, 1],
                start: 98,
                end: 100,
              },
              {
                show: true,
                xAxisIndex: [0, 1],
                type: 'slider',
                top: '85%',
                start: 98,
                end: 100,
              },
            ],
            series: [
              {
                name: symbols,
                type: 'candlestick',
                data: values,
                itemStyle: {
                  color: '#00da3c', // 下跌颜色
                  color0: '#ec0000', // 上涨颜色
                  borderColor: undefined,
                  borderColor0: undefined,
                },
              },
              {
                name: 'MA5',
                type: 'line',
                data: calculateMA(5, values),
                smooth: true,
                lineStyle: {
                  opacity: 0.5,
                },
              },
              {
                name: 'MA10',
                type: 'line',
                data: calculateMA(10, values),
                smooth: true,
                lineStyle: {
                  opacity: 0.5,
                },
              },
              {
                name: 'MA20',
                type: 'line',
                data: calculateMA(20, values),
                smooth: true,
                lineStyle: {
                  opacity: 0.5,
                },
              },
              {
                name: 'MA30',
                type: 'line',
                data: calculateMA(30, values),
                smooth: true,
                lineStyle: {
                  opacity: 0.5,
                },
              },
              {
                name: 'Volume',
                type: 'bar',
                xAxisIndex: 1,
                yAxisIndex: 1,
                data: volumes,
                label: {
                  normal: {
                    textStyle: {
                      color: 'white', // 将系列标签文字颜色设置为纯白色
                    },
                  },
                },
              },
            ],
          };

          // 设置图表配置
          chartRef.current.setOption(option);

          // 清理图表
          return () => {
            chartRef.current.dispose();
          };
        }
      })
      .catch((error) => {
        console.error('Error fetching historical data:', error);
      });
  }, [symbols]); // 监听symbols变化

  return (
    <div>
      {/* 卡片 1：股票数据 */}
      <Card title="Stock Data">
        {apiError ? (
          <div>{apiError}</div>
        ) : (
          stockData.map((item) => {
            const stockItem = item as StockData; // 将 item 断言为 StockData 类型
            // 检查 earningsAnnouncement 是否为 null，如果是 null，则使用默认值
            if (stockItem.earningsAnnouncement === null) {
              // @ts-ignore
              stockItem.earningsAnnouncement = '2000-01-01T00:00:00.000+0000';
            }
            return (
              <div key={stockItem.symbol}>
                <Row gutter={[16, 16]} key={stockItem.symbol}>
                  <Col span={5}>
                    <strong>Name</strong>: {stockItem.name}
                  </Col>
                  <Col span={5}>
                    <strong>Price</strong>: ${stockItem.price}
                  </Col>
                  <Col span={5}>
                    <strong>Changes (%)</strong>: {stockItem.changesPercentage}%
                  </Col>
                  <Col span={5}>
                    <strong>Change</strong>: {stockItem.change}
                  </Col>
                  <Col span={4}>
                    <strong>Open</strong>: {stockItem.open}
                  </Col>
                </Row>
                <Row gutter={[16, 16]}>
                  <Col span={5}>
                    <strong>Day Low</strong>: {stockItem.dayLow}
                  </Col>
                  <Col span={5}>
                    <strong>Day High</strong>: {stockItem.dayHigh}
                  </Col>
                  <Col span={5}>
                    <strong>Year High</strong>: {stockItem.yearHigh}
                  </Col>
                  <Col span={5}>
                    <strong>Year Low</strong>: {stockItem.yearLow}
                  </Col>
                  <Col span={4}>
                    <strong>Market Cap</strong>: {stockItem.marketCap}
                  </Col>
                </Row>
                <Row gutter={[16, 16]}>
                  <Col span={5}>
                    <strong>50-Day Avg</strong>: {stockItem.priceAvg50}
                  </Col>
                  <Col span={5}>
                    <strong>200-Day Avg</strong>: {stockItem.priceAvg200}
                  </Col>
                  <Col span={5}>
                    <strong>Exchange</strong>: {stockItem.exchange}
                  </Col>
                  <Col span={5}>
                    <strong>Volume</strong>: {stockItem.volume}
                  </Col>
                  <Col span={4}>
                    <strong>Avg Volume</strong>: {stockItem.avgVolume}
                  </Col>
                </Row>
                <Row gutter={[16, 16]}>
                  <Col span={5}>
                    <strong>Previous Close</strong>: {stockItem.previousClose}
                  </Col>
                  <Col span={5}>
                    <strong>EPS</strong>: {stockItem.eps}
                  </Col>
                  <Col span={5}>
                    <strong>Earnings Announcement</strong>:{' '}
                    {stockItem.earningsAnnouncement.split('T')[0]}
                  </Col>
                  <Col span={5}>
                    <strong>Shares Outstanding</strong>: {stockItem.sharesOutstanding}
                  </Col>
                  <Col span={4}>
                    <strong>Timestamp</strong>: {stockItem.timestamp}
                  </Col>
                </Row>
              </div>
            );
          })
        )}
      </Card>
      {/* 卡片 2：ECharts图表 */}
      {!apiError && (
        <div>
          <Card>
            <div
              id="chart-container"
              style={{ height: '800px', width: '100%', marginLeft: '-6%' }}
            />
          </Card>
        </div>
      )}
    </div>
  );
};

export default StockList;
