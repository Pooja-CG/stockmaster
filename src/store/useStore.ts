import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';

type Product = Database['public']['Tables']['products']['Row'];
type Document = Database['public']['Tables']['documents']['Row'] & { items?: DocumentItem[] };
type DocumentItem = Database['public']['Tables']['document_items']['Row'] & { product?: Product };
type LedgerEntry = Database['public']['Tables']['ledger']['Row'] & { product?: Product };

interface StoreState {
  user: any | null;
  products: Product[];
  documents: Document[];
  ledger: LedgerEntry[];
  isLoading: boolean;
  
  // Auth
  checkSession: () => Promise<void>;
  logout: () => Promise<void>;

  // Data Fetching & Realtime
  fetchData: () => Promise<void>;
  subscribeToChanges: () => void;
  unsubscribe: () => void;
  
  // Product Actions
  addProduct: (product: Database['public']['Tables']['products']['Insert']) => Promise<void>;
  updateProduct: (id: string, updates: Database['public']['Tables']['products']['Update']) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;

  // Document Actions
  createDocument: (type: Document['type'], reference: string) => Promise<string | null>;
  addItemToDocument: (docId: string, productId: string, qty: number) => Promise<void>;
  updateDocumentStatus: (docId: string, status: Document['status']) => Promise<void>;
  validateDocument: (docId: string) => Promise<void>;
}

export const useStore = create<StoreState>((set, get) => ({
  user: null,
  products: [],
  documents: [],
  ledger: [],
  isLoading: false,

  checkSession: async () => {
    const { data } = await supabase.auth.getSession();
    set({ user: data.session?.user || null });
    if (data.session?.user) {
      get().fetchData();
      get().subscribeToChanges();
    }
  },

  logout: async () => {
    await supabase.auth.signOut();
    get().unsubscribe();
    set({ user: null, products: [], documents: [], ledger: [] });
  },

  fetchData: async () => {
    set({ isLoading: true });
    
    const [productsRes, documentsRes, ledgerRes] = await Promise.all([
      supabase.from('products').select('*').order('name'),
      supabase.from('documents').select('*, items:document_items(*, product:products(*))').order('created_at', { ascending: false }),
      supabase.from('ledger').select('*, product:products(*)').order('created_at', { ascending: false }).limit(50)
    ]);

    set({
      products: productsRes.data || [],
      documents: (documentsRes.data as any) || [],
      ledger: (ledgerRes.data as any) || [],
      isLoading: false
    });
  },

  subscribeToChanges: () => {
    const channels = supabase
      .channel('custom-all-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => get().fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'documents' }, () => get().fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'document_items' }, () => get().fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ledger' }, () => get().fetchData())
      .subscribe();
  },

  unsubscribe: () => {
    supabase.removeAllChannels();
  },

  addProduct: async (product) => {
    await supabase.from('products').insert(product);
  },

  updateProduct: async (id, updates) => {
    await supabase.from('products').update(updates).eq('id', id);
  },

  deleteProduct: async (id) => {
    await supabase.from('products').delete().eq('id', id);
  },

  createDocument: async (type, reference) => {
    const { data, error } = await supabase
      .from('documents')
      .insert({ type, reference, status: 'DRAFT' })
      .select()
      .single();
    
    if (error) {
      console.error(error);
      return null;
    }
    return data.id;
  },

  addItemToDocument: async (docId, productId, qty) => {
    await supabase.from('document_items').insert({
      document_id: docId,
      product_id: productId,
      quantity: qty
    });
  },

  updateDocumentStatus: async (docId, status) => {
    await supabase.from('documents').update({ status }).eq('id', docId);
  },

  validateDocument: async (docId) => {
    // The actual stock logic is handled by Database Triggers (Supabase)
    // We just set the status to DONE, and the DB trigger should handle the rest if configured.
    // However, for robustness in this demo, we will also execute the logic client-side if triggers aren't set up,
    // BUT since we are using a real DB now, we should rely on the DB or do it manually here.
    // Let's do it manually here to be safe, as I cannot guarantee the user ran the triggers SQL.
    
    const state = get();
    const doc = state.documents.find(d => d.id === docId);
    if (!doc || !doc.items) return;

    // 1. Update Status
    await supabase.from('documents').update({ status: 'DONE' }).eq('id', docId);

    // 2. Update Stock (Manual Fallback if Triggers fail)
    for (const item of doc.items) {
      const product = state.products.find(p => p.id === item.product_id);
      if (!product) continue;

      let change = 0;
      if (doc.type === 'RECEIPT') change = item.quantity;
      if (doc.type === 'DELIVERY') change = -item.quantity;
      if (doc.type === 'ADJUSTMENT') change = item.quantity; // Assumes input is +/-
      
      if (change !== 0) {
        // Update Product
        await supabase.from('products').update({
          current_stock: product.current_stock + change
        }).eq('id', product.id);

        // Add Ledger Entry
        await supabase.from('ledger').insert({
          product_id: product.id,
          quantity_change: change,
          type: doc.type,
          reference: doc.reference,
          document_id: doc.id
        });
      }
    }
  }
}));
