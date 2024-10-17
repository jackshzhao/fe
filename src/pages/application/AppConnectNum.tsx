import React from 'react';
import ReactECharts from 'echarts-for-react';

// 定义一个随机生成颜色的函数
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const coolColors = [
  '#bed8b6', '#eab839', '#6ed0e0', '#ef843c', '#e24d42', '#1f78c1', '#ba43a9', '#705da0',
  '#90caf9','#b3e5fc', '#80deea', '#4dd0e1', '#26c6da', '#00acc1', '#00bcd4', '#4db6ac', 
  '#00796b','#004d40', '#00695c', '#00897b', '#00acc1', '#26a69a', '#00bfa5', '#004c8c', 
  '#0d47a1','#1a237e', '#283593', '#303f9f', '#3949ab', '#3f51b5', '#5c6bc0', '#7986cb', 
  '#9fa8da','#1e88e5', '#2196f3', '#00acc1', '#006064', '#00838f', '#0097a7', '#00bcd4', 
  '#00acc1','#26c6da', '#80deea'
];

interface LineChartProps {
  data: {
    time: string[];
    series: {
      name: string;
      data: number[];
    }[];
  };
}

const LineChart: React.FC<LineChartProps> = ({ data }) => {
  const getOption = () => {
    return {
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data.time,
      },
      yAxis: {
        type: 'value',
        name: '连接数',
      },
      series: data.series.map((item,index) => {
        const color = getRandomColor(); // 调用 getRandomColor 函数生成颜色
        return {
          name: item.name,
          type: 'line',
          smooth: true, // 平滑曲线
          symbol: 'none', // 隐藏数据点
          data: item.data,
          itemStyle: {
            color: coolColors[index], // 设置线条颜色
          },
          areaStyle: {
            // 渐变填充
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: `${coolColors[index]}99`, // 起始颜色 (带透明度)
                },
                {
                  offset: 1,
                  color: `${coolColors[index]}00`, // 结束颜色 (完全透明)
                },
              ],
              global: false,
            },
          },
        };
      }),
    };
  };

  return <ReactECharts option={getOption()} style={{ height: '100%', width: '100%' }} />;
};

export default LineChart;
