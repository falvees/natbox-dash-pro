import { useState, useEffect, useRef } from "react";
import { Database, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { upsertSale } from "@/lib/salesStore";

interface NotionSyncProps {
  onSync: () => void;
}

export function NotionSync({ onSync }: NotionSyncProps) {
  const [loading, setLoading] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(
    () => localStorage.getItem("natbox-notion-last-sync")
  );
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const autoSyncedRef = useRef(false);

  const handleSync = async (silent = false) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("sync-notion-sales", {
        body: {},
      });

      if (fnError) throw new Error(fnError.message);
      if (data?.error) throw new Error(data.error);

      const sales = (data?.sales ?? []) as { date: string; cash: number; card: number; ifood: number }[];
      sales.forEach((s) => upsertSale(s));

      const now = new Date().toISOString();
      localStorage.setItem("natbox-notion-last-sync", now);
      setLastSync(now);
      onSync();
      toast({
        title: "Sincronização concluída",
        description: `${sales.length} venda(s) atualizadas a partir do Notion.`,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido";
      setError(msg);
      if (!silent) toast({ title: "Falha ao sincronizar", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoSyncedRef.current) return;
    autoSyncedRef.current = true;
    handleSync(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatLastSync = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
  };

  return (
    <div className="bg-card rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 md:p-6 border-b border-border">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-primary" />
            <h3 className="font-display font-bold text-base text-foreground">Integração Notion</h3>
          </div>
          <Button onClick={handleSync} disabled={loading} className="gap-2">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Sincronizando..." : "Sincronizar com Notion"}
          </Button>
        </div>
      </div>
      <div className="p-4 md:p-6 space-y-3 text-sm">
        {lastSync && !error && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            Última sincronização: {formatLastSync(lastSync)}
          </div>
        )}
        {error && (
          <div className="flex items-start gap-2 text-destructive">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        <p className="text-muted-foreground">
          Os dados são lidos do banco <strong>Vendas Natbox</strong> no Notion. O token fica
          armazenado de forma segura no backend e nunca é exposto no navegador.
        </p>
        <p className="text-xs text-muted-foreground">
          Se aparecer erro de permissão, abra o banco no Notion → ••• → <strong>Connections</strong> →
          adicione a integração <strong>Painel Natbox</strong>.
        </p>
      </div>
    </div>
  );
}
