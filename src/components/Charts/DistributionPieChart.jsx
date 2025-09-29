import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SERIES } from '../../utils/constants';

export default function DistributionPieChart({ data }) {
  const pieData = SERIES.map(s => ({
    name: s.name,
    value: data[s.key] || 0,
    percentage: ((data[s.key] || 0) / data.total * 100).toFixed(1)
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 border rounded-lg shadow">
          <p className="font-medium">{data.name}</p>
          <p>{data.value} ({data.percentage}%)</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Distribución por tipos</h3>
      <div className="h-[300px]">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              label={({ name, percentage }) => `${name} (${percentage}%)`}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={SERIES[index].color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}