import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Lock, Mail, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useStore } from '../../store/useStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const checkSession = useStore((state) => state.checkSession);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      await checkSession();
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center p-4 bg-app-gradient">
      <div className="max-w-md w-full bg-brand-primary border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-brand-blue p-8 text-center">
          <div className="mx-auto w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
            <Box className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">StockMaster</h2>
          <p className="text-indigo-100">Enterprise Inventory Management</p>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                <Input 
                  type="email" 
                  placeholder="Email Address" 
                  className="pl-10" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                <Input 
                  type="password" 
                  placeholder="Password" 
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-slate-400 hover:text-slate-300 cursor-pointer">
                <input type="checkbox" className="mr-2 rounded border-white/10 bg-brand-dark text-brand-blue focus:ring-brand-blue" />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-brand-blue font-medium hover:underline">
                Forgot Password?
              </Link>
            </div>

            <Button type="submit" className="w-full bg-brand-blue hover:bg-blue-600" size="lg" isLoading={isLoading}>
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-400">
            Don't have an account? <Link to="/signup" className="text-brand-blue font-medium hover:underline">Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
