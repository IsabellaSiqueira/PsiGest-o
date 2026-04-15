import { useState } from 'react';
import { 
  Wallet, 
  Download, 
  CheckCircle2, 
  Clock, 
  MessageCircle,
  BarChart3
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { cn } from '../lib/utils';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

const chartData = [
  { name: 'Jan', projetado: 4000, recebido: 3200 },
  { name: 'Fev', projetado: 4500, recebido: 4100 },
  { name: 'Mar', projetado: 5000, recebido: 4800 },
  { name: 'Abr', projetado: 5500, recebido: 4200 },
];

interface FinanceManagerProps {
  transactions: any[];
  onAddClick: () => void;
}

export default function FinanceManager({ transactions, onAddClick }: FinanceManagerProps) {
  const [isGenerating, setIsGenerating] = useState<string | null>(null);

  const sendWhatsApp = (tx: any) => {
    const message = `Olá ${tx.patient}, tudo bem? Segue a cobrança referente à nossa sessão de ${tx.category} no valor de R$ ${tx.amount.toFixed(2)}.`;
    window.open(`https://wa.me/${tx.phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const generateReceipt = (transaction: any) => {
    setIsGenerating(transaction.id);
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(37, 99, 235); // Blue-600
    doc.text('RECIBO DE SERVIÇOS PSICOLÓGICOS', 105, 30, { align: 'center' });
    
    doc.setDrawColor(226, 232, 240);
    doc.line(20, 40, 190, 40);
    
    // Content
    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59); // Slate-800
    doc.text(`Recebi de ${transaction.patient},`, 20, 60);
    doc.text(`a importância de R$ ${transaction.amount.toFixed(2)},`, 20, 70);
    doc.text(`referente a ${transaction.category} realizada em ${transaction.date}.`, 20, 80);
    
    // Professional Info
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139); // Slate-500
    doc.text('__________________________________________', 105, 140, { align: 'center' });
    doc.text('Dra. Isabella Tragante', 105, 145, { align: 'center' });
    doc.text('Psicóloga Clínica - CRP 06/XXXXX', 105, 150, { align: 'center' });
    
    // Footer
    doc.setFontSize(8);
    doc.text(`Gerado em ${new Date().toLocaleDateString()} via PsicoGestão AI`, 105, 280, { align: 'center' });
    
    doc.save(`recibo-${transaction.patient.replace(' ', '-').toLowerCase()}.pdf`);
    
    setTimeout(() => setIsGenerating(null), 1000);
  };

  const exportAllToCSV = () => {
    const headers = ['Paciente', 'Data', 'Servico', 'Valor', 'Status'];
    const rows = transactions.map(tx => [
      tx.patient,
      tx.date,
      tx.category,
      tx.amount,
      tx.status
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'financeiro.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalReceived = transactions.filter(t => t.status === 'paid').reduce((acc, t) => acc + t.amount, 0);
  const totalPending = transactions.filter(t => t.status === 'pending').reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-black text-slate-900">Financeiro</h2>
          <p className="text-slate-500 text-xs lg:text-sm font-medium mt-1">Gestão de cobranças e faturamento</p>
        </div>
        <button 
          onClick={onAddClick}
          className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
        >
          Nova Cobrança
        </button>
      </div>

      {/* Finance Stats & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
          <div className="bento-card p-6 lg:p-8 bg-indigo-600 text-white shadow-xl shadow-indigo-100">
            <div className="w-10 lg:w-12 h-10 lg:h-12 rounded-xl lg:rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 lg:mb-6">
              <Wallet size={20} />
            </div>
            <p className="text-indigo-100 text-[10px] lg:text-sm font-bold uppercase tracking-widest">Total Recebido</p>
            <h3 className="text-2xl lg:text-3xl font-black mt-2 text-white">R$ {totalReceived.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
            <p className="text-[10px] lg:text-xs text-indigo-200 mt-2 font-medium">+12% em relação ao mês anterior</p>
          </div>
          <div className="bento-card p-6 lg:p-8">
            <div className="w-10 lg:w-12 h-10 lg:h-12 rounded-xl lg:rounded-2xl bg-amber-50 flex items-center justify-center mb-4 lg:mb-6 text-amber-600">
              <Clock size={20} />
            </div>
            <p className="text-slate-400 text-[10px] lg:text-sm font-bold uppercase tracking-widest">Pendente</p>
            <h3 className="text-2xl lg:text-3xl font-black text-slate-900 mt-2">R$ {totalPending.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
            <p className="text-[10px] lg:text-xs text-slate-400 mt-2 font-medium">{transactions.filter(t => t.status === 'pending').length} faturas aguardando</p>
          </div>
        </div>

        <div className="lg:col-span-8 bento-card p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6 lg:mb-8">
            <div>
              <h3 className="text-lg lg:text-xl font-bold text-slate-900">Receita</h3>
              <p className="text-xs lg:text-sm text-slate-500 font-medium">Comparativo últimos 4 meses</p>
            </div>
            <BarChart3 className="text-slate-300" size={20} />
          </div>
          <div className="h-[250px] lg:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} 
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="projetado" fill="#e2e8f0" radius={[6, 6, 0, 0]} barSize={32} />
                <Bar dataKey="recebido" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bento-card overflow-hidden">
        <div className="p-6 lg:p-8 border-b border-slate-50 flex items-center justify-between">
          <h3 className="text-lg lg:text-xl font-bold text-slate-900">Transações</h3>
          <button 
            onClick={exportAllToCSV}
            className="p-2.5 bento-card text-slate-400 hover:text-indigo-600 transition-all"
            title="Exportar todas as transações"
          >
            <Download size={18} />
          </button>
        </div>
        <div className="overflow-x-auto -mx-4 lg:mx-0">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-4 lg:px-8 py-4 lg:py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Paciente</th>
                  <th className="hidden sm:table-cell px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Data</th>
                  <th className="hidden md:table-cell px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Serviço</th>
                  <th className="px-4 lg:px-8 py-4 lg:py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor</th>
                  <th className="px-4 lg:px-8 py-4 lg:py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-4 lg:px-8 py-4 lg:py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 lg:px-8 py-4 lg:py-6 font-bold text-slate-900 text-sm lg:text-lg">{tx.patient}</td>
                    <td className="hidden sm:table-cell px-8 py-6 text-sm font-medium text-slate-500">{tx.date}</td>
                    <td className="hidden md:table-cell px-8 py-6 text-sm font-medium text-slate-600">{tx.category}</td>
                    <td className="px-4 lg:px-8 py-4 lg:py-6 font-black text-slate-900 text-sm lg:text-lg whitespace-nowrap">R$ {tx.amount.toFixed(2)}</td>
                    <td className="px-4 lg:px-8 py-4 lg:py-6">
                      <div className={cn(
                        "flex items-center gap-1 lg:gap-2 text-[10px] font-black uppercase tracking-wider px-2 lg:px-4 py-1 lg:py-1.5 rounded-lg lg:rounded-xl w-fit whitespace-nowrap",
                        tx.status === 'paid' ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                      )}>
                        {tx.status === 'paid' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                        {tx.status === 'paid' ? 'Pago' : 'Pend.'}
                      </div>
                    </td>
                    <td className="px-4 lg:px-8 py-4 lg:py-6 text-right">
                      <div className="flex items-center justify-end gap-1 lg:gap-2">
                        <button 
                          onClick={() => sendWhatsApp(tx)}
                          className="w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center bento-card text-emerald-500 hover:bg-emerald-50 transition-all"
                        >
                          <MessageCircle size={16} />
                        </button>
                        <button 
                          onClick={() => generateReceipt(tx)}
                          disabled={isGenerating === tx.id}
                          className="w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center bento-card text-slate-300 hover:text-indigo-600 hover:bg-white transition-all disabled:opacity-50"
                        >
                          {isGenerating === tx.id ? (
                            <div className="w-3 h-3 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
                          ) : (
                            <Download size={16} />
                          )}
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
    </div>
  );
}
