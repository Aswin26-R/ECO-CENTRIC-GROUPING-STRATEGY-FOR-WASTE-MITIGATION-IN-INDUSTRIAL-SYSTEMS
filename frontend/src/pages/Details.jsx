import { AlertTriangle, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import PredictionResult from "../components/PredictionResult.jsx";
import { predictionApi } from "../services/api.js";

export default function Details() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    predictionApi
      .getById(id)
      .then((res) => {
        if (mounted) setRecord(res.data.prediction);
      })
      .catch((err) => {
        if (mounted) setError(err.friendlyMessage || "Unable to load this prediction.");
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoadingSpinner label="Loading prediction details…" />
      </div>
    );
  }

  if (error || !record) {
    return (
      <div className="card mx-auto max-w-lg p-8 text-center">
        <AlertTriangle className="mx-auto mb-3 text-rust-500" size={28} />
        <p className="text-charcoal-600">{error || "Prediction not found."}</p>
        <button className="btn-secondary mt-4" onClick={() => navigate("/history")}>
          Back to History
        </button>
      </div>
    );
  }

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
      <button
        onClick={() => navigate("/history")}
        className="mb-5 flex items-center gap-1.5 text-sm font-medium text-charcoal-500 hover:text-charcoal-800"
      >
        <ArrowLeft size={16} /> Back to History
      </button>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold text-charcoal-900">
            Prediction Report #{record.id}
          </h2>
          <p className="mt-1 text-sm text-charcoal-500">
            Recorded on {new Date(record.created_at).toLocaleString()}
          </p>
        </div>
      </div>

      <PredictionResult result={result} />
    </div>
  );
}
