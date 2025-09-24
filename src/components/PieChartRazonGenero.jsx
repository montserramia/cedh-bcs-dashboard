import { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const COLORS = ['#0088FE', '#FF8042']

export default function PieChartRazonGenero() {
  const [datos, setDatos] = useState(null)

  useEffect(() => {
    Promise.all([
      fetch('https://cedh-bcs.org/es/views/json?_format=json&field_razon_genero_value=1'),
      fetch('https://cedh-bcs.org/es/views/json?_format=json&field_razon_genero_value=0')
    ])
    .then(async ([resSi, resNo]) => {
      const si = await resSi.json();
      const no = await resNo.json();

      console.log("👁️ Contingut brut SI:", si);
      console.log("👁️ Contingut brut NO:", no);

      alert(`SI és un array? ${Array.isArray(si)} — Longitud: ${si.length}`)
    })
      .catch(error => {
        console.error("💥 Error carregant dades:", error)
      })
  }, [])

  if (!datos) return <p className="text-gray-500">Cargando datos...</p>

  const total = datos.reduce((sum, item) => sum + item.value, 0)
  const datosAmbPercentatge = total > 0
    ? datos.map(item => ({
        ...item,
        percentage: ((item.value / total) * 100).toFixed(1)
      }))
    : datos.map(item => ({
        ...item,
        percentage: "0.0"
      }))

  return (
    <div className="w-full max-w-xl mx-auto text-center">
      <h2 className="text-3xl font-bold mb-4">Distribución de Razón de Género</h2>

      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={datosAmbPercentatge}
            cx="50%"
            cy="50%"
            outerRadius={120}
            dataKey="value"
            label={({ name, percentage }) => `${percentage}%`}
          >
            {datosAmbPercentatge.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name, props) => [`${value}`, `${props.payload.name}`]}
            labelFormatter={() => ''}
          />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
