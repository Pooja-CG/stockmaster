import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ArrowDownLeft, 
  ArrowUpRight, 
  RefreshCw, 
  ClipboardList,
  Settings,
  LogOut,
  Hexagon
} from 'lucide-react';
import { cn } from '../../lib/utils';

export const Sidebar = () => {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', to: '/' },
    { icon: Package, label: 'Products', to: '/products' },
    { icon: ArrowDownLeft, label: 'Receipts', to: '/receipts' },
    { icon: ArrowUpRight, label: 'Deliveries', to: '/deliveries' },
    { icon: RefreshCw, label: 'Transfers', to: '/transfers' },
    { icon: ClipboardList, label: 'Adjustments', to: '/adjustments' },
  ];

  return (
    <aside className="w-64 bg-brand-dark border-r border-white/10 flex flex-col h-screen fixed left-0 top-0 z-50">
      {/* Logo Area */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-white/10">
        <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center text-white shadow-lg shadow-brand-blue/20">
          <Hexagon className="w-5 h-5 fill-current" />
        </div>
        <span className="font-bold text-xl text-white tracking-wide">StockMaster</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-brand-blue text-white shadow-lg shadow-brand-blue/20 translate-x-1" 
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-white/10 bg-brand-primary/50">
        <div className="flex items-center gap-3 mb-4">
          <img 
            src="https://i.pravatar.cc/150?u=admin" 
            alt="Admin" 
            className="w-10 h-10 rounded-full border-2 border-brand-gold"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Alex Morgan</p>
            <p className="text-xs text-slate-400 truncate">Warehouse Mgr</p>
          </div>
        </div>
        <button className="flex items-center gap-2 text-slate-400 hover:text-white text-sm w-full px-2 py-1 rounded hover:bg-white/5 transition-colors">
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};
