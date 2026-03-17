import { AlertTriangle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export function MissingDayWarning() {
  return (
    <Alert className="border-amber-500/50 bg-amber-50 dark:bg-amber-950/20">
      <AlertTriangle className="h-4 w-4 !text-amber-600" />
      <AlertTitle className="text-amber-800 dark:text-amber-400 font-display font-bold">
        Dado incompleto
      </AlertTitle>
      <AlertDescription className="text-amber-700 dark:text-amber-300">
        14 de março de 2026 ainda não possui detalhamento por canal. Total conhecido: <strong>R$ 933,00</strong>
      </AlertDescription>
    </Alert>
  );
}
