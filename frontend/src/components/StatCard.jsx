export default function StatCard({ label, value, icon: Icon, accent = "forge" }) {
  const accents = {
    forge: "bg-forge-50 text-forge-600",
    rust: "bg-rust-500/10 text-rust-500",
    charcoal: "bg-charcoal-100 text-charcoal-600",
  };

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-charcoal-500">{label}</p>
        {Icon && (
          <div className={`rounded-lg p-2 ${accents[accent]}`}>
            <Icon size={18} />
          </div>
        )}
      </div>
      <p className="mt-3 font-display text-3xl font-semibold text-charcoal-900">{value}</p>
    </div>
  );
}
