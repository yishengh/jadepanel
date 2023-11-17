import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { request, useIntl } from '@@/exports';
import { Stock, StockPagination } from '../stock';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import {
  CheckCircleOutlined,
  FieldNumberOutlined,
  StockOutlined,
  ToolOutlined,
  AppstoreAddOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Button, Input, Space } from 'antd';

const TableList: React.FC = () => {
  const intl = useIntl();
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<Stock>();
  const [data, setData] = useState<Stock[]>([]);
  const [stockSymbol, setStockSymbol] = useState<string | undefined>(undefined);
  const [filterSymbol, setFilterSymbol] = useState<string | undefined>(undefined);

  async function selectStocks(
    params: StockPagination,
    options?: { [key: string]: any },
  ): Promise<Stock[]> {
    const response = await request<Stock[]>(
      'https://financialmodelingprep.com/api/v3/stock-screener?limit=10000000&country=US&apikey=2ee60182d8454db2bcfa75ada7e1c478',
      {
        method: 'GET',
        params: {
          ...params,
        },
        ...(options || {}),
      },
    );

    // 添加每个项目的唯一键
    const dataWithKeys = response.map((item) => ({
      ...item,
      key: item.symbol,
    }));

    setData(dataWithKeys);
    return dataWithKeys;
  }

  const columns: ProColumns<Stock>[] = [
    {
      title: (
        <>
          <StockOutlined /> symbol
        </>
      ),
      dataIndex: 'symbol',
      valueType: 'text',
      search: false,
      filters: true,
      onFilter: (value, record) => {
        return record.symbol.toLowerCase().includes(value.toString().toLowerCase());
      },
      filterDropdown: () => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="关键词"
            value={filterSymbol}
            onChange={(e) => setFilterSymbol(e.target.value)}
            onPressEnter={() => {
              actionRef.current?.reload();
            }}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => {
                actionRef.current?.reload();
              }}
            >
              确定
            </Button>
            <Button
              onClick={() => {
                setFilterSymbol(undefined); // Reset the filter
                actionRef.current?.reload();
              }}
            >
              重置
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      filteredValue: filterSymbol ? [filterSymbol] : undefined,
      render: (text, record) => <Link to={`/stock/detail?symbol=${record.symbol}`}>{text}</Link>,
    },
    {
      title: (
        <>
          <FieldNumberOutlined /> price
        </>
      ),
      dataIndex: 'price',
      valueType: 'digit',
      hideInSearch: true,
    },
    {
      title: (
        <>
          <FieldNumberOutlined /> volume
        </>
      ),
      dataIndex: 'volume',
      valueType: 'digit',
      hideInSearch: true,
      sorter: (a, b) => a.volume - b.volume,
      defaultSortOrder: 'descend',
    },
    {
      title: (
        <>
          <AppstoreAddOutlined /> beta
        </>
      ),
      dataIndex: 'beta',
      valueType: 'digit',
      hideInSearch: true,
    },
    {
      title: (
        <>
          <CheckCircleOutlined /> lastAnnualDividend
        </>
      ),
      dataIndex: 'lastAnnualDividend',
      valueType: 'digit',
      hideInSearch: true,
    },
    {
      title: (
        <>
          <ToolOutlined /> sector
        </>
      ),
      dataIndex: 'sector',
      valueType: 'select',
      valueEnum: {
        'Consumer Cyclical,Energy,Technology,Industrials,Financial Services,Basic Materials,Communication Services,Consumer Defensive,Healthcare,Real Estate,Utilities,Industrial Goods,Financial,Services,Conglomerates':
          { text: 'All' },
        'Consumer Cyclical': { text: 'Consumer Cyclical' },
        Energy: { text: 'Energy' },
        Technology: { text: 'Technology' },
        Industrials: { text: 'Industrials' },
        'Financial Services': { text: 'Financial Services' },
        'Basic Materials': { text: 'Basic Materials' },
        'Communication Services': { text: 'Communication Services' },
        'Consumer Defensive': { text: 'Consumer Defensive' },
        Healthcare: { text: 'Healthcare' },
        'Real Estate': { text: 'Real Estate' },
        Utilities: { text: 'Utilities' },
        'Industrial Goods': { text: 'Industrial Goods' },
        Financial: { text: 'Financial' },
        Services: { text: 'Services' },
        Conglomerates: { text: 'Conglomerates' },
      },
      hideInSearch: false,
    },
    {
      title: (
        <>
          <ToolOutlined /> industry
        </>
      ),
      dataIndex: 'industry',
      valueType: 'select',
      valueEnum: {
        Autos: { text: 'Autos' },
        Banks: { text: 'Banks' },
        'Banks Diversified': { text: 'Banks Diversified' },
        Software: { text: 'Software' },
        'Banks Regional': { text: 'Banks Regional' },
        'Beverages Alcoholic': { text: 'Beverages Alcoholic' },
        'Beverages Brewers': { text: 'Beverages Brewers' },
        'Beverages Non-Alcoholic': { text: 'Beverages Non-Alcoholic' },
        // Add more industries as needed
      },
      hideInSearch: false,
    },
  ];

  return (
    <PageContainer>
      <ProTable<Stock, StockPagination>
        headerTitle={intl.formatMessage({
          id: 'pages.Stock.subPage.tableName',
          defaultMessage: '表格唯一Key',
        })}
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        request={selectStocks}
        dataSource={data}
        columns={columns}
        onReset={() => {
          actionRef.current?.reload();
        }}
      />
    </PageContainer>
  );
};

export default TableList;
