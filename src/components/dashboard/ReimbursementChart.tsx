"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Card } from "@/components/common/Card";
import { formatCurrency } from "@/lib/formatters";
import type { MonthlyStat } from "@/types";

const PIE_COLORS = ["#0066CC", "#00AA44", "#f59e0b", "#ef4444", "#8b5cf6"];

interface ReimbursementChartProps {
  monthlyData: MonthlyStat[];
  specialtyData: Record<string, { montant: number; taux: number }>;
}

export function ReimbursementChart({
  monthlyData,
  specialtyData,
}: ReimbursementChartProps) {
  const lineData = monthlyData.map((item) => ({
    mois: item.mois,
    montant: item.montant,
    count: item.count,
  }));

  const pieData = Object.entries(specialtyData).map(([name, stat]) => ({
    name,
    value: stat.montant,
  }));

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card title="Remboursements par mois" padding="md">
        {lineData.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted">
            Aucune donnée disponible
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
              <XAxis dataKey="mois" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}€`} />
              <Tooltip
                formatter={(value) => [
                  formatCurrency(Number(value ?? 0)),
                  "Montant",
                ]}
                labelFormatter={(label) => `Mois : ${label}`}
              />
              <Line
                type="monotone"
                dataKey="montant"
                stroke="#0066CC"
                strokeWidth={2}
                dot={{ fill: "#0066CC" }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Card>

      <Card title="Répartition par spécialité" padding="md">
        {pieData.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted">
            Aucune donnée disponible
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`
                }
              >
                {pieData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={PIE_COLORS[index % PIE_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => formatCurrency(Number(value ?? 0))}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </Card>
    </div>
  );
}
