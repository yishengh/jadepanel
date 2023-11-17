import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Typography } from 'antd';
import * as echarts from 'echarts';
import { getAssetsCollection } from '@/pages/Equity/Assets/service';
import {
  AccountBookOutlined,
  BankOutlined,
  DollarOutlined,
  LineChartOutlined,
  MoneyCollectOutlined,
  PieChartOutlined,
  PoundCircleOutlined,
  StarOutlined,
  UserOutlined,
} from '@ant-design/icons';

const { Title } = Typography;

const Assets: React.FC = () => {
  const [data, setData] = useState<any>({
    loanSituation: [],
    totalMortgage: 0,
    assetRatio: [],
    monthCost: 0,
    totalRealizableValue: 0,
    totalCost: 0,
  });

  useEffect(() => {
    // 模拟获取数据
    const fetchData = async () => {
      try {
        const response = await getAssetsCollection(); // 调用服务获取数据
        setData(response);
        console.log(response);

        // 使用ECharts绘制饼状图
        if (response.loanSituation.length > 0 && response.assetRatio.length > 0) {
          const chartElement = document.getElementById('loanSituationChart');

          const claimsChart = echarts.init(chartElement);

          claimsChart.setOption({
            // title: {
            //   text: 'Claim饼状图',
            //   left: 'center',
            // },
            tooltip: {
              trigger: 'item',
              formatter: '{b}: {c} ({d}%)',
            },
            series: [
              {
                name: 'Claim',
                type: 'pie',
                radius: '75%',
                data: response.loanSituation.filter(
                  (item: { value: string }) => parseFloat(item.value) !== 0,
                ), // Filter out data points with 0% value
                label: {
                  show: true,
                  formatter: '{b}: {d}%',
                },
              },
            ],
          });

          // Calculate the percentage
          const percentage = (response.totalMortgage / response.totalCost) * 100;

          const gaugeChart = echarts.init(document.getElementById('gaugeChart') as HTMLDivElement);
          gaugeChart.setOption({
            title: {
              text: 'Risk Level',
              left: 'center',
            },
            series: [
              {
                type: 'gauge',
                startAngle: 180,
                endAngle: 0,
                center: ['50%', '75%'],
                radius: '90%',
                min: 0,
                max: 1,
                splitNumber: 8,
                axisLine: {
                  lineStyle: {
                    width: 6,
                    color: [
                      [0.25, '#7CFFB2'],
                      [0.5, '#58D9F9'],
                      [0.75, '#FDDD60'],
                      [1, '#FF6E76'],
                    ],
                  },
                },
                pointer: {
                  icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
                  length: '12%',
                  width: 20,
                  offsetCenter: [0, '-60%'],
                  itemStyle: {
                    color: 'auto',
                  },
                },
                axisTick: {
                  length: 12,
                  lineStyle: {
                    color: 'auto',
                    width: 2,
                  },
                },
                splitLine: {
                  length: 20,
                  lineStyle: {
                    color: 'auto',
                    width: 5,
                  },
                },
                axisLabel: {
                  color: '#464646',
                  fontSize: 20,
                  distance: -60,
                  rotate: 'tangential',
                  formatter: function (value: number) {
                    if (value === 0.875) {
                      return 'Grade D';
                    } else if (value === 0.625) {
                      return 'Grade C';
                    } else if (value === 0.375) {
                      return 'Grade B';
                    } else if (value === 0.125) {
                      return 'Grade A';
                    }
                    return '';
                  },
                },
                title: {
                  offsetCenter: [0, '-10%'],
                  fontSize: 20,
                },
                detail: {
                  fontSize: 30,
                  offsetCenter: [0, '-35%'],
                  valueAnimation: true,
                  formatter: function (value: number) {
                    // Specify the type as number
                    // Round the value to the nearest whole number
                    return Math.round(value * 100) + '%';
                  },
                  color: 'inherit',
                },
                data: [
                  {
                    value: 0.7,
                    name: 'Grade Rating',
                  },
                ],
              },
            ],
          });

          const debtChart = echarts.init(
            document.getElementById('assetRatioChart') as HTMLDivElement,
          );

          debtChart.setOption({
            // title: {
            //   text: 'Debt饼状图',
            //   left: 'center',
            // },
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b}: {c} ({d}%)',
            },
            series: [
              {
                name: 'Claim',
                type: 'pie',
                radius: '75%',
                data: response.assetRatio.filter(
                  (item: { value: string }) => parseFloat(item.value) !== 0,
                ), // Filter out data points with 0% value
                label: {
                  show: true,
                  formatter: '{b}: {d}%',
                },
              },
            ],
          });
        }
      } catch (error) {
        console.error('获取数据出错：', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Row gutter={16}>
        <Col span={8}>
          <Card title="loanSituation饼状图">
            <div id="loanSituationChart" style={{ height: '300px' }}></div>
          </Card>
        </Col>

        <Col span={8}>
          <Card title="gaugeChart">
            <div id="gaugeChart" style={{ height: '300px' }}></div>
          </Card>
        </Col>

        <Col span={8}>
          <Card title="assetRatio饼状图">
            <div id="assetRatioChart" style={{ height: '300px' }}></div>
          </Card>
        </Col>
      </Row>
      <div style={{ margin: '16px 0', width: '100%' }}>
        <Card title="详细信息">
          <Row>
            <Col span={8}>
              <AccountBookOutlined
                style={{ color: data.totalRealizableValue - data.totalCost < 0 ? 'red' : 'green' }}
              />{' '}
              {'totalCost: ' + data.totalCost}
            </Col>
            <Col span={8}>
              <DollarOutlined
                style={{ color: data.totalRealizableValue - data.totalCost < 0 ? 'red' : 'green' }}
              />{' '}
              {'totalRealizableValue: ' + data.totalRealizableValue}
            </Col>
            <Col span={8}>
              <LineChartOutlined
                style={{ color: data.totalRealizableValue - data.totalCost < 0 ? 'red' : 'green' }}
              />{' '}
              {'Net Worth: ' + (data.totalRealizableValue - data.totalCost)}
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <MoneyCollectOutlined
                style={{ color: data.totalRealizableValue - data.totalCost < 0 ? 'red' : 'green' }}
              />{' '}
              {'totalMortgage: ' + data.totalMortgage}
            </Col>
            <Col span={8}>
              <BankOutlined
                style={{ color: data.totalRealizableValue - data.totalCost < 0 ? 'red' : 'green' }}
              />{' '}
              {'monthCost: ' + data.monthCost}
            </Col>
            <Col span={8}>
              <PoundCircleOutlined
                style={{ color: data.totalRealizableValue - data.totalCost < 0 ? 'red' : 'green' }}
              />{' '}
              {'Financial status: '}
              <span
                style={{ color: data.totalRealizableValue - data.totalCost < 0 ? 'red' : 'green' }}
              >
                {data.totalRealizableValue - data.totalCost < 0 ? '较差' : '较好'}
              </span>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
};

export default Assets;
