import { Order, OrderStatus } from "@base-hub/domain";
import { Circle, CheckCircle2, XCircle, Clock, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, Button, AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@base-hub/ui";
import { StatusBadge, SideBadge } from "./StatusBadge";
import { useOrderStore } from "@base-hub/domain";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  order: Order | null;
  open: boolean;
  onClose: () => void;
}

const statusIcon = (s: OrderStatus) => {
  const cls = "h-3.5 w-3.5";
  switch (s) {
    case "open": return <Circle className={`${cls} text-primary`} />;
    case "partial": return <Clock className={`${cls} text-warning`} />;
    case "executed": return <CheckCircle2 className={`${cls} text-success`} />;
    case "cancelled": return <XCircle className={`${cls} text-destructive`} />;
  }
};

const statusColor = (s: OrderStatus) => {
  switch (s) {
    case "open": return "bg-primary/10 ring-primary/20";
    case "partial": return "bg-warning/10 ring-warning/20";
    case "executed": return "bg-success/10 ring-success/20";
    case "cancelled": return "bg-destructive/10 ring-destructive/20";
  }
};

const statusLabel = (s: OrderStatus) => {
  const map: Record<OrderStatus, string> = { open: "Aberta", partial: "Parcial", executed: "Executada", cancelled: "Cancelada" };
  return map[s];
};

const itemVariants = {
  hidden: { opacity: 0, x: -12, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      delay: i * 0.12,
      duration: 0.35,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  }),
};

const dotVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: (i: number) => ({
    scale: 1,
    opacity: 1,
    transition: {
      delay: i * 0.12,
      duration: 0.3,
      type: "spring" as const,
      stiffness: 300,
      damping: 20,
    },
  }),
};

const lineVariants = {
  hidden: { scaleY: 0 },
  visible: (i: number) => ({
    scaleY: 1,
    transition: {
      delay: i * 0.12 + 0.15,
      duration: 0.3,
      ease: "easeOut" as const,
    },
  }),
};

export function OrderDetailModal({ order, open, onClose }: Props) {
  const { cancelOrder } = useOrderStore();
  if (!order) return null;

  const canCancel = order.status === "open" || order.status === "partial";
  const formatDate = (iso: string) => new Date(iso).toLocaleString("pt-BR");

  const handleCancel = () => {
    cancelOrder(order.id);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="font-mono-data">{order.id}</span>
            <StatusBadge status={order.status} />
          </DialogTitle>
          <DialogDescription>Detalhes completos da ordem</DialogDescription>
        </DialogHeader>

        <motion.div
          className="grid grid-cols-2 gap-4 text-sm py-2"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div>
            <span className="text-muted-foreground text-xs">Instrumento</span>
            <p className="font-semibold">{order.instrument}</p>
          </div>
          <div>
            <span className="text-muted-foreground text-xs">Lado</span>
            <p><SideBadge side={order.side} /></p>
          </div>
          <div>
            <span className="text-muted-foreground text-xs">Preço</span>
            <p className="font-mono-data font-semibold">R$ {order.price.toFixed(2)}</p>
          </div>
          <div>
            <span className="text-muted-foreground text-xs">Quantidade</span>
            <p className="font-mono-data">{order.quantity}</p>
          </div>
          <div>
            <span className="text-muted-foreground text-xs">Qtd. Restante</span>
            <p className="font-mono-data">{order.remainingQuantity}</p>
          </div>
          <div>
            <span className="text-muted-foreground text-xs">Criada em</span>
            <p className="text-xs">{formatDate(order.createdAt)}</p>
          </div>
        </motion.div>

        <div className="border-t pt-4">
          <h4 className="text-xs font-semibold text-muted-foreground mb-4 uppercase tracking-wide">Histórico de Status</h4>
          <div className="relative max-h-56 overflow-y-auto pr-2">
            <AnimatePresence mode="wait">
              {order.statusHistory.map((h, i) => {
                const isLast = i === order.statusHistory.length - 1;
                const icon = statusIcon(h.to);
                const color = statusColor(h.to);
                return (
                  <motion.div
                    key={`${order.id}-${i}`}
                    className="flex gap-3 relative"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    custom={i}
                  >
                    {/* Timeline dot + line */}
                    <div className="flex flex-col items-center">
                      <motion.div
                        className={`rounded-full p-1.5 z-10 ring-2 ${color}`}
                        variants={dotVariants}
                        initial="hidden"
                        animate="visible"
                        custom={i}
                      >
                        {icon}
                      </motion.div>
                      {!isLast && (
                        <motion.div
                          className="w-px flex-1 bg-border min-h-[24px] origin-top"
                          variants={lineVariants}
                          initial="hidden"
                          animate="visible"
                          custom={i}
                        />
                      )}
                    </div>

                    {/* Content */}
                    <div className={`pb-5 ${isLast ? "pb-0" : ""} flex-1 min-w-0`}>
                      <div className="flex items-center gap-2 flex-wrap">
                        {h.from && (
                          <>
                            <span className="text-xs font-medium text-muted-foreground capitalize">{statusLabel(h.from)}</span>
                            <motion.span
                              initial={{ opacity: 0, x: -4 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.12 + 0.2 }}
                            >
                              <ArrowRight className="h-3 w-3 text-muted-foreground/60" />
                            </motion.span>
                          </>
                        )}
                        <StatusBadge status={h.to} />
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-1">{formatDate(h.timestamp)}</p>
                      {h.reason && (
                        <motion.p
                          className="text-[11px] text-muted-foreground/80 italic mt-0.5"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.12 + 0.25 }}
                        >
                          {h.reason}
                        </motion.p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {canCancel && (
          <motion.div
            className="border-t pt-4 flex justify-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">Cancelar Ordem</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar cancelamento</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja cancelar a ordem {order.id}? Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Voltar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleCancel} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Confirmar Cancelamento
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
}
