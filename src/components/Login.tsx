import { useState, type FormEvent } from 'react';
import { BrainCircuit, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-200/50 overflow-hidden"
        >
          <div className="p-8 lg:p-12">
            <div className="flex flex-col items-center text-center mb-10">
              <motion.div 
                initial={{ scale: 0.5, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-indigo-200 mb-6"
              >
                <BrainCircuit size={32} />
              </motion.div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">PsicoGestão</h1>
              <p className="text-slate-500 font-medium">Bem-vindo ao seu consultório digital</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">E-mail Profissional</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                  <input 
                    required
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="isabella@psicogestao.com"
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-medium focus:bg-white focus:border-indigo-600 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Senha</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                  <input 
                    required
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-medium focus:bg-white focus:border-indigo-600 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-5 h-5 rounded-lg border-2 border-slate-200 text-indigo-600 focus:ring-0 transition-all cursor-pointer" />
                  <span className="text-sm font-bold text-slate-500 group-hover:text-slate-700 transition-colors">Lembrar de mim</span>
                </label>
                <button type="button" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors">Esqueceu a senha?</button>
              </div>

              <button 
                disabled={isLoading}
                type="submit" 
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Entrar no Sistema
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-2">
            <ShieldCheck size={16} className="text-emerald-500" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Acesso Seguro & Criptografado</span>
          </div>
        </motion.div>

        <div className="mt-8 text-center">
          <p className="text-sm font-medium text-slate-500">
            Ainda não tem uma conta? <button className="text-indigo-600 font-bold hover:underline">Solicitar acesso</button>
          </p>
        </div>
      </div>
    </div>
  );
}
