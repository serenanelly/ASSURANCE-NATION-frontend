"use client";

import { cn } from "@/utils/cn";
import { Card } from "@/components/common/Card";

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: { value: string; positive?: boolean };
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  className,
}: StatCardProps) {
  return (
    <Card padding="md" className={cn("relative overflow-hidden", className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-muted">{title}</p>
          <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
          {subtitle && (
            <p className="mt-1 text-sm text-muted">{subtitle}</p>
          )}
          {trend && (
            <p
              className={cn(
                "mt-2 text-xs font-medium",
                trend.positive ? "text-success" : "text-error"
              )}
            >
              {trend.value}
            </p>
          )}
        </div>
        {icon && (
          <div className="shrink-0 text-primary">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
