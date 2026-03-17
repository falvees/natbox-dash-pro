import { useState, useCallback } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KPICards } from "@/components/KPICards";
import { SaleForm } from "@/components/SaleForm";
import { RevenueChart } from "@/components/RevenueChart";
import { ChannelChart } from "@/components/ChannelChart";
import { WeekdayChart } from "@/components/WeekdayChart";
import { SalesHistory } from "@/components/SalesHistory";
import { getSalesForMonth, upsertSale, deleteSale } from "@/lib/salesStore";

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

export default function Index() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [, setTick] = useState(0);
  const refresh = useCallback(() => setTick((t) => t + 1), []);

  const sales = getSalesForMonth(year, month);
  const totalRevenue = sales.reduce((s, e) => s + e.total, 0);
  const salesDays = sales.length;
  const dailyAverage = salesDays > 0 ? totalRevenue / salesDays : 0;
  const daysInMonth = getDaysInMonth(year, month);
  const projection = dailyAverage * daysInMonth;

  const prevMonth = () => {
    if (month === 0) { setYear(year - 1); setMonth(11); }
    else setMonth(month - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setYear(year + 1); setMonth(0); }
    else setMonth(month + 1);
  };

  const handleAdd = (data: { date: string; cash: number; card: number; ifood: number }) => {
    upsertSale(data);
    refresh();
  };

  const handleDelete = (id: string) => {
    deleteSale(id);
    refresh();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-30">
        <div className="container max-w-6xl mx-auto flex items-center justify-between py-3 px-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="font-display font-bold text-lg text-foreground">Natbox Saudáveis</h1>
          </div>
          <div className="hidden sm:block">
            <SaleForm onSubmit={handleAdd} />
          </div>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Month Navigation */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={prevMonth}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h2 className="font-display font-bold text-lg capitalize text-foreground">
            {format(new Date(year, month), "MMMM yyyy", { locale: ptBR })}
          </h2>
          <Button variant="ghost" size="icon" onClick={nextMonth}>
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* KPIs */}
        <KPICards
          totalRevenue={totalRevenue}
          dailyAverage={dailyAverage}
          projection={projection}
          salesDays={salesDays}
        />

        {/* Charts */}
        <RevenueChart sales={sales} />

        <div className="grid md:grid-cols-2 gap-4">
          <ChannelChart sales={sales} />
          <WeekdayChart sales={sales} />
        </div>

        {/* History */}
        <SalesHistory sales={sales} onEdit={handleAdd} onDelete={handleDelete} />
      </main>

      {/* Mobile FAB */}
      <div className="fixed bottom-6 right-6 sm:hidden z-40">
        <SaleForm onSubmit={handleAdd} />
      </div>
    </div>
  );
}
