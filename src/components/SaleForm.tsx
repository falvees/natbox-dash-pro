import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface SaleFormProps {
  onSubmit: (data: { date: string; cash: number; card: number; ifood: number }) => void;
  initialData?: { date: string; cash: number; card: number; ifood: number };
  trigger?: React.ReactNode;
}

export function SaleForm({ onSubmit, initialData, trigger }: SaleFormProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(
    initialData ? new Date(initialData.date + "T12:00:00") : new Date()
  );
  const [cash, setCash] = useState(initialData?.cash?.toString() ?? "");
  const [card, setCard] = useState(initialData?.card?.toString() ?? "");
  const [ifood, setIfood] = useState(initialData?.ifood?.toString() ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;
    onSubmit({
      date: format(date, "yyyy-MM-dd"),
      cash: parseFloat(cash) || 0,
      card: parseFloat(card) || 0,
      ifood: parseFloat(ifood) || 0,
    });
    setOpen(false);
    if (!initialData) {
      setCash("");
      setCard("");
      setIfood("");
      setDate(new Date());
    }
  };

  const defaultTrigger = (
    <Button size="lg" className="gap-2 font-display font-semibold shadow-md">
      <Plus className="w-5 h-5" />
      Adicionar Venda
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger ?? defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">
            {initialData ? "Editar Venda" : "Nova Venda Diária"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Data</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal mt-1",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "dd 'de' MMMM, yyyy", { locale: ptBR }) : "Selecione a data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-xs font-semibold text-channel-cash">Dinheiro (R$)</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                value={cash}
                onChange={(e) => setCash(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-channel-card">Cartão (R$)</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                value={card}
                onChange={(e) => setCard(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-channel-ifood">iFood (R$)</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                value={ifood}
                onChange={(e) => setIfood(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div className="bg-secondary rounded-lg p-3 text-center">
            <span className="text-xs text-muted-foreground">Total</span>
            <p className="font-display font-bold text-xl text-primary">
              {((parseFloat(cash) || 0) + (parseFloat(card) || 0) + (parseFloat(ifood) || 0)).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </p>
          </div>

          <Button type="submit" className="w-full font-display font-semibold">
            {initialData ? "Salvar Alterações" : "Registrar Venda"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
