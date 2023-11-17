import React, { useEffect, useState } from 'react';
import { Card, List, Typography, Row, Col, Tag, Input } from 'antd';
import axios from 'axios';

const { Title, Text } = Typography;
const { Search } = Input;

// 创建一个接口来描述API返回的数据结构
interface NewsItem {
  title: string;
  url: string;
  banner_image: string;
  summary: string;
  time_published: string;
  source: string;
  topics: { topic: string; relevance_score: string }[];
  overall_sentiment_score: number;
  overall_sentiment_label: string;
}

const StockNewsList = () => {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('IBM');
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewsData = async () => {
      // 获取当前日期
      const currentDate = new Date();

      // 计算一年前的日期
      const oneYearAgo = new Date();
      oneYearAgo.setDate(currentDate.getDate() - 365);

      // 格式化日期为 "yyyyMMddTHHmm" 格式
      const formattedDate = `${oneYearAgo.getFullYear()}${(oneYearAgo.getMonth() + 1)
        .toString()
        .padStart(2, '0')}${oneYearAgo.getDate().toString().padStart(2, '0')}T${oneYearAgo
        .getHours()
        .toString()
        .padStart(2, '0')}${oneYearAgo.getMinutes().toString().padStart(2, '0')}`;

      try {
        const response = await axios.get(
          `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${searchTerm}&time_from=${formattedDate}&limit=50&apikey=ZCCZUPQ6BPWGDQL8`,
        );
        const responseData = response.data;

        // 检查是否包含错误消息
        if (responseData.Information) {
          setApiError(responseData.Information);
          setNewsList([]); // 清空新闻列表
        } else {
          setApiError(null); // 重置错误消息
          const data = responseData.feed;
          setNewsList(data);
        }
      } catch (error) {
        console.error('Error fetching data: ', error);
        setApiError('An error occurred while fetching data.'); // 设置通用错误消息
      }
    };

    fetchNewsData();
  }, [searchTerm]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={2}>股票新闻列表</Title>
          <Text type="secondary">
            Topics: {newsList[0]?.topics.map((topic) => topic.topic).join(', ')}
          </Text>
        </div>
        <div>
          <Title level={2}>{searchTerm.toUpperCase()}</Title>
        </div>
        <div>
          <Search
            placeholder="输入搜索词"
            onSearch={(value) => setSearchTerm(value)}
            style={{ width: 200 }}
          />
        </div>
      </div>

      {/* 显示错误消息 */}
      {apiError && (
        <div>
          <p>{apiError}</p>
        </div>
      )}

      {/* 显示股票新闻列表 */}
      {!apiError && (
        <List
          dataSource={newsList}
          renderItem={(item) => (
            <List.Item>
              <Card style={{ width: '100%' }}>
                <Row gutter={16}>
                  <Col span={8}>
                    <img
                      src={item.banner_image}
                      alt={item.title}
                      style={{ width: '100%', height: 'auto' }}
                    />
                  </Col>
                  <Col span={16}>
                    <h3>{item.title}</h3>
                    <p>{item.summary}</p>
                    <div>
                      <Text type="secondary">Time Published: {item.time_published}</Text>
                    </div>
                    <div>
                      <Text type="secondary">Source: {item.source}</Text>
                    </div>
                    <div>
                      <Text type="secondary">
                        Topics:{' '}
                        {item.topics.slice(0, 3).map((topic) => (
                          <Tag key={topic.topic} color="blue">
                            {topic.topic}
                          </Tag>
                        ))}
                      </Text>
                    </div>
                    <div>
                      <Text type="secondary">
                        Overall Sentiment Score: <b>{item.overall_sentiment_score}</b>
                      </Text>
                    </div>
                    <div>
                      <Text type="secondary">
                        Overall Sentiment Label: <b>{item.overall_sentiment_label}</b>
                      </Text>
                    </div>
                    <br />
                    <a href={item.url}>查看详情</a>
                  </Col>
                </Row>
              </Card>
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default StockNewsList;
