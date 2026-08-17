import { AlertTriangle, Layers, Recycle, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Link } from "react-router-dom";
import ChartCard from "../components/ChartCard.jsx";
import DataTable from "../components/DataTable.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import StatCard from "../components/StatCard.jsx";
import { CATEGORY_STYLES } from "../constants.js";
import { dashboardApi, predictionApi } from "../services/api.js";

const PIE_COLORS = ["#2f8f5c", "#a8622f", "#767f7e", "#c07a4a", "#4bab76", "#5a6362", "#78c797", "#454d4c"];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const [statsRes, chartsRes, recentRes] = await Promise.all([
          dashboardApi.stats(),
          dashboardApi.charts(),
          predictionApi.list({ page: 1, per_page: 6 }),
        ]);
        if (!mounted) return;
        setStats(statsRes.data.stats);
        setCharts(chartsRes.data.charts);
        setRecent(recentRes.data.predictions);
      } catch (err) {
        setError(err.friendlyMessage || "Unable to load dashboard data.");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoadingSpinner label="Loading dashboard…" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="card flex items-center gap-2 p-5 text-rust-500">
        <AlertTriangle size={18} /> {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Predictions" value={stats.total_predictions} icon={Layers} accent="forge" />
        <StatCard label="Recyclable Waste" value={stats.recyclable_waste} icon={Recycle} accent="forge" />
        <StatCard label="Hazardous Waste" value={stats.hazardous_waste} icon={AlertTriangle} accent="rust" />
        <StatCard label="High Priority" value={stats.high_priority_waste} icon={TrendingUp} accent="charcoal" />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <ChartCard title="Waste Type Distribution" subtitle="By predicted waste type">
          {charts.waste_type_distribution.length === 0 ? (
            <EmptyChart />
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={charts.waste_type_distribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={85}
                  label={({ name }) => name}
                >
                  {charts.waste_type_distribution.map((entry, index) => (
                    <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Recommendation Distribution" subtitle="Management strategies applied">
          {charts.recommendation_distribution.length === 0 ? (
            <EmptyChart />
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={charts.recommendation_distribution} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e6e8e8" />
                <XAxis type="number" allowDecimals={false} stroke="#767f7e" fontSize={12} />
                <YAxis type="category" dataKey="name" width={0} tick={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#2f8f5c" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Predictions Over Time" subtitle="Daily prediction volume">
          {charts.predictions_over_time.length === 0 ? (
            <EmptyChart />
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={charts.predictions_over_time}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e6e8e8" />
                <XAxis dataKey="date" stroke="#767f7e" fontSize={11} />
                <YAxis allowDecimals={false} stroke="#767f7e" fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#2f8f5c" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      <div className="card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-base font-semibold text-charcoal-900">Recent Predictions</h3>
          <Link to="/history" className="text-sm font-medium text-forge-700 hover:underline">
            View all
          </Link>
        </div>
        <DataTable
          columns={["Date", "Process", "Waste Type", "Category", "Recommendation", "Status"]}
          emptyMessage="No predictions yet. Run your first waste analysis to see results here."
        >
          {recent.map((p) => (
            <tr key={p.id}>
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
              <td className="max-w-xs truncate px-4 py-3 text-charcoal-500">{p.recommendation}</td>
              <td className="px-4 py-3">
                <span className="badge border border-forge-200 bg-forge-50 text-forge-700">Saved</span>
              </td>
            </tr>
          ))}
        </DataTable>
      </div>
    </div>
  );
}

function EmptyChart() {
  return (
    <div className="flex h-60 items-center justify-center text-sm text-charcoal-400">
      No data yet — run a prediction to populate this chart.
    </div>
  );
}
