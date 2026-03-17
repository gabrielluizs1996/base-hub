import * as React from 'react';
import { SidebarNav } from '../components/SidebarNav';
import { Route, Routes } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '../components/Header';

const Order = React.lazy(() => import('order/Module'));

export function App() {
  const [, setCreateOpen] = React.useState(false);

  return (
    <React.Suspense fallback={null}>
      <div className="flex min-h-screen">
        <SidebarNav onNewOrder={() => setCreateOpen(true)} />

        <motion.main
          className="bg-card flex-1 flex flex-col min-w-0"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <Header onNewOrder={() => setCreateOpen(true)} title="Gerenciamento de Ordens" />
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Order />} />
            </Routes>
          </AnimatePresence>
        </motion.main>
      </div>
    </React.Suspense>
  );
}

export default App;
