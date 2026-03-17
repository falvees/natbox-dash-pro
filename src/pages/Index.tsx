import { useState, useCallback, useEffect } from "react";
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
import { ImportSales } from "@/components/ImportSales";
import { getSalesForMonth, upsertSale, deleteSale } from "@/lib/salesStore";
import { getSalesForMonth, upsertSale, deleteSale } from "@/lib/salesStore";

const MARCH_2026_SEED = [
  { date: "2026-03-02", cash: 6.98, card: 559.89, ifood: 408.86 },
  { date: "2026-03-03", cash: 0, card: 1019.73, ifood: 1117.64 },
  { date: "2026-03-04", cash: 49.70, card: 1199.25, ifood: 275.79 },
  { date: "2026-03-05", cash: 0, card: 636.37, ifood: 1063.03 },
  { date: "2026-03-06", cash: 135.00, card: 923.85, ifood: 197.77 },
  { date: "2026-03-07", cash: 0, card: 436.95, ifood: 188.03 },
  { date: "2026-03-09", cash: 4.00, card: 1733.63, ifood: 413.75 },
  { date: "2026-03-10", cash: 21.00, card: 1267.30, ifood: 914.47 },
  { date: "2026-03-11", cash: 37.00, card: 968.83, ifood: 803.70 },
  { date: "2026-03-12", cash: 0, card: 1270.37, ifood: 735.20 },
  { date: "2026-03-13", cash: 47.00, card: 738.74, ifood: 565.13 },
  { date: "2026-03-14", cash: 20.00, card: 579.39, ifood: 333.66 },
  { date: "2026-03-16", cash: 85.00, card: 1446.62, ifood: 879.59 },
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

export default function Index() {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(2); // March
  const [, setTick] = useState(0);
  const refresh = useCallback(() => setTick((t) => t + 1), []);

  // Seed March 2026 data on first load
  useEffect(() => {
    const SEED_KEY = "natbox-march2026-seeded";
    if (!localStorage.getItem(SEED_KEY)) {
      MARCH_2026_SEED.forEach((e) => upsertSale(e));
      localStorage.setItem(SEED_KEY, "1");
      refresh();
    }
  }, [refresh]);

  const sales = getSalesForMonth(year, month);
  const totalRevenue = sales.reduce((s, e) => s + e.total, 0);
  const salesDays = sales.length;
  const dailyAverage = salesDays > 0 ? totalRevenue / salesDays : 0;
  const daysInMonth = getDaysInMonth(year, month);
  const projection = dailyAverage * daysInMonth;

  const isMarch2026View = year === 2026 && month === 2;

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

        {/* Import Section */}
        <ImportSales onImport={refresh} />

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
