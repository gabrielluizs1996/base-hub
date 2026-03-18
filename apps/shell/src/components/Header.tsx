import { Button, useTheme } from "@base-hub/ui";
import { Menu, Moon, PlusCircle, Sun } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from "react";

interface HeaderProps {
  onNewOrder: () => void;
  title?: string;
}

export function Header({ onNewOrder, title }: HeaderProps) {
  const { theme, toggle: toggleTheme } = useTheme();
  const [, setCreateOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="h-14 bg-card border-b flex items-center justify-between px-4 lg:px-6 shrink-0">
        <div className="flex items-center gap-3">
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-lg text-muted-foreground font-semibold">{title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9 overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.25 }}
                className="flex items-center justify-center text-muted-foreground"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </motion.span>
            </AnimatePresence>
          </Button>
          <Button onClick={() => { setCreateOpen(true); onNewOrder?.(); }} size="sm" className="gap-1.5">
            <PlusCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Nova Ordem</span>
          </Button>
        </div>
      </header>
  );
}
