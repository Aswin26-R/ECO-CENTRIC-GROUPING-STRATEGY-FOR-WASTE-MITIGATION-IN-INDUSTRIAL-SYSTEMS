// Must mirror backend/train_model.py reference lists so form submissions
// match categories the LDA model was trained on.
export const PRODUCTION_PROCESSES = [
  "Electric Arc Furnace",
  "Basic Oxygen Furnace",
  "Continuous Casting",
  "Hot Rolling",
  "Cold Rolling",
  "Galvanizing",
  "Forging",
  "Finishing & Grinding",
];

export const RAW_MATERIALS = [
  "Scrap Steel",
  "Iron Ore",
  "Coke",
  "Limestone",
  "Alloy Additives",
  "Zinc Coating Material",
];

export const PROCESS_STAGES = ["Melting", "Refining", "Casting", "Rolling", "Coating", "Finishing"];

export const MATERIAL_CATEGORIES = [
  "Ferrous Metal",
  "Non-Ferrous Metal",
  "Flux Material",
  "Fuel/Reductant",
  "Coating Material",
];

export const CATEGORY_STYLES = {
  Recyclable: "bg-forge-50 text-forge-700 border border-forge-200",
  Reusable: "bg-forge-50 text-forge-700 border border-forge-200",
  Hazardous: "bg-rust-500/10 text-rust-500 border border-rust-500/30",
  Treatable: "bg-amber-50 text-amber-700 border border-amber-200",
  Unclassified: "bg-charcoal-100 text-charcoal-600 border border-charcoal-200",
};

export const PRIORITY_STYLES = {
  High: "bg-rust-500/10 text-rust-500 border border-rust-500/30",
  Medium: "bg-amber-50 text-amber-700 border border-amber-200",
  Low: "bg-forge-50 text-forge-700 border border-forge-200",
};
