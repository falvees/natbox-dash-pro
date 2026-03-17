import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SaleForm } from "@/components/SaleForm";
import type { SaleEntry } from "@/lib/salesStore";

interface SalesHistoryProps {
  sales: SaleEntry[];
  onEdit: (data: { date: string; cash: number; card: number; ifood: number }) => void;
  onDelete: (id: string) => void;
}

function fmt(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function SalesHistory({ sales, onEdit, onDelete }: SalesHistoryProps) {
  const sorted = [...sales].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="bg-card rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 md:p-6 border-b border-border">
        <h3 className="font-display font-bold text-base text-foreground">Histórico de Vendas</h3>
      </div>
      {sorted.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground text-sm">
          Nenhuma venda registrada
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs">Data</th>
                <th className="text-right px-3 py-3 font-semibold text-xs text-channel-cash">Dinheiro</th>
                <th className="text-right px-3 py-3 font-semibold text-xs text-channel-card">Cartão</th>
                <th className="text-right px-3 py-3 font-semibold text-xs text-channel-ifood">iFood</th>
                <th className="text-right px-3 py-3 font-semibold text-xs text-foreground">Total</th>
                <th className="px-3 py-3 w-20"></th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((s) => (
                <tr key={s.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">
                    {new Date(s.date + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                  </td>
                  <td className="text-right px-3 py-3 text-muted-foreground">{fmt(s.cash)}</td>
                  <td className="text-right px-3 py-3 text-muted-foreground">{fmt(s.card)}</td>
                  <td className="text-right px-3 py-3 text-muted-foreground">{fmt(s.ifood)}</td>
                  <td className="text-right px-3 py-3 font-semibold text-foreground">{fmt(s.total)}</td>
                  <td className="px-3 py-3">
                    <div className="flex gap-1 justify-end">
                      <SaleForm
                        initialData={{ date: s.date, cash: s.cash, card: s.card, ifood: s.ifood }}
                        onSubmit={onEdit}
                        trigger={
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                        }
                      />
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => onDelete(s.id)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
