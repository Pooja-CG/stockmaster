import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ArrowDownCircle, ArrowUpCircle, RefreshCw, ClipboardCheck, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

type OperationType = 'RECEIPT' | 'DELIVERY' | 'ADJUSTMENT' | 'TRANSFER';

export const Operations = () => {
  const [activeTab, setActiveTab] = useState<OperationType>('RECEIPT');
  
  const products = useStore((state) => state.products);
  const createDocument = useStore((state) => state.createDocument);
  const addItemToDocument = useStore((state) => state.addItemToDocument);
  const validateDocument = useStore((state) => state.validateDocument);
  
  // Form State
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [reference, setReference] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !quantity) return;

    setIsSubmitting(true);

    try {
      // 1. Create Document
      const ref = reference || `QUICK-${activeTab}-${Date.now().toString().slice(-6)}`;
      const docId = await createDocument(activeTab, ref);

      if (docId) {
        // 2. Add Item
        await addItemToDocument(docId, selectedProduct, parseInt(quantity));

        // 3. Validate (Commit Stock)
        await validateDocument(docId);

        setSuccessMsg(`${activeTab} Processed Successfully!`);
        setQuantity('');
        setReference('');
        setSelectedProduct('');
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (error) {
      console.error("Operation failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    { id: 'RECEIPT', label: 'Receipt (In)', icon: ArrowDownCircle, color: 'text-green-600' },
    { id: 'DELIVERY', label: 'Delivery (Out)', icon: ArrowUpCircle, color: 'text-blue-600' },
    { id: 'ADJUSTMENT', label: 'Adjustment', icon: ClipboardCheck, color: 'text-amber-600' },
    { id: 'TRANSFER', label: 'Transfer', icon: RefreshCw, color: 'text-indigo-600' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">Quick Operations</h1>
        <p className="text-slate-400">Process single-item movements instantly</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as OperationType)}
            className={cn(
              "flex flex-col items-center justify-center p-6 rounded-xl border transition-all duration-200",
              activeTab === tab.id 
                ? "bg-brand-primary border-brand-blue shadow-lg shadow-brand-blue/20" 
                : "bg-brand-primary/50 border-white/5 hover:bg-brand-primary hover:border-white/10"
            )}
          >
            <tab.icon className={cn("w-8 h-8 mb-3", tab.color)} />
            <span className={cn("font-semibold text-sm", activeTab === tab.id ? "text-white" : "text-slate-400")}>
              {tab.label}
            </span>
          </button>
        ))}
      </div>

      <Card className="border-t-4 border-t-brand-blue">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {activeTab === 'RECEIPT' && "Incoming Stock Receipt"}
            {activeTab === 'DELIVERY' && "Outgoing Delivery Order"}
            {activeTab === 'ADJUSTMENT' && "Stock Quantity Adjustment"}
            {activeTab === 'TRANSFER' && "Internal Warehouse Transfer"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {successMsg && (
              <div className="p-4 bg-brand-success/10 text-brand-success rounded-lg border border-brand-success/20 flex items-center">
                <ClipboardCheck className="w-5 h-5 mr-2" />
                {successMsg}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">Select Product</label>
                <select 
                  className="w-full h-10 rounded-lg border border-white/10 bg-brand-dark px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  required
                >
                  <option value="">-- Choose Product --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (Curr: {p.current_stock})</option>
                  ))}
                </select>
              </div>

              <Input 
                label="Reference / PO Number" 
                placeholder="Auto-generated if empty"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
              />

              <Input 
                label={activeTab === 'ADJUSTMENT' ? "Adjustment Amount (+/-)" : "Quantity"}
                type="number" 
                placeholder="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />

              <div className="space-y-2">
                 <label className="block text-sm font-medium text-slate-300">Date</label>
                 <input 
                  type="date" 
                  className="w-full h-10 rounded-lg border border-white/10 bg-brand-dark px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-blue" 
                  defaultValue={new Date().toISOString().split('T')[0]} 
                 />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit" size="lg" className="w-full md:w-auto min-w-[200px] bg-brand-blue" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Confirm {activeTab === 'RECEIPT' ? 'Receipt' : activeTab === 'DELIVERY' ? 'Delivery' : 'Adjustment'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
