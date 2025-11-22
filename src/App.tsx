import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Layout/Sidebar';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { Receipts } from './pages/Operations/Receipts';
import { Deliveries } from './pages/Operations/Deliveries';
import { Transfers } from './pages/Operations/Transfers';
import { Adjustments } from './pages/Operations/Adjustments';
import { ProductList } from './pages/Inventory/ProductList';
import { Login } from './pages/Auth/Login';
import { SignUp } from './pages/Auth/SignUp';
import { ForgotPassword } from './pages/Auth/ForgotPassword';
import { UpdatePassword } from './pages/Auth/UpdatePassword';
import { StockHistory } from './pages/History/StockHistory';
import { useStore } from './store/useStore';
import { Loader2 } from 'lucide-react';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const user = useStore(state => state.user);
  
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="flex min-h-screen bg-app-gradient">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

function App() {
  const checkSession = useStore(state => state.checkSession);
  const [isChecking, setIsChecking] = React.useState(true);

  useEffect(() => {
    checkSession().then(() => setIsChecking(false));
  }, []);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/update-password" element={<UpdatePassword />} />
        
        <Route path="/" element={<AppLayout><Dashboard /></AppLayout>} />
        <Route path="/products" element={<AppLayout><ProductList /></AppLayout>} />
        
        {/* Operations */}
        <Route path="/receipts" element={<AppLayout><Receipts /></AppLayout>} />
        <Route path="/deliveries" element={<AppLayout><Deliveries /></AppLayout>} />
        <Route path="/transfers" element={<AppLayout><Transfers /></AppLayout>} />
        <Route path="/adjustments" element={<AppLayout><Adjustments /></AppLayout>} />
        
        {/* History */}
        <Route path="/history" element={<AppLayout><StockHistory /></AppLayout>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
