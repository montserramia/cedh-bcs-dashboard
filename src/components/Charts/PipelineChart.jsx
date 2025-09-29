import { ResponsiveContainer, FunnelChart, Funnel, LabelList, Tooltip } from 'recharts';

const PIPELINE_STEPS = [
  { key: 'queja', name: 'Quejas en proceso' },
  { key: 'queja_concluida', name: 'Quejas concluidas' },
  { key: 'queja_conciliacion', name: 'En conciliación' },
  { key: 'recomendacion', name: 'Con recomendación' },
  { key: 'impugnacion', name: 'En impugnación' }
];

export default function PipelineChart({ data }) {
  const funnelData = PIPELINE_STEPS.map(step => ({
    name: step.name,
    value: data[step.key] || 0
  })).filter(d => d.value > 0);

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Estado de expedientes de quejas</h3>
      <div className="h-[400px]">
        <ResponsiveContainer>
          <FunnelChart>
            <Tooltip />
            <Funnel
              data={funnelData}
              dataKey="value"
              nameKey="name"
              fill="#8884d8"
              gradientRatio={[0.4, 0.6, 0.8]}
            >
              <LabelList position="right" fill="#000" stroke="none" dataKey="name" />
              <LabelList position="right" fill="#000" stroke="none" dataKey="value" />
            </Funnel>
          </FunnelChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}