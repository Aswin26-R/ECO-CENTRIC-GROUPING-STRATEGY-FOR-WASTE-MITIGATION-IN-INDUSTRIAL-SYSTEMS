import { AlertCircle, Eye, EyeOff, Recycle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { authApi } from "../services/api.js";

const DEMO_EMAIL = "demo@steelwaste.io";
const DEMO_PASSWORD = "demo1234";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const next = {};
    if (!email) next.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email address.";
    if (!password) next.password = "Password is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const doLogin = async (loginEmail, loginPassword) => {
    setServerError("");
    setLoading(true);
    try {
      const res = await authApi.login(loginEmail, loginPassword);
      login(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setServerError(err.friendlyMessage || "Unable to log in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    doLogin(email, password);
  };

  const handleDemoLogin = () => {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    doLogin(DEMO_EMAIL, DEMO_PASSWORD);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-charcoal-50 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-3 rounded-xl bg-forge-600 p-3 text-white">
            <Recycle size={26} />
          </div>
          <h1 className="font-display text-xl font-semibold text-charcoal-900">
            Eco-Centric Waste Management
          </h1>
          <p className="mt-1 text-sm text-charcoal-500">
            Pre-waste analytics for steel production
          </p>
        </div>

        <div className="card p-7">
          {serverError && (
            <div className="mb-4 flex items-start gap-2 rounded-lg border border-rust-500/30 bg-rust-500/5 px-3.5 py-3 text-sm text-rust-500">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-text">Email</label>
              <input
                type="email"
                className="input-field"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-rust-500">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="label-text">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="input-field pr-10"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-rust-500">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-charcoal-600">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="rounded border-charcoal-300 text-forge-600 focus:ring-forge-500"
                />
                Remember me
              </label>
            </div>

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? "Signing in…" : "Log In"}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs text-charcoal-400">
            <div className="h-px flex-1 bg-charcoal-100" />
            OR
            <div className="h-px flex-1 bg-charcoal-100" />
          </div>

          <button onClick={handleDemoLogin} className="btn-secondary w-full" disabled={loading}>
            Use Demo Login
          </button>
          <p className="mt-3 text-center text-xs text-charcoal-400">
            demo@steelwaste.io / demo1234
          </p>
        </div>
      </div>
    </div>
  );
}
