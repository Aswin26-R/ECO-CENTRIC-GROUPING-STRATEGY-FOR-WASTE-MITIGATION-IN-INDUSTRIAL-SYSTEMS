import { CheckCircle2, Cpu, Database, Layers, Target, XCircle } from "lucide-react";

const disadvantages = [
  "Manual waste auditing is time-consuming and labor-intensive.",
  "Traditional methods are prone to human error, leading to inaccurate results.",
  "Pinpointing and organizing the correct disposal process takes significant time.",
  "Accumulating different waste types leads to environmental and legal complications.",
  "There is a risk of inadvertently mixing different waste types during disposal.",
];

const advantages = [
  "Streamlines the process by offering pre-identified waste management solutions.",
  "Saves time and money compared to conventional post-production waste audits.",
  "Minimizes human error and reduces environmental hazards.",
  "Cost-effective, with an environmentally friendly approach.",
  "Delivers greater efficiency than traditional waste auditing methods.",
];

const stack = [
  { group: "Frontend", items: ["React.js", "Vite", "Tailwind CSS", "Axios", "React Router", "Recharts"] },
  { group: "Backend", items: ["Python", "Flask", "Flask-CORS", "REST API"] },
  { group: "Machine Learning", items: ["scikit-learn", "Linear Discriminant Analysis", "pandas", "NumPy"] },
  { group: "Database", items: ["MySQL", "SQLAlchemy"] },
];

export default function About() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-forge-700">About the Project</p>
        <h2 className="mt-1 font-display text-2xl font-semibold text-charcoal-900">
          Eco-Centric Grouping Strategy for Waste Mitigation in Industrial Systems
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-charcoal-600">
          Traditional waste auditing in the steel industry is a slow, manual, post-production
          process that can take 7–10 days from the moment waste is generated. This prototype
          demonstrates a pre-waste management approach: it analyzes raw-material and production
          information <em>before</em> waste is generated, and uses a Linear Discriminant Analysis
          model to classify the likely waste type and recommend a management strategy —
          reducing the time, cost, and environmental risk associated with conventional auditing.
        </p>
      </div>

      <section className="card p-6">
        <div className="mb-3 flex items-center gap-2">
          <Target size={18} className="text-forge-600" />
          <h3 className="font-display text-base font-semibold text-charcoal-900">Objective</h3>
        </div>
        <p className="text-sm leading-relaxed text-charcoal-600">
          Move waste management from a reactive, post-production audit toward a proactive,
          pre-production prediction — identifying probable waste types, categories, and
          appropriate reuse, recycling, treatment, or disposal strategies before manufacturing
          begins.
        </p>
      </section>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <section className="card p-6">
          <div className="mb-3 flex items-center gap-2">
            <XCircle size={18} className="text-rust-500" />
            <h3 className="font-display text-base font-semibold text-charcoal-900">
              Existing System — Disadvantages
            </h3>
          </div>
          <ul className="space-y-2 text-sm text-charcoal-600">
            {disadvantages.map((d) => (
              <li key={d} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rust-500" />
                {d}
              </li>
            ))}
          </ul>
        </section>

        <section className="card p-6">
          <div className="mb-3 flex items-center gap-2">
            <CheckCircle2 size={18} className="text-forge-600" />
            <h3 className="font-display text-base font-semibold text-charcoal-900">
              Proposed System — Advantages
            </h3>
          </div>
          <ul className="space-y-2 text-sm text-charcoal-600">
            {advantages.map((a) => (
              <li key={a} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-forge-600" />
                {a}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="card p-6">
        <div className="mb-3 flex items-center gap-2">
          <Cpu size={18} className="text-forge-600" />
          <h3 className="font-display text-base font-semibold text-charcoal-900">ML Algorithm</h3>
        </div>
        <p className="text-sm leading-relaxed text-charcoal-600">
          The prediction engine uses <strong>Linear Discriminant Analysis (LDA)</strong>, as
          specified in the source project document, to classify production/raw-material inputs
          into a predicted waste type. The pipeline: data cleaning → feature selection →
          one-hot / numeric encoding → train/test split → LDA training → evaluation (accuracy,
          precision, recall, F1, confusion matrix) → prediction API.
        </p>
      </section>

      <section className="card p-6">
        <div className="mb-3 flex items-center gap-2">
          <Layers size={18} className="text-forge-600" />
          <h3 className="font-display text-base font-semibold text-charcoal-900">Technology Stack</h3>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {stack.map((s) => (
            <div key={s.group}>
              <p className="text-xs font-semibold uppercase tracking-wide text-charcoal-500">{s.group}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {s.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-md border border-charcoal-200 bg-charcoal-50 px-2 py-1 text-xs text-charcoal-700"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="card p-6">
        <div className="mb-3 flex items-center gap-2">
          <Database size={18} className="text-forge-600" />
          <h3 className="font-display text-base font-semibold text-charcoal-900">Future Enhancements</h3>
        </div>
        <ul className="space-y-2 text-sm text-charcoal-600">
          <li className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-charcoal-400" />
            Train on real industrial production and waste-audit records once available.
          </li>
          <li className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-charcoal-400" />
            Extend to multi-view / semi-supervised classification as discussed in the source document.
          </li>
          <li className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-charcoal-400" />
            Replace the static recommendation rules with a learned or configurable rule engine.
          </li>
        </ul>
      </section>

      <p className="text-center text-xs text-charcoal-400">
        Academic prototype — dataset is synthetic and clearly labeled as demo data. Implementation
        choices not specified in the source document are noted as prototype assumptions throughout
        the codebase and README.
      </p>
    </div>
  );
}
