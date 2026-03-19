import { useState, useCallback } from 'react';
import {
  OrderFilters as FiltersType,
  SortField,
  SortDirection,
  useOrderStore,
  fetchOrdersApi,
} from '@base-hub/domain';
import { SideBadge, StatusBadge } from './StatusBadge';
import { ArrowUpDown, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { Button } from '@base-hub/ui';
import { cn } from '@base-hub/ui';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  filters: FiltersType;
  onSelectOrder: (id: string) => void;
}

const columns: { key: SortField; label: string; align?: 'right' }[] = [
  { key: 'id', label: 'ID' },
  { key: 'instrument', label: 'Instrumento' },
  { key: 'side', label: 'Lado' },
  { key: 'price', label: 'Preço', align: 'right' },
  { key: 'quantity', label: 'Qtd.', align: 'right' },
  { key: 'remainingQuantity', label: 'Qtd. Rest.', align: 'right' },
  { key: 'status', label: 'Status' },
  { key: 'createdAt', label: 'Data/Hora' },
];

const rowVariants = {
  initial: { opacity: 0, x: -8 },
  animate: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.03, duration: 0.25, ease: 'easeOut' as const },
  }),
  exit: { opacity: 0, x: 8, transition: { duration: 0.15 } },
};

export function OrderDatagrid({ filters, onSelectOrder }: Props) {
  const orders = useOrderStore((s) => s.orders);
  const [sort, setSort] = useState<{ field: SortField; dir: SortDirection }>({
    field: 'createdAt',
    dir: 'desc',
  });
  const page = useOrderStore((s) => s.page);
  const setPage = useOrderStore((s) => s.setPage);
  const total = useOrderStore((s) => s.total);
  const limit = useOrderStore((s) => s.limit);
  const fetchOrders = useOrderStore((s) => s.fetchOrders);

  const totalPages = Math.ceil(total / limit);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;

    setPage(newPage);
  };

  const toggleSort = (field: SortField) => {
    const newDir = sort.field === field && sort.dir === 'asc' ? 'desc' : 'asc';

    setSort({ field, dir: newDir });
    setPage(0);

    fetchOrders({
      ...filters,
      sortBy: field,
      order: newDir,
      page: 1,
    });
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return (
      d.toLocaleDateString('pt-BR') +
      ' ' +
      d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    );
  };

  const statusLabel: Record<string, string> = {
    open: 'Aberta',
    partial: 'Parcial',
    executed: 'Executada',
    cancelled: 'Cancelada',
  };
  const sideLabel: Record<string, string> = { buy: 'Compra', sell: 'Venda' };

  const exportCsv = useCallback(async () => {
    try {
      const res = await fetchOrdersApi({
        ...filters,
        page: 1,
        limit: total, // ou usar total se quiser mais preciso
        sortBy: sort.field,
        order: sort.dir,
      });

      const header =
        'ID;Instrumento;Lado;Preço;Quantidade;Qtd. Restante;Status;Data/Hora';

      const rows = res.data.map((o) =>
        [
          o.id,
          o.instrument,
          sideLabel[o.side] ?? o.side,
          o.price.toFixed(2).replace('.', ','),
          o.quantity,
          o.remainingQuantity,
          statusLabel[o.status] ?? o.status,
          formatDate(o.createdAt),
        ].join(';'),
      );

      const csv = [header, ...rows].join('\n');

      const blob = new Blob(['\uFEFF' + csv], {
        type: 'text/csv;charset=utf-8;',
      });

      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `ordens_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Erro ao exportar CSV', err);
    }
  }, [filters, sort]);

  return (
    <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    'px-4 py-3 font-medium text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors duration-150',
                    col.align === 'right' && 'text-right',
                  )}
                  onClick={() => toggleSort(col.key)}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    <ArrowUpDown
                      className={cn(
                        'h-3 w-3 transition-colors',
                        sort.field === col.key
                          ? 'text-foreground'
                          : 'text-muted-foreground/40',
                      )}
                    />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <AnimatePresence mode="popLayout">
            <tbody>
              {orders.length === 0 ? (
                <motion.tr
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <td
                    colSpan={8}
                    className="px-4 py-12 text-center text-muted-foreground"
                  >
                    Nenhuma ordem encontrada.
                  </td>
                </motion.tr>
              ) : (
                orders.map((order, i) => (
                  <motion.tr
                    key={order.id}
                    variants={rowVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    custom={i}
                    layout
                    onClick={() => onSelectOrder(order.id)}
                    className={cn(
                      'border-b cursor-pointer hover:bg-accent/50 transition-colors duration-150',
                      i % 2 === 1 && 'bg-muted/30',
                    )}
                  >
                    <td className="px-4 py-3 font-mono text-xs font-medium">
                      {order.id}
                    </td>
                    <td className="px-4 py-3 font-semibold">
                      {order.instrument}
                    </td>
                    <td className="px-4 py-3">
                      <SideBadge side={order.side} />
                    </td>
                    <td className="px-4 py-3 text-right font-mono-data">
                      R$ {order.price.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono-data">
                      {order.quantity}
                    </td>
                    <td className="px-4 py-3 text-right font-mono-data">
                      {order.remainingQuantity}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {formatDate(order.createdAt)}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </AnimatePresence>
        </table>
      </div>
      <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/30">
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            {total} ordem(ns)
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={exportCsv}
            className="gap-1.5 h-7 text-xs"
          >
            <Download className="h-3 w-3" />
            Exportar CSV
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-xs text-muted-foreground">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
