import React from 'react';
import Chart from 'react-apexcharts';
import type { SkillsBarChartProps } from '../types';

export const SkillsBarChart: React.FC<SkillsBarChartProps> = ({ data, height = 400 }) => {
  const displayData = data.slice(0, 10);

  const options = {
    chart: {
      type: 'bar' as const,
      toolbar: {
        show: false,
      },
      fontFamily: 'Inter, sans-serif',
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        horizontal: false,
        columnWidth: '60%',
        dataLabels: {
          position: 'top',
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => val.toString(),
      offsetY: -20,
      style: {
        fontSize: '12px',
        colors: ['#64748b'],
      },
    },
    xaxis: {
      categories: displayData.map(item => 
        item.skill.length > 15 ? item.skill.substring(0, 15) + '...' : item.skill
      ),
      labels: {
        style: {
          colors: '#64748b',
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: '#64748b',
          fontSize: '12px',
        },
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.3,
        gradientToColors: ['#6366f1'],
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 0.8,
        stops: [0, 100],
      },
    },
    colors: ['#6366f1'],
    grid: {
      borderColor: '#e2e8f0',
      strokeDashArray: 3,
    },
    tooltip: {
      theme: 'light',
      style: {
        fontSize: '12px',
      },
    },
  };

  const series = [
    {
      name: 'Resume Count',
      data: displayData.map(item => item.count),
    },
  ];

  return (
    <Chart
      options={options}
      series={series}
      type="bar"
      height={height}
    />
  );
};
