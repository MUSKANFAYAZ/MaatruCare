import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const MoodTrendChart = ({ data, timeRange }) => {
  const moodColors = {
    1: '#FF6B6B',
    2: '#FFA500',
    3: '#FFD93D',
    4: '#6BCB77',
    5: '#4D96FF'
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E8E8E8" />
        <XAxis dataKey="label" stroke="#666" />
        <YAxis domain={[0, 5]} stroke="#666" />
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: '2px solid #6BCB77',
            borderRadius: '8px'
          }}
          formatter={(value) => {
            const moods = ['', 'Very Bad', 'Bad', 'Okay', 'Good', 'Excellent'];
            return moods[value];
          }}
        />
        <Line
          type="monotone"
          dataKey="mood"
          stroke="#6BCB77"
          strokeWidth={3}
          dot={{ fill: '#6BCB77', r: 5 }}
          activeDot={{ r: 7 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default MoodTrendChart;