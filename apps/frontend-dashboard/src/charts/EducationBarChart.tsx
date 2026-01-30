import React from 'react';
import Chart from 'react-apexcharts';
import type { EducationBarChartProps } from '../types';

export const EducationBarChart: React.FC<EducationBarChartProps> = ({ data, height = 300 }) => {
  const displayData = data.slice(0, 10).map(item => ({
    ...item,
    institution: item.institution && item.institution.length > 20 
      ? item.institution.substring(0, 20) + '...' 
      : item.institution || 'Unknown',
  }));

  if (displayData.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No education data available
      </div>
    );
  }

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
      categories: displayData.map(item => item.institution),
      labels: {
        style: {
          colors: '#64748b',
          fontSize: '12px',
        },
        rotate: -45,
        rotateAlways: true,
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
        gradientToColors: ['#10b981'],
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 0.8,
        stops: [0, 100],
      },
    },
    colors: ['#10b981'],
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
