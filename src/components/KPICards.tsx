import { DollarSign, TrendingUp, Calendar, BarChart3 } from "lucide-react";

interface KPICardsProps {
  totalRevenue: number;
  dailyAverage: number;
  projection: number;
  salesDays: number;
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const kpis = [
  { key: "totalRevenue", label: "Receita do Mês", icon: DollarSign, accent: "text-primary" },
  { key: "dailyAverage", label: "Média Diária", icon: TrendingUp, accent: "text-channel-card" },
  { key: "projection", label: "Projeção Mensal", icon: BarChart3, accent: "text-primary" },
  { key: "salesDays", label: "Dias de Venda", icon: Calendar, accent: "text-channel-cash" },
] as const;

export function KPICards({ totalRevenue, dailyAverage, projection, salesDays }: KPICardsProps) {
  const values: Record<string, string> = {
    totalRevenue: formatCurrency(totalRevenue),
    dailyAverage: formatCurrency(dailyAverage),
    projection: formatCurrency(projection),
    salesDays: String(salesDays),
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, i) => (
        <div
          key={kpi.key}
          className="bg-card rounded-lg p-4 md:p-6 shadow-sm animate-fade-up"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <div className="flex items-center gap-2 mb-2">
            <kpi.icon className={`w-4 h-4 ${kpi.accent}`} />
            <span className="text-xs md:text-sm text-muted-foreground font-medium">{kpi.label}</span>
          </div>
          <p className="font-display font-bold text-xl md:text-2xl lg:text-3xl text-foreground">
            {values[kpi.key]}
          </p>
        </div>
      ))}
    </div>
  );
}
