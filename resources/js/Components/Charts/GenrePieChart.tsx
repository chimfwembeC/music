import React from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const genreData = [
  { name: 'Pop', value: 400 },
  { name: 'Hip-Hop', value: 300 },
  { name: 'Afrobeat', value: 300 },
  { name: 'Rock', value: 200 },
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff6b6b'];

export function GenrePieChart() {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4 dark:text-white">Top Genres</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={genreData} dataKey="value" nameKey="name" outerRadius={80} fill="#8884d8" label>
            {genreData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
