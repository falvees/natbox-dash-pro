import { useState, useRef } from "react";
import { Upload, FileJson, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { upsertSale } from "@/lib/salesStore";

const MARCH_2026_SAMPLE = [
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
  { date: "2026-03-16", cash: 85.00, card: 1446.62, ifood: 879.59 },
];

interface ImportSalesProps {
  onImport: () => void;
}

function parseCSV(text: string): { date: string; cash: number; card: number; ifood: number }[] {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];
  const header = lines[0].toLowerCase().split(",").map((h) => h.trim());
  const dateIdx = header.indexOf("date");
  const cashIdx = header.indexOf("cash");
  const cardIdx = header.indexOf("card");
  const ifoodIdx = header.indexOf("ifood");
  if (dateIdx === -1 || cashIdx === -1 || cardIdx === -1 || ifoodIdx === -1) return [];

  return lines.slice(1).filter(Boolean).map((line) => {
    const cols = line.split(",").map((c) => c.trim());
    return {
      date: cols[dateIdx],
      cash: parseFloat(cols[cashIdx]) || 0,
      card: parseFloat(cols[cardIdx]) || 0,
      ifood: parseFloat(cols[ifoodIdx]) || 0,
    };
  });
}

export function ImportSales({ onImport }: ImportSalesProps) {
  const [jsonText, setJsonText] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const importEntries = (entries: { date: string; cash: number; card: number; ifood: number }[]) => {
    if (!entries.length) {
      toast({ title: "Erro", description: "Nenhuma entrada válida encontrada.", variant: "destructive" });
      return;
    }
    entries.forEach((e) => upsertSale(e));
    onImport();
    toast({ title: "Importação concluída", description: `${entries.length} entradas importadas/atualizadas.` });
  };

  const handleJsonImport = () => {
    try {
      const parsed = JSON.parse(jsonText);
      const arr = Array.isArray(parsed) ? parsed : [parsed];
      importEntries(arr);
      setJsonText("");
    } catch {
      toast({ title: "JSON inválido", description: "Verifique o formato e tente novamente.", variant: "destructive" });
    }
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const entries = parseCSV(text);
      importEntries(entries);
    };
    reader.readAsText(file);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleLoadSample = () => {
    importEntries(MARCH_2026_SAMPLE);
  };

  return (
    <div className="bg-card rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 md:p-6 border-b border-border">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-primary" />
          <h3 className="font-display font-bold text-base text-foreground">Importar Dados de Vendas</h3>
        </div>
      </div>
      <div className="p-4 md:p-6 space-y-4">
        {/* JSON Paste */}
        <div>
          <Label className="text-sm font-medium text-muted-foreground">Colar JSON</Label>
          <Textarea
            placeholder='[{"date":"2026-03-01","cash":100,"card":200,"ifood":150}]'
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            className="mt-1 font-mono text-xs"
            rows={4}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={handleJsonImport} disabled={!jsonText.trim()} className="gap-2">
            <FileJson className="w-4 h-4" />
            Importar JSON
          </Button>

          {/* CSV Upload */}
          <Button variant="outline" className="gap-2" onClick={() => fileRef.current?.click()}>
            <Upload className="w-4 h-4" />
            Upload CSV
          </Button>
          <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleCSVUpload} />

          {/* Sample Loader */}
          <Button variant="secondary" className="gap-2" onClick={handleLoadSample}>
            <Database className="w-4 h-4" />
            Carregar Março 2026
          </Button>
        </div>
      </div>
    </div>
  );
}
