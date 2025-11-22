import React from 'react';
import { useStore } from '../../store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { formatDate, cn } from '../../lib/utils';
import { ArrowUpRight, ArrowDownLeft, RefreshCw, AlertCircle } from 'lucide-react';

export const StockHistory = () => {
  const ledger = useStore((state) => state.ledger);

  const getIcon = (type: string) => {
    switch (type) {
      case 'RECEIPT': return <ArrowDownLeft className="w-5 h-5 text-green-600" />;
      case 'DELIVERY': return <ArrowUpRight className="w-5 h-5 text-blue-600" />;
      case 'TRANSFER': return <RefreshCw className="w-5 h-5 text-indigo-600" />;
      default: return <AlertCircle className="w-5 h-5 text-amber-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Movement History</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction Log</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-brand-dark/50 border-b border-white/5">
                <tr>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Reference</th>
                  <th className="px-6 py-3">Product</th>
                  <th className="px-6 py-3 text-right">Quantity</th>
                  <th className="px-6 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {ledger.map((entry) => (
                  <tr key={entry.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={cn("p-2 rounded-full bg-white/5", 
                          entry.type === 'RECEIPT' && "text-green-400",
                          entry.type === 'DELIVERY' && "text-blue-400",
                          entry.type === 'ADJUSTMENT' && "text-amber-400"
                        )}>
                          {getIcon(entry.type)}
                        </div>
                        <span className="font-medium text-white">{entry.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-500">{entry.reference}</td>
                    <td className="px-6 py-4 font-medium text-white">{entry.product?.name}</td>
                    <td className={cn("px-6 py-4 text-right font-bold", 
                      entry.quantity_change > 0 ? "text-brand-success" : "text-brand-danger"
                    )}>
                      {entry.quantity_change > 0 ? '+' : ''}{entry.quantity_change}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {formatDate(entry.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
