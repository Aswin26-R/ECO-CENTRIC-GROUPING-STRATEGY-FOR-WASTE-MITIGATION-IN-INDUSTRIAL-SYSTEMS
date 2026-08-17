import { AlertCircle } from "lucide-react";
import { useState } from "react";
import {
  MATERIAL_CATEGORIES,
  PROCESS_STAGES,
  PRODUCTION_PROCESSES,
  RAW_MATERIALS,
} from "../constants.js";

const initialState = {
  production_process: "",
  process_stage: "",
  production_quantity: "",
  raw_material: "",
  material_category: "",
  material_quantity: "",
};

export default function PredictionForm({ onSubmit, submitting }) {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});

  const update = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const validate = () => {
    const next = {};
    Object.entries(form).forEach(([key, value]) => {
      if (!value) next[key] = "This field is required.";
    });
    if (form.production_quantity && Number(form.production_quantity) <= 0) {
      next.production_quantity = "Must be greater than zero.";
    }
    if (form.material_quantity && Number(form.material_quantity) <= 0) {
      next.material_quantity = "Must be greater than zero.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      ...form,
      production_quantity: Number(form.production_quantity),
      material_quantity: Number(form.material_quantity),
    });
  };

  const Select = ({ field, label, options, tooltip }) => (
    <div>
      <label className="label-text" title={tooltip}>
        {label}
      </label>
      <select
        className="input-field"
        value={form[field]}
        onChange={(e) => update(field, e.target.value)}
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {errors[field] && (
        <p className="mt-1 flex items-center gap-1 text-xs text-rust-500">
          <AlertCircle size={12} /> {errors[field]}
        </p>
      )}
    </div>
  );

  const NumberInput = ({ field, label, tooltip, unit }) => (
    <div>
      <label className="label-text" title={tooltip}>
        {label} {unit && <span className="text-charcoal-400">({unit})</span>}
      </label>
      <input
        type="number"
        min="0"
        step="0.01"
        className="input-field"
        placeholder={`Enter ${label.toLowerCase()}`}
        value={form[field]}
        onChange={(e) => update(field, e.target.value)}
      />
      {errors[field] && (
        <p className="mt-1 flex items-center gap-1 text-xs text-rust-500">
          <AlertCircle size={12} /> {errors[field]}
        </p>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section>
        <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wide text-charcoal-500">
          Production Information
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            field="production_process"
            label="Production Process"
            options={PRODUCTION_PROCESSES}
            tooltip="The manufacturing process currently being planned or run."
          />
          <Select
            field="process_stage"
            label="Process Stage"
            options={PROCESS_STAGES}
            tooltip="The stage within the production process."
          />
          <NumberInput
            field="production_quantity"
            label="Production Quantity"
            unit="tons"
            tooltip="Planned production output for this batch."
          />
        </div>
      </section>

      <section>
        <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wide text-charcoal-500">
          Raw Material Information
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            field="raw_material"
            label="Raw Material Type"
            options={RAW_MATERIALS}
            tooltip="Primary raw material being consumed."
          />
          <Select
            field="material_category"
            label="Material Category"
            options={MATERIAL_CATEGORIES}
            tooltip="General category the raw material belongs to."
          />
          <NumberInput
            field="material_quantity"
            label="Material Quantity"
            unit="tons"
            tooltip="Amount of raw material to be consumed."
          />
        </div>
      </section>

      <button type="submit" className="btn-primary w-full sm:w-auto" disabled={submitting}>
        {submitting ? "Analyzing Production Data…" : "Analyze Waste"}
      </button>
    </form>
  );
}
