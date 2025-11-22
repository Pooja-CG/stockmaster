-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    sku TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    category TEXT,
    current_stock INTEGER DEFAULT 0,
    min_stock_threshold INTEGER DEFAULT 10,
    price DECIMAL(10, 2) DEFAULT 0.00,
    unit TEXT DEFAULT 'pcs'
);

-- 2. DOCUMENTS TABLE (Receipts, Deliveries, etc.)
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    type TEXT CHECK (type IN ('RECEIPT', 'DELIVERY', 'TRANSFER', 'ADJUSTMENT')) NOT NULL,
    status TEXT CHECK (status IN ('DRAFT', 'WAITING', 'READY', 'DONE', 'CANCELED')) DEFAULT 'DRAFT',
    reference TEXT NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. DOCUMENT ITEMS TABLE (Lines inside a document)
CREATE TABLE IF NOT EXISTS document_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL CHECK (quantity > 0)
);

-- 4. LEDGER TABLE (History of all moves)
CREATE TABLE IF NOT EXISTS ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    product_id UUID REFERENCES products(id),
    quantity_change INTEGER NOT NULL,
    type TEXT NOT NULL,
    reference TEXT,
    document_id UUID REFERENCES documents(id)
);

-- 5. ROW LEVEL SECURITY (RLS)
-- For this demo, we allow public read/write. 
-- In production, you should restrict this to authenticated users.

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE ledger ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access to products" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access to documents" ON documents FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access to document_items" ON document_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access to ledger" ON ledger FOR ALL USING (true) WITH CHECK (true);

-- 6. SEED DATA (Optional - Sample Products)
INSERT INTO products (sku, name, category, current_stock, price, unit) VALUES
('STEEL-001', 'Steel Rod 10mm', 'Raw Material', 500, 12.50, 'kg'),
('STEEL-002', 'Steel Plate 5mm', 'Raw Material', 200, 45.00, 'sheet'),
('ELEC-001', 'Circuit Board A1', 'Electronics', 50, 120.00, 'pcs'),
('PKG-001', 'Cardboard Box L', 'Packaging', 1000, 0.50, 'pcs')
ON CONFLICT (sku) DO NOTHING;
