import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Search, Plus, Pencil, Trash2, X, Save } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Database } from '../../types/supabase';

export const ProductList = () => {
  const products = useStore((state) => state.products);
  const addProduct = useStore((state) => state.addProduct);
  const updateProduct = useStore((state) => state.updateProduct);
  const deleteProduct = useStore((state) => state.deleteProduct);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<Partial<Database['public']['Tables']['products']['Insert']>>({
    name: '',
    sku: '',
    category: '',
    current_stock: 0,
    min_stock_threshold: 10,
    price: 0,
    unit: 'pcs'
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      name: '',
      sku: '',
      category: '',
      current_stock: 0,
      min_stock_threshold: 10,
      price: 0,
      unit: 'pcs'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: any) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      sku: product.sku,
      category: product.category,
      current_stock: product.current_stock,
      min_stock_threshold: product.min_stock_threshold,
      price: product.price,
      unit: product.unit
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updateProduct(editingId, formData);
    } else {
      await addProduct(formData as any);
    }
    setIsModalOpen(false);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper to handle number inputs safely
  const handleNumberChange = (field: keyof typeof formData, value: string, isFloat = false) => {
    const num = isFloat ? parseFloat(value) : parseInt(value);
    setFormData({ ...formData, [field]: isNaN(num) ? 0 : num });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Products</h1>
        <Button onClick={handleOpenAdd} className="bg-brand-blue hover:bg-blue-600">
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-brand-primary border border-white/10 rounded-xl p-6 w-full max-w-2xl shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">
                {editingId ? 'Edit Product' : 'New Product'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label="Product Name"
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                required 
              />
              <Input 
                label="SKU / Code"
                value={formData.sku} 
                onChange={e => setFormData({...formData, sku: e.target.value})} 
                required 
              />
              <Input 
                label="Category"
                value={formData.category || ''} 
                onChange={e => setFormData({...formData, category: e.target.value})} 
              />
              <Input 
                label="Unit (e.g., kg, pcs)"
                value={formData.unit || ''} 
                onChange={e => setFormData({...formData, unit: e.target.value})} 
              />
              <Input 
                label="Initial Stock"
                type="number" 
                value={formData.current_stock} 
                onChange={e => handleNumberChange('current_stock', e.target.value)}
                disabled={!!editingId} // Prevent manual stock edit, use adjustments
              />
              <Input 
                label="Min Stock Alert"
                type="number" 
                value={formData.min_stock_threshold} 
                onChange={e => handleNumberChange('min_stock_threshold', e.target.value)}
              />
              <Input 
                label="Price"
                type="number" 
                step="0.01"
                value={formData.price} 
                onChange={e => handleNumberChange('price', e.target.value, true)}
              />
              
              <div className="md:col-span-2 flex justify-end gap-3 mt-4 pt-4 border-t border-white/10">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-brand-blue">
                  <Save className="w-4 h-4 mr-2" />
                  Save Product
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-brand-primary border border-white/5 rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-white/5 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search products by Name or SKU..." 
              className="w-full bg-brand-dark border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-2 focus:ring-brand-blue outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-400">
            <thead className="text-xs uppercase bg-brand-dark/50 text-slate-300">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">SKU</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4 text-right">Stock</th>
                <th className="px-6 py-4 text-right">Price</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{product.name}</td>
                  <td className="px-6 py-4 font-mono text-slate-500">{product.sku}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded text-xs bg-white/5 text-slate-300 border border-white/5">
                      {product.category}
                    </span>
                  </td>
                  <td className={cn("px-6 py-4 text-right font-medium", 
                    product.current_stock <= product.min_stock_threshold ? "text-brand-danger" : "text-brand-success"
                  )}>
                    {product.current_stock} {product.unit}
                  </td>
                  <td className="px-6 py-4 text-right text-slate-300">
                    ${product.price?.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleOpenEdit(product)}
                        className="p-2 hover:bg-brand-blue/20 text-slate-400 hover:text-brand-blue rounded-lg transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-2 hover:bg-brand-danger/20 text-slate-400 hover:text-brand-danger rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
