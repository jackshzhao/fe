// src/components/Chart.tsx

import React, { useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import 'echarts-gl';

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  LineChart,
  CanvasRenderer,
]);

interface ChartProps {
  data: { name: string; usability: number }[];
}

const Chart: React.FC<ChartProps> = ({ data }) => {
  const xData = data.map(point => point.name); // 提取 X 轴数据
  const yData = data.map(point => point.usability); // 提取 Y 轴数据

  const option = {
    
    tooltip: {
      //show: false,
      trigger: "axis",
      axisPointer: {
        type: "none",
      },
    },
    grid: {
      top: "18%",
      left: "5%",
      bottom: "10%",
      right: "5%",
      containLabel: true,
    },
    animation: false,

    xAxis: [
      {
        type: "category",
        axisTick: {
          show: false,
        },
        // axisLine: {
        //   show: false,
        //   textStyle: {
        //     color: "#019bdd",
        //   },
        //   lineStyle: {
        //     color: "#019bdd", //刻度线的颜色
        //   },
        // },
        axisLabel: {
          interval: 0, // 确保所有标签都显示
          rotate:315,  // 旋转角度，防止名称重叠
          margin: 20, //刻度标签与轴线之间的距离。
          formatter: (value) => {
            // 如果名称过长，使用...来表示
            const maxLength = 8; // 根据实际情况调整
            if (value.length > maxLength) {
              return value.slice(0, maxLength) + '...';
            }
            return value;
          }
        },
        data: xData,        
      },
      // {
      //   type: "category",
      //   axisLine: {
      //     show: false,
      //   },
      //   axisTick: {
      //     show: false,
      //   },
      //   axisLabel: {
      //     show: false,
      //   },
      //   splitArea: {
      //     show: false,
      //   },
      //   splitLine: {
      //     show: false,
      //   },
      //   data: xData,
      // },
    ],

    yAxis: [
      {
        show: true,
        type: "value",
        axisLabel: {
          show: true,
          textStyle: {
            color: "#fff",
          },
        },
        //控制区域内的横线
        splitLine: {
          show: false,
          lineStyle: {
            color: "#064e78",
          },
        },
        axisLine: {
          show: false,
          textStyle: {
            color: "#019bdd",
          },
          lineStyle: {
            color: "#019bdd", //刻度线的颜色
          },
        },
      },
    ],
    
    series: [
      {
        name: "应用可用性",
        type: "pictorialBar",
        tooltip: {
          show: false
      },
        symbolSize: [30, 10],
        symbolOffset: ["0%", -5],
        symbolPosition: "end",
        z: 15,
        //color: yData.map((value, index) => ({value < 90 ? '#52c41a' : index === 1 ? 'yellow' : '#ff4d4f'})),
        zlevel: 2,
        //data: yData,
        data:yData.map((value, index) => ({
          value,
          itemStyle: {
            color: value >= 90 ? '#52c41a' : value >= 70 ? 'rgb(255,215,0)' : '#ff4d4f', // 分别设置为绿色、黄色、红色
          },
        })),
      },
      {
        name: "应用可用性",
        type: "bar",
        barGap: "60%",
        barWidth: 30,
        itemStyle: {
          // color: 'rgba(255,164,41,.16)',
          //color: 'rgba(255,164,41,.16)',
          borderColor: 'green',
          borderWidth: 1,
          borderType: "solid",
        },
        label: {
          show: true,
          position: "top",
          formatter: '{c}%',
          color: 'black',
          fontSize: 12,
          textAlign: "center",
        },
        zlevel: 2,
        //data: yData,
        data:yData.map((value, index) => ({
          value,
          itemStyle: {
            color: value >= 90 ? 'rgb(99,220,28)' : value >= 70 ? 'rgb(255,255,0)' : 'rgb(255,84,86)', // 分别设置为绿色、黄色、红色
          },
        })),
      },
      {
        name: "月份",
        type: "pictorialBar",
        symbolSize: [30, 10],
        symbolOffset: ["0%", 5],
        z: 12,
        show: false,
        tooltip: {
          show: false
      },
        data:yData.map((value, index) => ({
          value,
          itemStyle: {
            color: value >= 90 ? '#52c41a' : value >= 70 ? 'rgb(255,215,0)' : '#ff4d4f', // 分别设置为绿色、黄色、红色
          },
        })),
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: '100%' }} />;
};

export default Chart;
