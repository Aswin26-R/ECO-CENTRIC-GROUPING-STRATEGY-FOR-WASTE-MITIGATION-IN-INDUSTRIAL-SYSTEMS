import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PredictionForm from "../components/PredictionForm.jsx";
import { predictionApi } from "../services/api.js";

export default function Prediction() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (payload) => {
    setError("");
    setSubmitting(true);
    try {
      const res = await predictionApi.save(payload);
      navigate("/result", { state: { result: res.data.prediction } });
    } catch (err) {
      setError(err.friendlyMessage || "Unable to analyze the data. Please check your inputs and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h2 className="font-display text-xl font-semibold text-charcoal-900">Waste Prediction</h2>
        <p className="mt-1 text-sm text-charcoal-500">
          Enter upcoming production and raw-material details to receive a pre-waste classification
          and recommendation before the waste is generated.
        </p>
      </div>

      {error && (
        <div className="mb-5 flex items-start gap-2 rounded-lg border border-rust-500/30 bg-rust-500/5 px-3.5 py-3 text-sm text-rust-500">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="card p-6">
        <PredictionForm onSubmit={handleSubmit} submitting={submitting} />
      </div>
    </div>
  );
}
