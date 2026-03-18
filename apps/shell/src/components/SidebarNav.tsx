import { BarChart3, ListOrdered, PlusCircle } from "lucide-react";
import { cn } from "@base-hub/ui";

interface SidebarNavProps {
  onNewOrder: () => void;
}

export function SidebarNav({ onNewOrder }: SidebarNavProps) {
  return (
    <aside className="hidden md:flex w-16 lg:w-56 flex-col bg-nav text-nav-foreground min-h-screen">
      <div className="flex items-center gap-2 px-4 h-14 border-b border-sidebar-border">
        <BarChart3 className="h-6 w-6 text-primary shrink-0" />
        <span className="hidden lg:block text-sm font-bold tracking-wide">BASE Exchange</span>
      </div>
      <nav className="flex-1 py-4 space-y-1 px-2">
        <button className={cn("flex items-center gap-3 w-full rounded px-3 py-2 text-sm font-medium bg-sidebar-accent text-sidebar-accent-foreground")}>
          <ListOrdered className="h-4 w-4 shrink-0" />
          <span className="hidden lg:block">Ordens</span>
        </button>
        <button
          onClick={onNewOrder}
          className="flex items-center gap-3 w-full rounded px-3 py-2 text-sm font-medium text-nav-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors duration-150"
        >
          <PlusCircle className="h-4 w-4 shrink-0" />
          <span className="hidden lg:block">Nova Ordem</span>
        </button>
      </nav>
    </aside>
  );
}
