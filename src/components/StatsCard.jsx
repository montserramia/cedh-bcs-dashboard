export default function StatsCard({ title, value }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 text-center">
      <h3 className="text-sm text-gray-500">{title}</h3>
      <p className="text-2xl font-semibold text-blue-700">{value}</p>
    </div>
  );
}
