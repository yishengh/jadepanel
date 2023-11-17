import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Row } from 'antd';
import { getExpensesCollection } from '@/pages/Bills/Expenses/service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCoffee,
  faUtensils,
  faShoppingCart,
  faDotCircle,
  faQuestionCircle,
  faBook,
  faHeart,
  faLaptop,
  faHome,
  faDollar,
  faArrowDown,
  faArrowUp,
} from '@fortawesome/free-solid-svg-icons'; // 导入所需的图标
import * as echarts from 'echarts';

type expensesPoint = {
  expensesTime: string;
  num: number;
};

type ExpensesDataList = {
  expensesTotal: string;
  expensesGroup: {
    name: string;
    value: number;
  }[];
  expensesExpensesList: {
    expensesTime: string;
    num: number;
  }[];
  todayExpenses: string | null;
};

// 将支出类别与图标关联起来的映射
const categoryIcons = {
  交通: <FontAwesomeIcon icon={faShoppingCart} />,
  分红: <FontAwesomeIcon icon={faDotCircle} />,
  其他: <FontAwesomeIcon icon={faQuestionCircle} />,
  学习: <FontAwesomeIcon icon={faBook} />,
  人情: <FontAwesomeIcon icon={faHeart} />,
  烟酒: <FontAwesomeIcon icon={faCoffee} />,
  饮食: <FontAwesomeIcon icon={faUtensils} />,
  设备: <FontAwesomeIcon icon={faLaptop} />,
  家居: <FontAwesomeIcon icon={faHome} />,
  工资: <FontAwesomeIcon icon={faDollar} />,
  // 其他类别与相应的图标
};

const expensesChartPage = () => {
  const [yearExpensesData, setYearExpensesData] = useState<
    | {
        expensesTime: string;
        num: number;
      }[]
    | null
  >(null);
  const [monthExpensesData, setMonthExpensesData] = useState<
    | {
        expensesTime: string;
        num: number;
      }[]
    | null
  >(null);

  const [yearChangePercentage, setYearChangePercentage] = useState<number | null>(0); // 今年和去年的平均收入百分比变化
  const [monthChangePercentage, setMonthChangePercentage] = useState<number | null>(0); // 今年和去年的平均收入百分比变化

  const [yearTopCategories, setYearTopCategories] = useState<string[] | null>(null); // 较大收入类别
  const [yearTopCategoriesValue, setYearTopCategoriesValue] = useState<string[] | null>(null); // 较大收入类别

  const [monthTopCategories, setMonthTopCategories] = useState<string[] | null>(null); // 较大收入类别
  const [monthTopCategoriesValue, setMonthTopCategoriesValue] = useState<string[] | null>(null); // 较大收入类别

  const [annualExpenses, setAnnualExpenses] = useState<number | null>(0); // 今年收入
  const [monthlyExpenses, setMonthlyExpenses] = useState<number | null>(0); // 本月收入
  const [dailyExpenses, setDailyExpenses] = useState<number | null>(0);
  const [displayType, setDisplayType] = useState('year');
  const todayDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const handleButtonClick = () => {
    // 根据当前的displayType值切换到另一个值
    setDisplayType(displayType === 'year' ? 'month' : 'year');
  };
  const renderExpensesChart = (data: { expensesTime: string; num: number }[] | null) => {
    if (data != null) {
      const chartElement = document.getElementById('expensesChart');

      const myChart = echarts.init(chartElement);

      const xAxisData = data.map((item) => item.expensesTime);
      const yAxisData = data.map((item) => item.num);

      const option = {
        title: {
          text: '年收入图表',
          left: 'center', // Center align the title
          textStyle: {
            color: 'white', // Set title text color to white
          },
        },
        tooltip: {
          trigger: 'axis',
          formatter: (
            params: {
              axisValue: string;
              data: any;
            }[],
          ) => {
            const datay = params[0].data;
            const datax = params[0].axisValue;
            if (datay) {
              return `Date：${datax}<br>Expenses：$${parseFloat(datay).toFixed(0)}`;
            }
            return ''; // 处理 data.num 不存在或不是数值的情况
          },
        },
        xAxis: {
          type: 'category',
          data: xAxisData,
          axisLine: {
            lineStyle: {
              color: 'white', // Set xAxis line color to white
            },
          },
        },
        yAxis: {
          type: 'value',
          name: 'Expenses',
          axisLabel: {
            formatter: '${value}',
          },
          axisLine: {
            lineStyle: {
              color: 'white', // Set yAxis line color to white
            },
          },
        },
        series: [
          {
            data: yAxisData,
            type: 'line',
            smooth: true,
            lineStyle: {
              width: 4, // 增加线宽以突出显示
              color: 'rgba(0, 255, 0, 0.7)', // 设置线颜色为绿色并添加透明度
              type: 'solid', // 设置线型为实线
            },
            areaStyle: {
              color: 'rgba(0, 255, 0, 0.3)', // 设置阴影颜色为绿色半透明
            },
          },
        ],
      };

      // Set the background color of the chart
      myChart.setOption({
        backgroundColor: 'rgba(0, 0, 0, 0.8)', // Set background color to black with some transparency
      });

      myChart.setOption(option);
    }
  };

  // @ts-ignore
  const renderPieChart = ({ data, categories }) => {
    console.log('Pi图');
    console.log(data);
    console.log(categories);
    if (document.getElementById('expensesPieChart')) {
      const chartElement = document.getElementById('expensesPieChart');
      const myChart = echarts.init(chartElement);

      const option = {
        title: {
          text: '年度收入分类比例',
          left: 'center',
          textStyle: {
            color: 'white',
          },
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)',
        },
        legend: {
          orient: 'horizontal', // 设置图例为水平布局
          top: 'bottom', // 设置图例位于底部
          data: categories,
          textStyle: {
            color: 'white',
          },
          itemGap: 5, // 调整图例项之间的间距
          itemWidth: 20, // 控制图例项的宽度
          itemHeight: 20, // 控制图例项的高度
        },
        series: [
          {
            name: '收入分类',
            type: 'pie',
            radius: '55%',
            center: ['50%', '50%'],
            data: categories.map((category: any, index: string | number) => ({
              name: category,
              value: data[index],
            })),
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      };

      // 设置图表的背景颜色
      myChart.setOption({
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
      });

      // 渲染饼状图
      myChart.setOption(option);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const lastYear = currentYear - 1;
        const currentMonth = currentDate.getMonth() + 1;
        const currentDay = currentDate.getDate();
        const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
        const today = `${currentYear}${currentMonth.toString().padStart(2, '0')}${currentDay
          .toString()
          .padStart(2, '0')}`;
        const yesterday = new Date(currentDate);
        yesterday.setDate(yesterday.getDate() - 1);
        const formattedYesterday = `${yesterday.getFullYear()}${(yesterday.getMonth() + 1)
          .toString()
          .padStart(2, '0')}${yesterday.getDate().toString().padStart(2, '0')}`;

        const dataArray = await Promise.all([
          getExpensesCollection({ date: currentYear.toString() }),
          getExpensesCollection({ date: lastYear.toString() }),
          getExpensesCollection({
            date: `${currentYear}${currentMonth.toString().padStart(2, '0')}`,
          }),
          getExpensesCollection({ date: `${currentYear}${lastMonth.toString().padStart(2, '0')}` }),
        ]);
        const defaultExpensesData = {
          expensesTotal: 0,
          todayExpenses: 0,
        };
        const sanitizedDataArray = dataArray.map((data) =>
          data !== null ? data : { ...defaultExpensesData, expensesGroup: [], expensesExpensesList: [] },
        );
        if (sanitizedDataArray.every((data) => data !== null)) {
          // 计算天数
          const startOfYear = new Date(currentYear, 0, 1);
          const yearTimeDifference = currentDate.getTime() - startOfYear.getTime();
          const daysFromJan1st = Math.floor(yearTimeDifference / (1000 * 60 * 60 * 24));
          const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
          const monthTimeDifference = currentDate.getTime() - startOfMonth.getTime();
          // 将毫秒转换为天数
          const daysFrom1st = Math.floor(monthTimeDifference / (1000 * 60 * 60 * 24));
          const thisYearExpensesValue = parseFloat(dataArray[0].expensesTotal);
          const lastYearExpensesValue = parseFloat(dataArray[1].expensesTotal);
          const thisMonthExpensesValue = parseFloat(dataArray[2].expensesTotal);
          const lastMonthExpensesValue = parseFloat(dataArray[3].expensesTotal);

          setYearChangePercentage(
            1 - thisYearExpensesValue / 365 / (lastYearExpensesValue / daysFromJan1st),
          );
          setMonthChangePercentage(
            1 - thisMonthExpensesValue / 30 / (lastMonthExpensesValue / daysFrom1st),
          );

          setYearTopCategories(dataArray[0].expensesGroup.map((item: { name: any }) => item.name));
          setMonthTopCategories(dataArray[2].expensesGroup.map((item: { name: any }) => item.name));

          setYearTopCategoriesValue(
            dataArray[0].expensesGroup.map((item: { value: any }) => item.value),
          );
          setMonthTopCategoriesValue(
            dataArray[2].expensesGroup.map((item: { value: any }) => item.value),
          );
          setAnnualExpenses(thisYearExpensesValue);
          setMonthlyExpenses(thisMonthExpensesValue);
          setDailyExpenses(dataArray[0].todayExpenses);

          // 处理 dataArray 中的数据
          setYearExpensesData(dataArray[0].expensesExpensesList);
          setMonthExpensesData(dataArray[2].expensesExpensesList);

          console.log('1');
          console.log(dataArray[0].expensesExpensesList);
          if (document.getElementById('expensesChart')) {
            renderExpensesChart(dataArray[0].expensesExpensesList);
          }
          if (document.getElementById('expensesPieChart')) {
            renderPieChart({
              data: dataArray[0].expensesGroup.map((item: { value: any }) => item.value),
              categories: dataArray[0].expensesGroup.map((item: { name: any }) => item.name),
            });
          }
        }
      } catch (error) {
        // 处理错误
        console.error('发生错误：', error);
      }
    };

    fetchData(); // 调用 fetchData 函数
  }, []);

  const chartContainerStyle = {
    height: '400px',
    marginTop: '20px', // 上边距
  };

  return (
    <div className="page-container">
      <Card
        title={`您好！Yisheng，下面是您的收入情况：`}
        extra={
          <Button onClick={handleButtonClick}>{`切换${
            displayType === 'year' ? '月度' : '年度'
          }数据`}</Button>
        }
      >
        <div className="card-content">
          <Row gutter={16}>
            {/* 第一个子卡片 */}
            {yearChangePercentage !== null && monthChangePercentage !== null && (
              <Col span={8}>
                <Card className="sub-card" style={{ height: '100%' }}>
                  <h3>{displayType === 'year' ? '年平均每日收入' : '月平均每日收入'}</h3>
                  <p>
                    <span
                      style={{
                        color:
                          displayType === 'year'
                            ? yearChangePercentage < 0
                              ? 'red'
                              : 'green'
                            : monthChangePercentage < 0
                            ? 'red'
                            : 'green',
                        marginRight: '5px',
                      }}
                    >
                      {displayType === 'year' ? (
                        yearChangePercentage < 0 ? (
                          <FontAwesomeIcon icon={faArrowDown} />
                        ) : (
                          <FontAwesomeIcon icon={faArrowUp} />
                        )
                      ) : monthChangePercentage < 0 ? (
                        <FontAwesomeIcon icon={faArrowDown} />
                      ) : (
                        <FontAwesomeIcon icon={faArrowUp} />
                      )}
                    </span>
                    {Math.abs(
                      Number(
                        Number(
                          displayType === 'year' ? yearChangePercentage : monthChangePercentage,
                        ).toFixed(2),
                      ),
                    )}
                    %
                  </p>
                  <h3>统计时间</h3>
                  <p>{todayDate}</p>
                </Card>
              </Col>
            )}

            {/* 第二个子卡片 */}
            {yearTopCategories !== null &&
              monthTopCategories !== null &&
              yearTopCategoriesValue !== null &&
              monthTopCategoriesValue !== null && (
                <Col span={8}>
                  <Card className="sub-card" style={{ height: '100%' }}>
                    <h3>{displayType === 'year' ? '较大收入类别（年）' : '较大收入类别（月）'}</h3>
                    <ul>
                      {displayType === 'year' ? (
                        yearTopCategories.length > 0 ? (
                          yearTopCategories.slice(0, 4).map((category, index) => (
                            <li key={index}>
                              {categoryIcons[category as keyof typeof categoryIcons]} {category}{' '}
                              {`$ ${parseFloat(yearTopCategoriesValue[index]).toFixed(0)}`}
                            </li>
                          ))
                        ) : (
                          <li>当前没有收入</li>
                        )
                      ) : monthTopCategories.length > 0 ? (
                        monthTopCategories.slice(0, 4).map((category, index) => (
                          <li key={index}>
                            {categoryIcons[category as keyof typeof categoryIcons]} {category}{' '}
                            {`$ ${parseFloat(monthTopCategoriesValue[index]).toFixed(0)}`}
                          </li>
                        ))
                      ) : (
                        <li>当前没有收入</li>
                      )}
                    </ul>
                  </Card>
                </Col>
              )}

            {/* 第三个子卡片 */}
            <Col span={8}>
              <Card className="sub-card" style={{ height: '100%' }}>
                {displayType === 'year' ? (
                  <>
                    {annualExpenses !== null && (
                      <>
                        <h3>今年收入</h3>
                        <p>{`$ ${annualExpenses.toFixed(2)}`}</p>
                      </>
                    )}
                    {dailyExpenses !== null && !isNaN(dailyExpenses) ? (
                      <>
                        <h3>今天收入</h3>
                        <p>{`$ ${dailyExpenses.toFixed(2)}`}</p>
                      </>
                    ) : (
                      <>
                        <h3>今天收入</h3>
                        <p>今天没有收入数据</p>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {monthlyExpenses !== null && (
                      <>
                        <h3>本月收入</h3>
                        <p>{`$ ${monthlyExpenses.toFixed(2)}`}</p>
                      </>
                    )}
                    {dailyExpenses !== null && !isNaN(dailyExpenses) ? (
                      <>
                        <h3>今天收入</h3>
                        <p>{`$ ${dailyExpenses.toFixed(2)}`}</p>
                      </>
                    ) : (
                      <>
                        <h3>今天收入</h3>
                        <p>今天没有收入数据</p>
                      </>
                    )}
                  </>
                )}
              </Card>
            </Col>
          </Row>
        </div>
      </Card>
      <Row gutter={16}>
        <Col span={12}>
          <div id="expensesChart" style={chartContainerStyle}></div>
        </Col>
        <Col span={12}>
          <div id="expensesPieChart" style={chartContainerStyle}></div>
        </Col>
      </Row>
    </div>
  );
};

export default expensesChartPage;
