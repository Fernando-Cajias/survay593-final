import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';
import { Bar, Pie, Doughnut, Radar, PolarArea, Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
);

const PALETTE = [
  '#0D9488',
  '#6366F1',
  '#F59E0B',
  '#EF4444',
  '#8B5CF6',
  '#EC4899',
  '#10B981',
  '#3B82F6',
  '#F97316',
  '#14B8A6',
];

export const ChartRenderer = ({ type = 'bar', labels = [], data = [], title = '', height = 240 }) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: title || 'Respuestas',
        data,
        backgroundColor:
          type === 'radar'
            ? 'rgba(13, 148, 136, 0.25)'
            : type === 'line'
            ? 'rgba(13, 148, 136, 0.15)'
            : PALETTE.slice(0, labels.length).map((c) => (type === 'pie' || type === 'polarArea' ? c : c + 'CC')),
        borderColor:
          type === 'radar' || type === 'line'
            ? '#0D9488'
            : PALETTE.slice(0, labels.length),
        borderWidth: type === 'radar' || type === 'line' ? 2 : 1,
        borderRadius: type === 'bar' ? 6 : 0,
        fill: type === 'line' || type === 'radar',
        tension: 0.35,
        pointBackgroundColor: '#0D9488',
        pointBorderColor: '#fff',
      },
    ],
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: type === 'pie' || type === 'doughnut' || type === 'polarArea',
        position: 'bottom',
        labels: {
          color: '#94A3B8',
          padding: 12,
          font: { family: 'Inter', size: 11 },
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: '#1E293B',
        titleColor: '#F8FAFC',
        bodyColor: '#CBD5E1',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 10,
      },
    },
    scales:
      type === 'pie' || type === 'doughnut'
        ? {}
        : type === 'radar' || type === 'polarArea'
        ? {
            r: {
              grid: { color: 'rgba(255, 255, 255, 0.08)' },
              angleLines: { color: 'rgba(255, 255, 255, 0.08)' },
              pointLabels: { color: '#CBD5E1', font: { family: 'Inter', size: 11 } },
              ticks: { backdropColor: 'transparent', color: '#64748B' },
            },
          }
        : {
            x: {
              grid: { color: 'rgba(255, 255, 255, 0.04)' },
              ticks: { color: '#64748B', font: { family: 'Inter', size: 11 } },
            },
            y: {
              grid: { color: 'rgba(255, 255, 255, 0.04)' },
              ticks: { color: '#64748B', font: { family: 'Inter', size: 11 } },
              beginAtZero: true,
            },
          },
  };

  return (
    <div style={{ height: `${height}px`, position: 'relative' }} className="w-full">
      {type === 'bar' && <Bar data={chartData} options={commonOptions} />}
      {type === 'pie' && <Pie data={chartData} options={commonOptions} />}
      {type === 'doughnut' && <Doughnut data={chartData} options={commonOptions} />}
      {type === 'radar' && <Radar data={chartData} options={commonOptions} />}
      {type === 'polarArea' && <PolarArea data={chartData} options={commonOptions} />}
      {type === 'line' && <Line data={chartData} options={commonOptions} />}
    </div>
  );
};
