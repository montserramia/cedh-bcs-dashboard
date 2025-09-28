import { SERIES } from '../../utils/constants';

export default function StatsCards({ data, loading }) {
  if (!data) return null;

  const cards = [
    ...SERIES.map(s => ({
      key: s.key,
      label: s.name,
      value: data[s.key] || 0,
      color: s.color
    })),
    {
      key: 'total',
      label: 'Total',
      value: data.total || 0,
      color: '#1F2937'
    }
  ];

  return (
    <section className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
      {cards.map(card => (
        <div
          key={card.key}
          className="p-4 md:p-5 rounded-2xl bg-white border border-slate-100 shadow-sm"
        >
          <div className="text-xs uppercase tracking-wide text-slate-500">
            {card.label}
          </div>
          <div className="mt-1 text-2xl font-semibold tabular-nums">
            {loading ? '…' : card.value.toLocaleString()}
          </div>
        </div>
      ))}
    </section>
  );
}