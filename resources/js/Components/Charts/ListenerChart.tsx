import React from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { week: 'Week 1', listeners: 200 },
  { week: 'Week 2', listeners: 450 },
  { week: 'Week 3', listeners: 300 },
  { week: 'Week 4', listeners: 700 },
];

export default function ListenerChart() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Listener Growth</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="listeners" stroke="#6366f1" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}


