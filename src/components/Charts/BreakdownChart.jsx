import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SERIES } from '../../utils/constants';

export default function BreakdownChart({ data, dimension }) {
  if (!data || !data.length) return null;

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">
        Desglosamiento por {dimension}
      </h3>
      <div className="h-[400px] w-full">
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Legend />
            {SERIES.map(s => (
              <Bar 
                key={s.key}
                dataKey={s.key}
                name={s.name}
                fill={s.color}
                stackId="a"
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}