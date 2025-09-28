import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SERIES } from '../../utils/constants';

export default function BreakdownChart({ data, dimension }) {
  if (!data || !data.length) return null;

  // Calculem l'alçada dinàmica basada en el nombre d'elements
  // Mínim 400px, i 50px per cada element
  const height = Math.max(400, data.length * 50);

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">
        Desglosamiento por {dimension}
      </h3>
      <div className="w-full" style={{ height: `${height}px` }}>
        <ResponsiveContainer>
          <BarChart
            data={data}
            layout="vertical" // Això fa que les barres siguin horitzontals
            margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} /> {/* Línies verticals només */}
            <XAxis type="number" /> {/* Ara X mostra els valors numèrics */}
            <YAxis 
              dataKey="label" 
              type="category" 
              width={90} 
              tick={{ fontSize: 12 }}
            /> {/* Y mostra les categories */}
            <Tooltip />
            <Legend verticalAlign="top" />
            {SERIES.map(s => (
              <Bar 
                key={s.key}
                dataKey={s.key}
                name={s.name}
                fill={s.color}
                stackId="a"
                barSize={30} // Fixem l'alçada de les barres
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}