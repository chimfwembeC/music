import React from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const hourlySessions = [
  { hour: '12am', count: 100 },
  { hour: '3am', count: 80 },
  { hour: '6am', count: 120 },
  { hour: '9am', count: 300 },
  { hour: '12pm', count: 600 },
  { hour: '3pm', count: 500 },
  { hour: '6pm', count: 400 },
  { hour: '9pm', count: 350 },
];

export function SessionsByHourChart() {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4 dark:text-white">Listening Sessions by Hour</h3>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={hourlySessions}>
          <XAxis dataKey="hour" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="count" stroke="#14b8a6" fill="#a7f3d0" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
