import { Loader2 } from "lucide-react";

export default function LoadingSpinner({ label = "Loading…", size = 18, className = "" }) {
  return (
    <div className={`flex items-center gap-2 text-charcoal-500 ${className}`}>
      <Loader2 size={size} className="animate-spin text-forge-600" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
