export function StatCard({ value, label, delay = 0 }) {
  return (
    <div className="scale-in" style={{animationDelay: `${delay}s`}}>
      <div className="text-4xl font-bold gradient-text mb-2">{value}</div>
      <div className="text-gray-400">{label}</div>
    </div>
  );
}