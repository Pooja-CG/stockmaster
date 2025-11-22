import React, { useState, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { ClipboardList, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';

export const Adjustments = () => {
  const [isCreating, setIsCreating] = useState(false);
  const createDocument = useStore(state => state.createDocument);
  const addItem = useStore(state => state.addItemToDocument);
  const updateStatus = useStore(state => state.updateDocumentStatus);
  
  const products = useStore(state => state.products);
  const allDocuments = useStore(state => state.documents);
  
  const documents = useMemo(() => 
    allDocuments.filter(d => d.type === 'ADJUSTMENT'), 
  [allDocuments]);

  const [ref, setRef] = useState('');
  const [currentDocId, setCurrentDocId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [qty, setQty] = useState(0);

  const handleCreate = async () => {
    if (!ref) return;
    const id = await createDocument('ADJUSTMENT', ref);
    setCurrentDocId(id);
    setIsCreating(true);
  };

  const handleAddItem = async () => {
    if (currentDocId && selectedProduct) {
      await addItem(currentDocId, selectedProduct, qty);
      setQty(0);
    }
  };

  const handleValidate = async () => {
    if (currentDocId) {
      await updateStatus(currentDocId, 'DONE');
      setIsCreating(false);
      setRef('');
      setCurrentDocId(null);
    }
  };

  const currentDoc = useMemo(() => 
    allDocuments.find(d => d.id === currentDocId), 
  [allDocuments, currentDocId]);

  const currentItems = currentDoc?.items || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Stock Adjustments</h1>
        {!isCreating && (
          <button 
            onClick={() => setIsCreating(true)}
            className="bg-brand-gold hover:bg-amber-500 text-brand-dark font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <ClipboardList className="w-4 h-4" />
            New Adjustment
          </button>
        )}
      </div>

      {isCreating ? (
        <div className="bg-brand-primary border border-white/10 rounded-xl p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Adjustment Reference</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={ref}
                  onChange={(e) => setRef(e.target.value)}
                  className="bg-brand-dark border border-white/10 rounded-lg px-4 py-2 text-white w-full focus:ring-2 focus:ring-brand-blue outline-none"
                  placeholder="ADJ-2025-001"
                  disabled={!!currentDocId}
                />
                {!currentDocId && (
                  <button onClick={handleCreate} className="bg-brand-blue px-4 rounded-lg text-white">Start</button>
                )}
              </div>
            </div>
          </div>

          {currentDocId && (
            <>
              <div className="border-t border-white/10 pt-6">
                <h3 className="text-lg font-semibold text-white mb-4">Correct Stock Levels</h3>
                <div className="flex gap-4 items-end bg-brand-dark/50 p-4 rounded-lg border border-white/5">
                  <div className="flex-1">
                    <label className="block text-xs text-slate-500 mb-1">Product</label>
                    <select 
                      className="w-full bg-brand-primary border border-white/10 rounded-lg px-4 py-2 text-white outline-none"
                      value={selectedProduct}
                      onChange={(e) => setSelectedProduct(e.target.value)}
                    >
                      <option value="">Select Product...</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name} (Current: {p.current_stock})</option>
                      ))}
                    </select>
                  </div>
                  <div className="w-32">
                    <label className="block text-xs text-slate-500 mb-1">Qty Change (+/-)</label>
                    <input 
                      type="number" 
                      value={qty}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setQty(isNaN(val) ? 0 : val);
                      }}
                      className="w-full bg-brand-primary border border-white/10 rounded-lg px-4 py-2 text-white outline-none"
                      placeholder="+10 or -5"
                    />
                  </div>
                  <button 
                    onClick={handleAddItem}
                    className="bg-brand-gold hover:bg-amber-500 text-brand-dark font-semibold px-4 py-2 rounded-lg transition-colors"
                  >
                    Add Correction
                  </button>
                </div>
              </div>

              <div className="bg-brand-dark rounded-lg p-4">
                <p className="text-sm text-slate-400 mb-2">Pending Corrections:</p>
                {currentItems.length === 0 && <p className="text-slate-600 text-sm italic">No items added yet.</p>}
                {currentItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between py-2 border-b border-white/5 last:border-0">
                    <span className="text-white">{item.product?.name || 'Unknown'}</span>
                    <span className={cn("font-mono", item.quantity > 0 ? "text-brand-success" : "text-brand-danger")}>
                      {item.quantity > 0 ? '+' : ''}{item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button onClick={() => setIsCreating(false)} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
                <button 
                  onClick={handleValidate}
                  className="bg-brand-danger hover:bg-red-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-medium shadow-lg shadow-brand-danger/20"
                >
                  <AlertTriangle className="w-4 h-4" />
                  Commit Adjustments
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="bg-brand-primary border border-white/5 rounded-xl overflow-hidden">
          <table className="w-full text-sm text-left text-slate-400">
            <thead className="text-xs uppercase bg-brand-dark/50 text-slate-300">
              <tr>
                <th className="px-6 py-4">Reference</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Items Corrected</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {documents.length === 0 ? (
                 <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">No adjustments found.</td></tr>
              ) : (
                documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{doc.reference}</td>
                    <td className="px-6 py-4">{new Date(doc.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4">{doc.items?.length || 0}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium border",
                        doc.status === 'DONE' ? "bg-brand-success/10 text-brand-success border-brand-success/20" : "bg-slate-700 text-slate-300 border-slate-600"
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
      )}
    </div>
  );
};
