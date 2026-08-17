export default function ChartCard({ title, subtitle, children, className = "" }) {
  return (
    <div className={`card p-5 ${className}`}>
      <div className="mb-4">
        <h3 className="font-display text-base font-semibold text-charcoal-900">{title}</h3>
        {subtitle && <p className="text-sm text-charcoal-500">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
