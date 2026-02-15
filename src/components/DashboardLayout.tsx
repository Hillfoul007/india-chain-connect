import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import {
  Wallet, Truck, BarChart3, MessageSquare, Home, LogOut, User, Link as LinkIcon, Menu, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const navItems = [
  { path: "/dashboard", icon: Home, label: "Overview" },
  { path: "/dashboard/wallet", icon: Wallet, label: "DID Wallet" },
  { path: "/dashboard/logistics", icon: Truck, label: "Logistics" },
  { path: "/dashboard/credit", icon: BarChart3, label: "Credit Score" },
  { path: "/dashboard/chat", icon: MessageSquare, label: "AI Assistant" },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, role, signOut } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-background/80 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <LinkIcon className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold text-sidebar-foreground">
              India<span className="text-gradient-saffron">Chain</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary font-medium"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
              <User className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sidebar-foreground text-xs truncate">{user?.email}</p>
              <p className="text-muted-foreground text-xs capitalize">{role}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground" onClick={signOut}>
            <LogOut className="w-4 h-4 mr-2" /> Sign out
          </Button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 h-14 bg-background/80 backdrop-blur border-b border-border flex items-center px-4 md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </Button>
          <span className="ml-3 font-display font-bold">IndiaChain</span>
        </header>
        <main className="flex-1 p-4 md:p-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
