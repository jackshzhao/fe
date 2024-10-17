import React, { useEffect, useRef } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts/core';
import { PieChart } from 'echarts/charts';
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
  PieChart,
  CanvasRenderer,
]);

interface ChartProps {
  data: { 
    id: string;
    name: string; 
    health_level: number; // 纵坐标
  };
}

const Chart: React.FC<ChartProps> = ({ data}) => {
  const chartRef = useRef<ReactECharts>(null);

  const option = {
    title: [
      {
        text: data.name,
        left: 'center',
        top: '80%',
        textStyle: {
          fontSize: 14, // 标题字体大小
          color: "black", // 标题字体颜色
          fontWeight: 'normal'
        },
        // // 添加 link 和 linkTarget
        // link: `/application-details?ids=${data.id}&isLeaf=true&names=${data.name}`, // 这里替换为你的跳转链接
        // linkTarget: 'self', // '_blank' 表示在新标签页打开，'_self' 表示在当前页打开
      }
    ],
        series: [//系列
        {
            name: data.name,
            type: 'pie',//pie类型的图实现环形图
            radius: ['40%','65%'],//数组的话，表示内圆和外圆的半径大小，相对于宽高中较小的那一个。
            center:['50%','50%'],//圆心坐标
            avoidLabelOverlap: false,//是否启用防止标签重叠策略
            startAngle:270,//第一个数据开始绘制的角度，以正交直角坐标系为标准
            label: {//每个数据的标签
                show: true,//设置为true则显示第一个数据
                position: 'center',//位置居中
                formatter:() => `${data.health_level}`,//{d}表示数据在总数据中的百分比
                fontSize:15,
                //fontWeight:'bold'
            },
            color: [data.health_level < 70 ? '#ff4d4f' : data.health_level < 90 ? 'yellow' : '#52c41a', '#d7dbde'],//系列的颜色
            emphasis: {//高亮，即鼠标经过时的样式
                scale:false//表示不放大item
            },
            labelLine: {
                show: true
            },
            data: [
                {value: data.health_level, name: ''},
                {value:100-data.health_level, name:'',
                emphasis:{
                    label:{
                        show:true//这个数据高亮时不显示label，就不会显示替遮住第一个数据的label值了
                    }
                }}
            ]
        }
    ]  
  };

  const handleClick = () => {
    window.location.href = `/application-details?ids=${data.id}&isLeaf=true&names=${data.name}`; // 实现跳转到指定链接
  };
  useEffect(() => {
    const chartInstance = chartRef.current?.getEchartsInstance();

    if (chartInstance) {
      // 监听整个图表的点击事件
      chartInstance.on('click', handleClick);
    }

    return () => {
      chartInstance?.off('click', handleClick); // 清除事件监听
    };
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (chartRef.current) {
        chartRef.current.getEchartsInstance().resize();
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [data]);

  return (
    <div onClick={handleClick} style={{ cursor: 'pointer' }}>
      <ReactECharts ref={chartRef} option={option} style={{ height: '100%', width: '100%' }} />
    </div>
  )
};

export default Chart;
