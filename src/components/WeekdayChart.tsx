import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { SaleEntry } from "@/lib/salesStore";

interface WeekdayChartProps {
  sales: SaleEntry[];
}

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export function WeekdayChart({ sales }: WeekdayChartProps) {
  const weekdayTotals = Array(7).fill(0);
  const weekdayCounts = Array(7).fill(0);

  sales.forEach((s) => {
    const day = new Date(s.date + "T12:00:00").getDay();
    weekdayTotals[day] += s.total;
    weekdayCounts[day]++;
  });

  const data = WEEKDAYS.map((name, i) => ({
    name,
    media: weekdayCounts[i] > 0 ? Math.round(weekdayTotals[i] / weekdayCounts[i]) : 0,
  }));

  if (sales.length === 0) {
    return (
      <div className="bg-card rounded-lg p-6 shadow-sm">
        <h3 className="font-display font-bold text-base mb-4 text-foreground">Desempenho por Dia da Semana</h3>
        <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
          Nenhum dado registrado ainda
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg p-4 md:p-6 shadow-sm">
      <h3 className="font-display font-bold text-base mb-4 text-foreground">Desempenho por Dia da Semana</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(214,32%,91%)" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(215,16%,47%)" />
          <YAxis tick={{ fontSize: 11 }} stroke="hsl(215,16%,47%)" />
          <Tooltip
            formatter={(value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            contentStyle={{ borderRadius: 8, fontSize: 12 }}
          />
          <Bar dataKey="media" fill="hsl(160,84%,39%)" radius={[6, 6, 0, 0]} name="Média" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
