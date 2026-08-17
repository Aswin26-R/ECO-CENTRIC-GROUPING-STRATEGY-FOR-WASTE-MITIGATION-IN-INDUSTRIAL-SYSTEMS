import { Leaf, Recycle, ShieldAlert, Wrench } from "lucide-react";
import { CATEGORY_STYLES, PRIORITY_STYLES } from "../constants.js";

const ACTION_ICON = {
  Recycle: Recycle,
  Reuse: Recycle,
  Treatment: Wrench,
  Review: ShieldAlert,
};

export default function PredictionResult({ result }) {
  if (!result) return null;
  const ActionIcon = ACTION_ICON[result.action] || Leaf;

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <p className="text-sm font-medium text-charcoal-500">Predicted Waste Type</p>
        <p className="mt-1 font-display text-2xl font-semibold text-charcoal-900">
          {result.waste_type}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className={`badge ${CATEGORY_STYLES[result.category] || CATEGORY_STYLES.Unclassified}`}>
            {result.category}
          </span>
          <span className={`badge ${PRIORITY_STYLES[result.priority] || PRIORITY_STYLES.Medium}`}>
            {result.priority} Priority
          </span>
          <span className="badge border border-charcoal-200 bg-charcoal-50 text-charcoal-600">
            Confidence: {(result.confidence * 100).toFixed(1)}%
          </span>
        </div>

        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-charcoal-100">
          <div
            className="h-full rounded-full bg-forge-600"
            style={{ width: `${Math.round(result.confidence * 100)}%` }}
          />
        </div>
      </div>

      <div className="card border-forge-200 bg-forge-50/40 p-6">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-forge-600 p-2.5 text-white">
            <ActionIcon size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-forge-700">
              Recommended Management Strategy
            </p>
            <p className="mt-1 font-display text-lg font-semibold text-charcoal-900">
              {result.action}
            </p>
            <p className="mt-2 text-sm text-charcoal-600">{result.recommendation}</p>
          </div>
        </div>
      </div>

      {result.environmental_note && (
        <div className="card p-5">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-charcoal-500">
            <Leaf size={14} className="text-forge-600" /> Environmental Impact Note
          </p>
          <p className="mt-2 text-sm text-charcoal-600">{result.environmental_note}</p>
        </div>
      )}

      <div className="card p-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-charcoal-500">
          Input Summary
        </p>
        <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          {Object.entries(result.input).map(([key, value]) => (
            <div key={key} className="flex justify-between border-b border-charcoal-100 pb-2">
              <dt className="capitalize text-charcoal-500">{key.replaceAll("_", " ")}</dt>
              <dd className="font-medium text-charcoal-800">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
