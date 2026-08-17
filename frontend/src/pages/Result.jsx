import { useLocation, useNavigate } from "react-router-dom";
import PredictionResult from "../components/PredictionResult.jsx";

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const record = location.state?.result;

  if (!record) {
    return (
      <div className="card mx-auto max-w-lg p-8 text-center">
        <p className="text-charcoal-600">No prediction result to display.</p>
        <button className="btn-primary mt-4" onClick={() => navigate("/prediction")}>
          Start Prediction
        </button>
      </div>
    );
  }

  // Adapt the saved DB record (flat fields) into the shape PredictionResult expects.
  const result = {
    waste_type: record.predicted_waste_type,
    category: record.waste_category,
    action: record.action,
    priority: record.priority,
    confidence: record.confidence,
    recommendation: record.recommendation,
    environmental_note: record.environmental_note,
    input: {
      production_process: record.production_process,
      raw_material: record.raw_material,
      process_stage: record.process_stage,
      material_category: record.material_category,
      production_quantity: record.production_quantity,
      material_quantity: record.material_quantity,
    },
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h2 className="font-display text-xl font-semibold text-charcoal-900">Analysis Result</h2>
        <p className="mt-1 text-sm text-charcoal-500">
          Prediction #{record.id} saved on {new Date(record.created_at).toLocaleString()}
        </p>
      </div>

      <PredictionResult result={result} />

      <div className="mt-6 flex flex-wrap gap-3">
        <button className="btn-primary" onClick={() => navigate("/prediction")}>
          New Prediction
        </button>
        <button className="btn-secondary" onClick={() => navigate("/history")}>
          View History
        </button>
        <button className="btn-secondary" onClick={() => navigate(`/history/${record.id}`)}>
          View Full Details
        </button>
      </div>
    </div>
  );
}
