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
import { name } from '../alertRules/Form/EventSettings/Relabel';
import { axisXConfig } from '@antv/g2/lib/component/axisX';

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
  Tname: string;
}

const coolColors = [
  '#bed8b6', '#eab839', '#6ed0e0', '#ef843c', '#e24d42', '#1f78c1', '#ba43a9', '#705da0',
  '#90caf9','#b3e5fc', '#80deea', '#4dd0e1', '#26c6da', '#00acc1', '#00bcd4', '#4db6ac', 
  '#00796b','#004d40', '#00695c', '#00897b', '#00acc1', '#26a69a', '#00bfa5', '#004c8c', 
  '#0d47a1','#1a237e', '#283593', '#303f9f', '#3949ab', '#3f51b5', '#5c6bc0', '#7986cb', 
  '#9fa8da','#1e88e5', '#2196f3', '#00acc1', '#006064', '#00838f', '#0097a7', '#00bcd4', 
  '#00acc1','#26c6da', '#80deea'
];


const Chart: React.FC<ChartProps> = ({ data ,ystep,ymax,Tname}) => {
  const xData = data.map(point => point[0]);
  const yData = data.map(point => point[1]);

  const option = {
   
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      top: '10%',   // 减少图表的顶部边距
      bottom: '10%', // 减少图表的底部边距
    },
    xAxis: {
      type: 'category',
      data: xData,
      axisLable:{
        textStyle:{
          fontSize:20
        }
      }
    },
    yAxis: {
      type: 'value',
      max: ymax,
      interval: ystep,
      axisLable:{
        textStyle:{
          fontSize:20
        }
      }
    },
    series: [
      {
        name: Tname,
        data: yData,
        type: 'line',
        smooth: 0.6,
        symbol: 'none',
        itemStyle: {
          color: coolColors[0], // 设置线条颜色
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
                color: `${coolColors[0]}99`, // 起始颜色 (带透明度)
              },
              {
                offset: 1,
                color: `${coolColors[0]}00`, // 结束颜色 (完全透明)
              },
            ],
            global: false,
          },
        },
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: '100%' }} />;
};

export default Chart;
