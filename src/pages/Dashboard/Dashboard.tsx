import React, { useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { StatCard } from '../../components/ui/StatCard';
import { Package, AlertTriangle, ArrowDownLeft, ArrowUpRight, RefreshCw } from 'lucide-react';
import { cn } from '../../lib/utils';

export const Dashboard = () => {
  // FIX: Select raw state to prevent getSnapshot loops
  const products = useStore((state) => state.products);
  const documents = useStore((state) => state.documents);

  // FIX: Calculate derived stats using useMemo
  const stats = useMemo(() => {
    return {
      totalProducts: products.length,
      lowStock: products.filter(p => p.current_stock <= p.min_stock_threshold).length,
      pendingReceipts: documents.filter(d => d.type === 'RECEIPT' && d.status !== 'DONE').length,
      pendingDeliveries: documents.filter(d => d.type === 'DELIVERY' && d.status !== 'DONE').length,
      transfers: documents.filter(d => d.type === 'TRANSFER' && d.status === 'WAITING').length,
    };
  }, [products, documents]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 mt-1">Real-time inventory overview</p>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard 
          title="Total Products" 
          value={stats.totalProducts} 
          icon={Package} 
          color="blue"
        />
        <StatCard 
          title="Low Stock" 
          value={stats.lowStock} 
          icon={AlertTriangle} 
          color="red"
        />
        <StatCard 
          title="Pending Receipts" 
          value={stats.pendingReceipts} 
          icon={ArrowDownLeft} 
          color="gold"
        />
        <StatCard 
          title="To Deliver" 
          value={stats.pendingDeliveries} 
          icon={ArrowUpRight} 
          color="blue"
        />
        <StatCard 
          title="Transfers" 
          value={stats.transfers} 
          icon={RefreshCw} 
          color="green"
        />
      </div>

      {/* Recent Activity Table Preview */}
      <div className="bg-brand-primary border border-white/5 rounded-xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h3 className="font-semibold text-white">Recent Documents</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-400">
            <thead className="text-xs uppercase bg-brand-dark/50 text-slate-300">
              <tr>
                <th className="px-6 py-4">Reference</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {documents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    No recent activity. Start by creating a Receipt.
                  </td>
                </tr>
              ) : (
                documents.slice(0, 5).map((doc) => (
                  <tr key={doc.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{doc.reference}</td>
                    <td className="px-6 py-4">{doc.type}</td>
                    <td className="px-6 py-4">{new Date(doc.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium border",
                        doc.status === 'DONE' ? "bg-brand-success/10 text-brand-success border-brand-success/20" :
                        doc.status === 'WAITING' ? "bg-brand-gold/10 text-brand-gold border-brand-gold/20" :
                        "bg-slate-700 text-slate-300 border-slate-600"
                      )}>
                        {doc.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
