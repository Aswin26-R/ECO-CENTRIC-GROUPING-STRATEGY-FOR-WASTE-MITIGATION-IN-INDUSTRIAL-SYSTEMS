import { AlertTriangle, Eye, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "../components/DataTable.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import { CATEGORY_STYLES, PRIORITY_STYLES } from "../constants.js";
import { predictionApi } from "../services/api.js";

const CATEGORY_OPTIONS = ["Recyclable", "Reusable", "Hazardous", "Treatable"];
const PER_PAGE = 8;

export default function History() {
  const [predictions, setPredictions] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  const load = async (opts = {}) => {
    setLoading(true);
    setError("");
    try {
      const res = await predictionApi.list({
        page: opts.page ?? page,
        per_page: PER_PAGE,
        search: opts.search ?? search,
        category: opts.category ?? category,
      });
      setPredictions(res.data.predictions);
      setTotal(res.data.total);
      setPages(res.data.pages || 1);
    } catch (err) {
      setError(err.friendlyMessage || "Unable to load prediction history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load({ page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    load({ page: 1 });
  };

  const handleCategoryChange = (value) => {
    setCategory(value);
    setPage(1);
    load({ page: 1, category: value });
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    load({ page: newPage });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this prediction record? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await predictionApi.remove(id);
      load({ page });
    } catch (err) {
      setError(err.friendlyMessage || "Unable to delete this prediction.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold text-charcoal-900">Prediction History</h2>
          <p className="mt-1 text-sm text-charcoal-500">{total} total records</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400" />
            <input
              type="text"
              placeholder="Search waste type, process…"
              className="input-field pl-9 sm:w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>

          <select
            className="input-field sm:w-44"
            value={category}
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            <option value="">All categories</option>
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-rust-500/30 bg-rust-500/5 px-3.5 py-3 text-sm text-rust-500">
          <AlertTriangle size={16} /> {error}
        </div>
      )}

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <LoadingSpinner label="Loading history…" />
        </div>
      ) : (
        <>
          <DataTable
            columns={["ID", "Date", "Process", "Waste Type", "Category", "Confidence", "Priority", "Actions"]}
            emptyMessage="No predictions yet. Run your first waste analysis to see results here."
          >
            {predictions.map((p) => (
              <tr key={p.id} className="hover:bg-charcoal-50/60">
                <td className="px-4 py-3 font-mono text-xs text-charcoal-500">#{p.id}</td>
                <td className="whitespace-nowrap px-4 py-3 text-charcoal-500">
                  {new Date(p.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-charcoal-800">{p.production_process}</td>
                <td className="px-4 py-3 font-medium text-charcoal-900">{p.predicted_waste_type}</td>
                <td className="px-4 py-3">
                  <span className={`badge ${CATEGORY_STYLES[p.waste_category] || CATEGORY_STYLES.Unclassified}`}>
                    {p.waste_category}
                  </span>
                </td>
                <td className="px-4 py-3 text-charcoal-600">{(p.confidence * 100).toFixed(1)}%</td>
                <td className="px-4 py-3">
                  <span className={`badge ${PRIORITY_STYLES[p.priority] || PRIORITY_STYLES.Medium}`}>
                    {p.priority}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/history/${p.id}`)}
                      className="rounded-lg p-1.5 text-charcoal-500 hover:bg-charcoal-100"
                      title="View details"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      disabled={deletingId === p.id}
                      className="rounded-lg p-1.5 text-rust-500 hover:bg-rust-500/10 disabled:opacity-50"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </DataTable>

          {predictions.length === 0 && !error && (
            <div className="card flex flex-col items-center gap-3 p-10 text-center">
              <p className="text-charcoal-500">No predictions yet.</p>
              <p className="text-sm text-charcoal-400">
                Run your first waste analysis to see results here.
              </p>
              <Link to="/prediction" className="btn-primary">
                Start Prediction
              </Link>
            </div>
          )}

          {pages > 1 && (
            <div className="flex items-center justify-center gap-2">
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={`h-8 w-8 rounded-lg text-sm font-medium ${
                    p === page
                      ? "bg-forge-600 text-white"
                      : "text-charcoal-600 hover:bg-charcoal-100"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
