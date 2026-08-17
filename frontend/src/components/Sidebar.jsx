import {
  FlaskConical,
  History,
  Info,
  LayoutDashboard,
  Recycle,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/prediction", label: "New Prediction", icon: FlaskConical },
  { to: "/history", label: "History", icon: History },
  { to: "/about", label: "About Project", icon: Info },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-charcoal-900/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed z-40 flex h-full w-64 flex-col border-r border-charcoal-100 bg-white transition-transform lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-forge-600 p-2 text-white">
              <Recycle size={18} />
            </div>
            <div>
              <p className="font-display text-sm font-semibold leading-none text-charcoal-900">
                EcoGrouping
              </p>
              <p className="text-xs text-charcoal-400">Steel Waste Prototype</p>
            </div>
          </div>
          <button className="lg:hidden" onClick={onClose} aria-label="Close menu">
            <X size={18} className="text-charcoal-500" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-forge-50 text-forge-700"
                    : "text-charcoal-600 hover:bg-charcoal-50"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-charcoal-100 px-5 py-4 text-xs text-charcoal-400">
          Pre-waste analytics prototype
          <br />
          Linear Discriminant Analysis
        </div>
      </aside>
    </>
  );
}
