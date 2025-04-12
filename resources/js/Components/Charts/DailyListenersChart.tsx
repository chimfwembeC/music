import React from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const dailyListeners = [
  { day: 'Mon', listeners: 300 },
  { day: 'Tue', listeners: 450 },
  { day: 'Wed', listeners: 500 },
  { day: 'Thu', listeners: 700 },
  { day: 'Fri', listeners: 900 },
  { day: 'Sat', listeners: 650 },
  { day: 'Sun', listeners: 300 },
];

export function DailyListenersChart() {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4 dark:text-white">Daily Active Listeners</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={dailyListeners}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="listeners" fill="#6366f1" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
