import { Rating } from '@/app/models/Rating';
import React from 'react';

interface BarChartProps {
  ratings: Rating['ratings'];
}

const BarChart: React.FC<BarChartProps> = ({ ratings }) => {
  const data = Object.entries(ratings);
  const total = data.map(([k, v]) => v).reduce((acc, value) => acc + value, 0);
  return (
    <div className="flex justify-between items-end h-64 w-full bg-base-200 p-4 rounded-md shadow-lg">
      {data.map(([key, value]) => {
        const percent = (value / total);
        return (
          <div key={key} className="flex flex-col items-center">
            <span>{(percent * 100).toFixed(0)}%</span>
            <div
              className="bg-primary w-12 rounded-t-md"
              style={{ height: `${180 * percent}px` }}
            ></div>
            <span className="mt-2 text-sm">{key}</span>
          </div>
        )
      })}
    </div>
  );
};

export default BarChart;
