import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@base-hub/ui';
import { OrderFilters as Filters, type OrderSide, type OrderStatus } from '@base-hub/domain';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';


interface Props {
  filters: Filters;
  onChange: (f: Filters) => void;
}

export function OrderFilters({ filters, onChange }: Props) {
  const [local, setLocal] = useState({
    id: filters.id,
    instrument: filters.instrument,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
  });

  const set = (partial: Partial<Filters>) =>
    onChange({ ...filters, ...partial });

  const debouncedChange = useDebouncedCallback((next: Partial<Filters>) => {
    onChange({ ...filters, ...next });
  }, 400);

  useEffect(() => {
    setLocal({
      id: filters.id,
      instrument: filters.instrument,
      dateFrom: filters.dateFrom,
      dateTo: filters.dateTo,
    });
  }, [filters.id, filters.instrument]);


  return (
    <div className="flex flex-wrap gap-3 items-end">
      <div className="space-y-1">
        <label htmlFor="order-id" className="text-xs font-medium text-muted-foreground">ID</label>
        <Input id="order-id" placeholder="ORD-0001" value={local.id} onChange={(e) => {
            const value = e.target.value;
            setLocal((prev) => ({ ...prev, id: value }));
            debouncedChange({ id: value });
          }} className="h-9 w-32" />
      </div>
      <div className="space-y-1">
        <label htmlFor="order-instrument" className="text-xs font-medium text-muted-foreground">Instrumento</label>
        <Input id="order-instrument" placeholder="PETR4" value={local.instrument} onChange={(e) => {
            const value = e.target.value;
            setLocal((prev) => ({ ...prev, instrument: value }));
            debouncedChange({ instrument: value });
          }} className="h-9 w-32" />
      </div>
      <div className="space-y-1">
        <label id="order-status-label" className="text-xs font-medium text-muted-foreground">Status</label>
        <Select aria-labelledby="order-status-label" value={filters.status} onValueChange={(v) => set({ status: v as OrderStatus | "all" })}>
          <SelectTrigger className="h-9 w-32"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="open">Aberta</SelectItem>
            <SelectItem value="partial">Parcial</SelectItem>
            <SelectItem value="executed">Executada</SelectItem>
            <SelectItem value="cancelled">Cancelada</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <label id="order-side-label" className="text-xs font-medium text-muted-foreground">Lado</label>
        <Select aria-labelledby="order-side-label" value={filters.side} onValueChange={(v) => set({ side: v as OrderSide | "all" })}>
          <SelectTrigger className="h-9 w-28"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="buy">Compra</SelectItem>
            <SelectItem value="sell">Venda</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <label id="order-date-from-label" className="text-xs font-medium text-muted-foreground">De</label>
        <Input aria-labelledby="order-date-from-label" type="date" value={local.dateFrom} onChange={(e) => {
            const value = e.target.value;
            setLocal((prev) => ({ ...prev, dateFrom: value }));
            debouncedChange({ dateFrom: value });
          }} className="h-9 w-36" />
      </div>
      <div className="space-y-1">
        <label id="order-date-to-label" className="text-xs font-medium text-muted-foreground">Até</label>
        <Input aria-labelledby="order-date-to-label" type="date" value={local.dateTo} onChange={(e) => {
            const value = e.target.value;
            setLocal((prev) => ({ ...prev, dateTo: value }));
            debouncedChange({ dateTo: value });
          }} className="h-9 w-36" />
      </div>
    </div>
  );
}
