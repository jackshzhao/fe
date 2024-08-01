import React, { useEffect } from 'react';
import * as echarts from 'echarts/core';
import DashboardChart from './DashboardChart'; // 确保路径正确

const Grid = ({ charts }) => {
  // 计算每个网格的样式
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gridTemplateRows: 'repeat(2, 1fr)',
    gap: '1px',
  };

  useEffect(() => {
    //console.log("charts:",charts)
    const handleResize = () => {
      charts.forEach((_, index) => {
        const chartElement = document.getElementById(`chart-${index}`);
        if (chartElement) {
          const echartsInstance = echarts.getInstanceByDom(chartElement);
          if (echartsInstance) {
            echartsInstance.resize();
          }
        }
      });
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [charts]);

  return (
    <div style={gridStyle}>
      {charts.map((chart, index) => (
        <div key={index} id={`chart-${index}`} style={{ width: '100%', height: '100%' }}>
          <DashboardChart data={chart} />
        </div>
      ))}
    </div>
  );
};

export default Grid;
