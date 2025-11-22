export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          created_at: string
          sku: string
          name: string
          category: string | null
          current_stock: number
          min_stock_threshold: number
          price: number
          unit: string
        }
        Insert: {
          id?: string
          created_at?: string
          sku: string
          name: string
          category?: string | null
          current_stock?: number
          min_stock_threshold?: number
          price?: number
          unit?: string
        }
        Update: {
          id?: string
          created_at?: string
          sku?: string
          name?: string
          category?: string | null
          current_stock?: number
          min_stock_threshold?: number
          price?: number
          unit?: string
        }
      }
      documents: {
        Row: {
          id: string
          created_at: string
          type: 'RECEIPT' | 'DELIVERY' | 'TRANSFER' | 'ADJUSTMENT'
          status: 'DRAFT' | 'WAITING' | 'READY' | 'DONE' | 'CANCELED'
          reference: string
          date: string
        }
        Insert: {
          id?: string
          created_at?: string
          type: 'RECEIPT' | 'DELIVERY' | 'TRANSFER' | 'ADJUSTMENT'
          status: 'DRAFT' | 'WAITING' | 'READY' | 'DONE' | 'CANCELED'
          reference: string
          date?: string
        }
        Update: {
          id?: string
          created_at?: string
          type?: 'RECEIPT' | 'DELIVERY' | 'TRANSFER' | 'ADJUSTMENT'
          status?: 'DRAFT' | 'WAITING' | 'READY' | 'DONE' | 'CANCELED'
          reference?: string
          date?: string
        }
      }
      document_items: {
        Row: {
          id: string
          document_id: string
          product_id: string
          quantity: number
        }
        Insert: {
          id?: string
          document_id: string
          product_id: string
          quantity: number
        }
        Update: {
          id?: string
          document_id?: string
          product_id?: string
          quantity?: number
        }
      }
      ledger: {
        Row: {
          id: string
          created_at: string
          product_id: string
          quantity_change: number
          type: string
          reference: string | null
          document_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          product_id: string
          quantity_change: number
          type: string
          reference?: string | null
          document_id?: string | null
        }
      }
    }
  }
}
