import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { SaleEntry } from "@/lib/salesStore";

interface RevenueChartProps {
  sales: SaleEntry[];
}

export function RevenueChart({ sales }: RevenueChartProps) {
  const data = sales.map((s) => {
    const [, m, d] = s.date.split("-");
    return {
      date: `${d}/${m}`,
      total: s.total,
      cash: s.cash,
      card: s.card,
      ifood: s.ifood,
    };
  });

  if (data.length === 0) {
    return (
      <div className="bg-card rounded-lg p-6 shadow-sm">
        <h3 className="font-display font-bold text-base mb-4 text-foreground">Receita por Dia</h3>
        <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
          Nenhum dado registrado ainda
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg p-4 md:p-6 shadow-sm">
      <h3 className="font-display font-bold text-base mb-4 text-foreground">Receita por Dia</h3>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(160,84%,39%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(160,84%,39%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(214,32%,91%)" />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(215,16%,47%)" />
          <YAxis tick={{ fontSize: 11 }} stroke="hsl(215,16%,47%)" />
          <Tooltip
            formatter={(value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            contentStyle={{ borderRadius: 8, border: "1px solid hsl(214,32%,91%)", fontSize: 12 }}
          />
          <Area type="monotone" dataKey="total" stroke="hsl(160,84%,39%)" fill="url(#totalGrad)" strokeWidth={2.5} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
