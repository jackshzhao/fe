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
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      data: xData,
    },
    yAxis: {
      type: 'value',
      max: 100,
      interval: 20,
      axisLabel: {
        formatter: '{value}%',
      }
    },
    series: [
      {
        data: yData,
        type: 'bar',
        label: {
          show: true,
          position: 'top',
          formatter: '{c}%',
        },
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: '100%' }} />;
};

export default Chart;
