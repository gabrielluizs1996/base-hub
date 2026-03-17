import { motion } from 'framer-motion';
import { OrderFilters as OrderFilterTypes, useOrderStore } from '@base-hub/domain';
import { useCallback, useEffect, useState } from 'react';
import { OrderFilters } from './components/OrderFilters';
import { OrderDatagrid } from './components/OrderDatagrid';

const defaultFilters: OrderFilterTypes = {
  id: "",
  instrument: "",
  status: "all",
  side: "all",
  dateFrom: "",
  dateTo: "",
};

export function App() {
  const { loadMock } = useOrderStore();
  const [filters, setFilters] = useState<OrderFilterTypes>(defaultFilters);
  const [_selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  
  // const selectedOrder = selectedOrderId ? getOrder(selectedOrderId) ?? null : null;
  
  const handleSelectOrder = useCallback((id: string) => setSelectedOrderId(id), []);
  
  useEffect(() => {
    loadMock();
  }, [loadMock]);

  return (
    <>
     <div className="flex-1 p-4 lg:p-6 space-y-4 overflow-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <OrderFilters filters={filters} onChange={setFilters} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.35 }}
        >
          <span>Teste</span>
          <OrderDatagrid filters={filters} onSelectOrder={handleSelectOrder} />
        </motion.div>
      </div>
    </>
  );
}

export default App;
