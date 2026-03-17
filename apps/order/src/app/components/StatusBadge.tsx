import { OrderStatus, OrderSide } from "@base-hub/domain";
import { Badge } from "@base-hub/ui";

const statusConfig: Record<OrderStatus, { label: string; variant: "success" | "warning" | "destructive" | "muted" | "default" }> = {
  open: { label: "Aberta", variant: "default" },
  partial: { label: "Parcial", variant: "warning" },
  executed: { label: "Executada", variant: "success" },
  cancelled: { label: "Cancelada", variant: "destructive" },
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  const cfg = statusConfig[status];
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}

export function SideBadge({ side }: { side: OrderSide }) {
  return (
    <span className={side === "buy" ? "font-semibold text-success" : "font-semibold text-destructive"}>
      {side === "buy" ? "Compra" : "Venda"}
    </span>
  );
}
