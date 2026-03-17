import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { SaleEntry } from "@/lib/salesStore";

interface ChannelChartProps {
  sales: SaleEntry[];
}

const CHANNELS = [
  { key: "cash", label: "Dinheiro", color: "hsl(38,92%,50%)" },
  { key: "card", label: "Cartão", color: "hsl(217,91%,60%)" },
  { key: "ifood", label: "iFood", color: "hsl(355,84%,52%)" },
] as const;

export function ChannelChart({ sales }: ChannelChartProps) {
  const totals = {
    cash: sales.reduce((s, e) => s + e.cash, 0),
    card: sales.reduce((s, e) => s + e.card, 0),
    ifood: sales.reduce((s, e) => s + e.ifood, 0),
  };

  const data = CHANNELS.map((c) => ({
    name: c.label,
    value: totals[c.key],
    color: c.color,
  })).filter((d) => d.value > 0);

  const grandTotal = totals.cash + totals.card + totals.ifood;

  if (data.length === 0) {
    return (
      <div className="bg-card rounded-lg p-6 shadow-sm">
        <h3 className="font-display font-bold text-base mb-4 text-foreground">Canais de Venda</h3>
        <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
          Nenhum dado registrado ainda
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg p-4 md:p-6 shadow-sm">
      <h3 className="font-display font-bold text-base mb-4 text-foreground">Canais de Venda</h3>
      <div className="flex items-center gap-4">
        <ResponsiveContainer width="50%" height={200}>
          <PieChart>
            <Pie data={data} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={80} strokeWidth={2}>
              {data.map((d, i) => (
                <Cell key={i} fill={d.color} stroke="hsl(0,0%,100%)" />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              contentStyle={{ borderRadius: 8, fontSize: 12 }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="space-y-3 flex-1">
          {CHANNELS.map((c) => {
            const val = totals[c.key];
            const pct = grandTotal > 0 ? ((val / grandTotal) * 100).toFixed(1) : "0";
            return (
              <div key={c.key} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: c.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">{c.label}</p>
                  <p className="text-sm font-semibold text-foreground">{pct}%</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
