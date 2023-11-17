import { SelectLang as UmiSelectLang } from '@umijs/max';
import React, { useState, useEffect } from 'react';
import {ArrowDownOutlined, ArrowUpOutlined} from "@ant-design/icons";

interface StockData {
  symbol: string;
  name: string;
  price: number;
  changesPercentage: number;
  change: number;
  dayLow: number;
  dayHigh: number;
  // ...其他属性
}
export const SelectLang = () => {
  return (
    <UmiSelectLang
      style={{
        padding: 4,
      }}
    />
  );
};
export const Question = () => {
  // const [stockData, setStockData] = useState<StockData[]>([]);
  // const [currentStockIndex, setCurrentStockIndex] = useState(0);
  //
  // useEffect(() => {
  //   // Fetch stock data from API
  //   const apiKey = '2a9c37bb4aad1a511375b76178556e1e';
  //   const apiUrl = 'https://financialmodelingprep.com/api/v3/quote/SPY,QQQ,DIA?apikey=' + apiKey;
  //
  //   fetch(apiUrl)
  //     .then(response => response.json())
  //     .then(data => setStockData(data))
  //     .catch(error => console.error('Error fetching stock data:', error));
  // }, []);
  //
  // const handleStockClick = () => {
  //   setCurrentStockIndex((currentStockIndex + 1) % stockData.length);
  // };
  //
  // if (stockData.length === 0) {
  //   return <div>Loading...</div>;
  // }
  //
  // const currentStock = stockData[currentStockIndex];
  // const isPositiveChange = currentStock.change > 0;
  // const changeColor = isPositiveChange ? 'green' : 'red';
  // const arrowIcon = isPositiveChange ? <ArrowUpOutlined /> : <ArrowDownOutlined />;
  //
  // return (
  //   <div
  //     style={{
  //       display: 'flex',
  //       height: 26,
  //       color: changeColor,
  //       alignItems: 'center',
  //       justifyContent: 'space-between',
  //     }}
  //     onClick={handleStockClick}
  //   >
  //     {/* Conditionally render based on screen width */}
  //     {window.innerWidth > 768 && (
  //       <>
  //         <div style={{ marginRight: 5 }}>{currentStock.symbol}</div>
  //         <div style={{ marginRight: 5 }}>{`${currentStock.price.toFixed(2)} `}</div>
  //         {/*<div style={{ marginRight: 5 }}>{`${currentStock.change.toFixed(2)} `}</div>*/}
  //         <div style={{ color: changeColor }}>{`${currentStock.changesPercentage.toFixed(2)}% `}</div>
  //         {arrowIcon}
  //       </>
  //     )}
  //   </div>
  // );
};
