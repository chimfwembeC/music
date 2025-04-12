import React from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';


const artistData = [
    { artist: 'Burna Boy', plays: 1200 },
    { artist: 'Tems', plays: 1100 },
    { artist: 'Wizkid', plays: 950 },
    { artist: 'Asake', plays: 900 },
  ];
  
  export function TopArtistsChart() {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 dark:text-white">Top Artists</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart layout="vertical" data={artistData}>
            <XAxis type="number" />
            <YAxis type="category" dataKey="artist" />
            <Tooltip />
            <Bar dataKey="plays" fill="#f97316" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
  