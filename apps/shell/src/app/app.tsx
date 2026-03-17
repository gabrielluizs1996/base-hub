import * as React from 'react';
import { Route, Routes } from 'react-router-dom';
import { SidebarNav } from '../components/SidebarNav';
import { Menu } from 'lucide-react';

const Order = React.lazy(() => import('order/Module'));

export function App() {
  const [, setCreateOpen] = React.useState(false);

  return (
    <React.Suspense fallback={null}>
      <div className="flex min-h-screen">
        <SidebarNav onNewOrder={() => setCreateOpen(true)} />

        <main className="flex-1 flex flex-col min-w-0">
          <header className="h-14 border-b bg-card flex items-center justify-between px-4 lg:px-6 shrink-0">
            <div className="flex items-center gap-3">
              <button
                className="md:hidden"
                // onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="h-5 w-5" />
              </button>
              <h1 className="text-lg font-semibold">Gerenciamento de Ordens</h1>
            </div>
            {/* <Button
              onClick={() => setCreateOpen(true)}
              size="sm"
              className="gap-1.5"
            >
              <PlusCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Nova Ordem</span>
            </Button> */}
          </header>
          <Routes>
            {/* <Route path="/" element={<Order />} /> */}
            <Route path="/order" element={<Order />} />
          </Routes>
        </main>
      </div>
    </React.Suspense>
  );
}

export default App;
