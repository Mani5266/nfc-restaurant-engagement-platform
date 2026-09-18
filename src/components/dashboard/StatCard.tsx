import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: LucideIcon;
  color: string;
}

export default function StatCard({ label, value, change, trend, icon: Icon, color }: StatCardProps) {
  return (
    <div className="bg-warm-white rounded-2xl border border-border-light p-5 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        {change && (
          <span
            className={`text-xs font-semibold font-body px-2 py-0.5 rounded-full ${
              trend === "up"
                ? "text-emerald-700 bg-emerald-50"
                : trend === "down"
                  ? "text-red-700 bg-red-50"
                  : "text-warm-gray bg-gray-50"
            }`}
          >
            {trend === "up" ? "↑" : trend === "down" ? "↓" : "—"} {change}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-charcoal font-body">{value}</p>
      <p className="text-warm-gray text-xs mt-1 font-body">{label}</p>
    </div>
  );
}
