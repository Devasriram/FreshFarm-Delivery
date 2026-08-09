function SummaryCard({ title, value, color }) {
  return (
    <div className="bg-white rounded-xl shadow p-5 border-l-4" style={{ borderColor: color }}>
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}

export default SummaryCard;