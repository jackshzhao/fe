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
import { Smooth } from '@antv/g2/lib/shape/line/smooth';
import { symbol } from 'd3';

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  LineChart,
  CanvasRenderer,
]);

interface ChartProps {
  data: [string, number][];
  ystep: number;
  ymax: number;
}


const Chart: React.FC<ChartProps> = ({ data ,ystep,ymax}) => {
  const xData = data.map(point => point[0]);
  const yData = data.map(point => point[1]);

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
      max: ymax,
      interval: ystep,
    },
    series: [
      {
        data: yData,
        type: 'line',
        smooth: 0.6,
        symbol: 'none',
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: '100%' }} />;
};

export default Chart;
