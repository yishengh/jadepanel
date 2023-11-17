import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Typography } from 'antd';
import * as echarts from 'echarts';
import { getClaimsAndDebtCollection } from '@/pages/Equity/ClaimsAndDebt/service';
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

const ClaimsAndDebt: React.FC = () => {
  const [data, setData] = useState<any>({
    claimsGroup: [],
    sumClaim: 0,
    debtGroup: [],
    sumDebt: 0,
    maxClaim: '0',
    maxDebt: '0',
  });

  useEffect(() => {
    // 模拟获取数据
    const fetchData = async () => {
      try {
        const response = await getClaimsAndDebtCollection({ date: '2019' }); // 调用服务获取数据
        setData(response);
        console.log(response);

        // 使用ECharts绘制饼状图
        if (response.claimsGroup.length > 0 && response.debtGroup.length > 0) {
          const chartElement = document.getElementById('claimsChart');

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
                data: response.claimsGroup,
                label: {
                  show: true,
                  formatter: '{b}: {d}%',
                },
              },
            ],
          });

          const debtChart = echarts.init(document.getElementById('debtChart') as HTMLDivElement);

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
                data: response.debtGroup,
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
        <Col span={12}>
          <Card title="Claim饼状图">
            <div id="claimsChart" style={{ height: '300px' }}></div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Debt饼状图">
            <div id="debtChart" style={{ height: '300px' }}></div>
          </Card>
        </Col>
      </Row>
      <div style={{ margin: '16px 0', width: '100%' }}>
        <Card title="详细信息">
          <Row>
            <Col span={8}>
              <AccountBookOutlined
                style={{ color: data.sumClaim - data.sumDebt < 0 ? 'red' : 'green' }}
              />{' '}
              {'Total Claim: ' + data.sumClaim}
            </Col>
            <Col span={8}>
              <DollarOutlined
                style={{ color: data.sumClaim - data.sumDebt < 0 ? 'red' : 'green' }}
              />{' '}
              {'Total Debts: ' + data.sumDebt}
            </Col>
            <Col span={8}>
              <LineChartOutlined
                style={{ color: data.sumClaim - data.sumDebt < 0 ? 'red' : 'green' }}
              />{' '}
              {'Net Worth: ' + (data.sumClaim - data.sumDebt)}
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <MoneyCollectOutlined
                style={{ color: data.sumClaim - data.sumDebt < 0 ? 'red' : 'green' }}
              />{' '}
              {'Max Claim: ' + data.maxClaim}
            </Col>
            <Col span={8}>
              <BankOutlined style={{ color: data.sumClaim - data.sumDebt < 0 ? 'red' : 'green' }} />{' '}
              {'Max Debts: ' + data.maxDebt}
            </Col>
            <Col span={8}>
              <PoundCircleOutlined
                style={{ color: data.sumClaim - data.sumDebt < 0 ? 'red' : 'green' }}
              />{' '}
              {'Financial status: '}
              <span style={{ color: data.sumClaim - data.sumDebt < 0 ? 'red' : 'green' }}>
                {data.sumClaim - data.sumDebt < 0 ? '较差' : '较好'}
              </span>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
};

export default ClaimsAndDebt;
