import { useState, type FormEvent } from 'react';
import { 
  Users, 
  LayoutDashboard, 
  Wallet, 
  BrainCircuit, 
  Search,
  ChevronRight,
  TrendingUp,
  Calendar,
  Clock,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { cn } from './lib/utils';
import AICopilot from './components/AICopilot';
import PatientList from './components/PatientList';
import FinanceManager from './components/FinanceManager';
import CalendarView from './components/CalendarView';
import Modal from './components/Modal';
import Login from './components/Login';

// Initial data
const initialPatients = [
  { 
    id: '1', 
    name: 'Ana Silva', 
    email: 'ana.silva@email.com', 
    phone: '5511988887777', 
    lastSession: '08 Abr 2024', 
    status: 'Ativo', 
    tags: ['TCC', 'Ansiedade'], 
    modality: 'Online', 
    risk: 'low', 
    notes: '',
    history: [
      { id: 'h1', date: '01 Abr 2024', content: 'Paciente relatou melhora no sono após técnicas de relaxamento.' },
      { id: 'h2', date: '08 Abr 2024', content: 'Focamos em reestruturação cognitiva sobre pensamentos de insuficiência.' }
    ],
    recurringDay: 'Terça',
    recurringTime: '15:00'
  },
  { 
    id: '2', 
    name: 'Carlos Oliveira', 
    email: 'carlos.o@email.com', 
    phone: '5511977776666', 
    lastSession: '07 Abr 2024', 
    status: 'Ativo', 
    tags: ['Depressão'], 
    modality: 'Presencial', 
    risk: 'high', 
    notes: '',
    history: [
      { id: 'h3', date: '07 Abr 2024', content: 'Sessão focada em ativação comportamental. Baixa energia relatada.' }
    ],
    recurringDay: '',
    recurringTime: ''
  },
  { id: '3', name: 'Mariana Costa', email: 'mari.costa@email.com', phone: '5511966665555', lastSession: '06 Abr 2024', status: 'Inativo', tags: ['TCC'], modality: 'Online', risk: 'medium', notes: '', history: [], recurringDay: '', recurringTime: '' },
  { id: '4', name: 'Ricardo Santos', email: 'ricardo.s@email.com', phone: '5511955554444', lastSession: '01 Abr 2024', status: 'Ativo', tags: ['Casal'], modality: 'Presencial', risk: 'low', notes: '', history: [], recurringDay: '', recurringTime: '' },
];

const initialAppointments = {
  '2026-04-14': [
    { id: '1', patientName: 'Ana Silva', time: '09:00', duration: '50min', type: 'Online', status: 'completed' },
    { id: '2', patientName: 'Carlos Oliveira', time: '10:30', duration: '50min', type: 'Presencial', status: 'confirmed' },
    { id: '3', patientName: 'Mariana Costa', time: '14:00', duration: '50min', type: 'Online', status: 'confirmed' },
    { id: '4', patientName: 'Ricardo Santos', time: '16:00', duration: '50min', type: 'Presencial', status: 'pending' },
  ],
  '2026-04-15': [
    { id: '5', patientName: 'Julia Mendes', time: '08:00', duration: '50min', type: 'Online', status: 'confirmed' },
    { id: '6', patientName: 'Pedro Rocha', time: '11:00', duration: '50min', type: 'Presencial', status: 'confirmed' },
  ]
};

const initialTransactions = [
  { id: '1', patient: 'Ana Silva', amount: 150.00, date: '08 Abr 2024', status: 'paid', category: 'Sessão Individual', phone: '5511988887777' },
  { id: '2', patient: 'Carlos Oliveira', amount: 150.00, date: '07 Abr 2024', status: 'pending', category: 'Sessão Individual', phone: '5511977776666' },
  { id: '3', patient: 'Mariana Costa', amount: 200.00, date: '06 Abr 2024', status: 'paid', category: 'Avaliação', phone: '5511966665555' },
  { id: '4', patient: 'Ricardo Santos', amount: 150.00, date: '01 Abr 2024', status: 'paid', category: 'Sessão Individual', phone: '5511955554444' },
];

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [patients, setPatients] = useState(initialPatients);
  const [appointments, setAppointments] = useState<any>(initialAppointments);
  const [transactions, setTransactions] = useState(initialTransactions);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [isFinanceModalOpen, setIsFinanceModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<any>(null);
  const [selectedPatientForRecord, setSelectedPatientForRecord] = useState<any>(null);

  // Form states
  const [newPatient, setNewPatient] = useState({ name: '', email: '', phone: '', modality: 'Online', recurringDay: '', recurringTime: '' });
  const [newTx, setNewTx] = useState({ patient: '', amount: '', category: 'Sessão Individual' });

  const handleAddPatient = (e: FormEvent) => {
    e.preventDefault();
    const id = (patients.length + 1).toString();
    setPatients([{ 
      id, 
      ...newPatient, 
      lastSession: 'Recém adicionado', 
      status: 'Ativo', 
      tags: ['Novo'], 
      risk: 'low',
      notes: '',
      history: []
    }, ...patients]);
    setIsPatientModalOpen(false);
    setNewPatient({ name: '', email: '', phone: '', modality: 'Online', recurringDay: '', recurringTime: '' });
  };

  const handleEditPatient = (e: FormEvent) => {
    e.preventDefault();
    setPatients(patients.map(p => p.id === editingPatient.id ? { ...p, ...newPatient } : p));
    setIsPatientModalOpen(false);
    setEditingPatient(null);
    setNewPatient({ name: '', email: '', phone: '', modality: 'Online', recurringDay: '', recurringTime: '' });
  };

  const openEditModal = (patient: any) => {
    setEditingPatient(patient);
    setNewPatient({ 
      name: patient.name, 
      email: patient.email, 
      phone: patient.phone, 
      modality: patient.modality,
      recurringDay: patient.recurringDay || '',
      recurringTime: patient.recurringTime || ''
    });
    setIsPatientModalOpen(true);
  };

  const handleSavePatientNotes = (patientId: string, notes: string) => {
    const date = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
    setPatients(patients.map(p => {
      if (p.id === patientId) {
        const newHistoryEntry = {
          id: Math.random().toString(36).substr(2, 9),
          date,
          content: notes
        };
        return { 
          ...p, 
          notes: '', // Clear raw notes after saving to history
          history: [newHistoryEntry, ...(p.history || [])] 
        };
      }
      return p;
    }));
  };

  const handleAddTransaction = (e: FormEvent) => {
    e.preventDefault();
    const id = (transactions.length + 1).toString();
    setTransactions([{ 
      id, 
      ...newTx, 
      amount: parseFloat(newTx.amount), 
      date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }), 
      status: 'pending',
      phone: patients.find(p => p.name === newTx.patient)?.phone || ''
    }, ...transactions]);
    setIsFinanceModalOpen(false);
    setNewTx({ patient: '', amount: '', category: 'Sessão Individual' });
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'calendar', label: 'Agenda', icon: Calendar },
    { id: 'patients', label: 'Pacientes', icon: Users },
    { id: 'finance', label: 'Financeiro', icon: Wallet },
    { id: 'ai', label: 'Copiloto IA', icon: BrainCircuit },
  ];

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="flex h-screen bg-[#F3F4F6] font-sans text-slate-900 overflow-hidden p-0 lg:p-4">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 bg-white rounded-4xl border border-slate-200/50 flex-col shadow-[0_8px_30px_rgb(0,0,0,0.02)] m-2">
        <div className="p-8">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <BrainCircuit size={24} />
            </div>
            PsicoGestão
          </h1>
        </div>

        <nav className="flex-1 px-6 space-y-2">
          {navItems.map((item) => (
            <NavItem 
              key={item.id}
              icon={item.icon} 
              label={item.label} 
              active={activeTab === item.id} 
              onClick={() => setActiveTab(item.id)} 
            />
          ))}
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold text-rose-500 hover:bg-rose-50 transition-all duration-300 mt-4"
          >
            <LogOut size={22} />
            Sair do Sistema
          </button>
        </nav>

        <div className="p-6 mt-auto">
          <div className="bg-slate-50 rounded-3xl p-4 flex items-center gap-3 border border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
              IT
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">Dra. Isabella</p>
              <p className="text-xs text-slate-500 font-medium truncate">Psicóloga Clínica</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative lg:ml-2">
        {/* Header */}
        <header className="h-20 flex items-center justify-between px-6 lg:px-10 shrink-0">
          <div className="flex items-center gap-4">
            <div className="lg:hidden w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <BrainCircuit size={20} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 capitalize lg:block hidden">
                {activeTab === 'dashboard' ? 'Bem-vinda de volta!' : activeTab}
              </h2>
              <p className="text-sm text-slate-500 font-medium hidden lg:block">Quarta-feira, 08 de Abril</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 lg:gap-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Pesquisar..." 
                className="pl-12 pr-6 py-3 bg-white border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 w-64 lg:w-80 transition-all shadow-sm"
              />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 pb-24 lg:pb-10 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && (
              <div className="space-y-8 animate-in fade-in duration-700">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* At a Glance - Priority 1 */}
                  <div className="lg:col-span-4 bento-card p-8 bg-white border-l-4 border-l-rose-500 relative overflow-hidden">
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 text-rose-600 font-black text-xs uppercase tracking-widest mb-6">
                        <Clock size={18} />
                        Atenção Imediata
                      </div>
                      <div className="space-y-4">
                        <div 
                          onClick={() => setActiveTab('calendar')}
                          className="p-4 bg-rose-50 rounded-2xl border border-rose-100 flex items-center justify-between group cursor-pointer hover:bg-rose-100 transition-colors"
                        >
                          <div>
                            <p className="font-bold text-slate-900">Ana Silva</p>
                            <p className="text-xs text-rose-600 font-bold">Próxima Sessão: 09:00</p>
                          </div>
                          <ChevronRight size={18} className="text-rose-300 group-hover:translate-x-1 transition-transform" />
                        </div>
                        <div 
                          onClick={() => setActiveTab('patients')}
                          className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-center justify-between group cursor-pointer hover:bg-amber-100 transition-colors"
                        >
                          <div>
                            <p className="font-bold text-slate-900">Carlos Oliveira</p>
                            <p className="text-xs text-amber-600 font-bold">Risco de Evasão</p>
                          </div>
                          <ChevronRight size={18} className="text-amber-300 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Main Stats - Asymmetric */}
                  <div className="lg:col-span-8 grid grid-cols-2 gap-6">
                    <div className="bento-card p-8 bg-indigo-600 text-white shadow-xl shadow-indigo-100">
                      <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-6">
                        <Users size={24} />
                      </div>
                      <p className="text-indigo-100 text-sm font-bold uppercase tracking-widest">Pacientes Ativos</p>
                      <h3 className="text-4xl font-black mt-2">{patients.length}</h3>
                      <div className="mt-4 flex items-center gap-2 text-xs font-bold text-indigo-200">
                        <TrendingUp size={14} />
                        <span>+3 este mês</span>
                      </div>
                    </div>
                    <div className="bento-card p-8 bg-white">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
                        <Calendar size={24} />
                      </div>
                      <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Sessões Hoje</p>
                      <h3 className="text-4xl font-black text-slate-900 mt-2">6</h3>
                      <p className="text-xs text-slate-400 mt-2 font-medium">Próxima: 14:00 - Mariana Costa</p>
                    </div>
                  </div>

                  {/* Secondary Stats & Recent Activity */}
                  <div className="lg:col-span-7 bento-card overflow-hidden">
                    <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">Sessões Recentes</h3>
                        <p className="text-sm text-slate-500 font-medium">Últimas atividades da semana</p>
                      </div>
                      <button 
                        onClick={() => setActiveTab('patients')}
                        className="text-indigo-600 text-sm font-bold hover:bg-indigo-50 px-4 py-2 rounded-xl transition-colors"
                      >
                        Ver todos
                      </button>
                    </div>
                    <div className="divide-y divide-slate-50">
                      {patients.slice(0, 3).map((patient, i) => (
                        <div 
                          key={i} 
                          onClick={() => setActiveTab('patients')}
                          className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-lg">
                              {patient.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 text-lg">{patient.name}</p>
                              <div className="flex items-center gap-2 text-sm text-slate-500 font-medium mt-1">
                                <Clock size={14} />
                                {patient.lastSession}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <span className={cn(
                              "px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider",
                              patient.status === 'Ativo' ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                            )}>
                              {patient.status}
                            </span>
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-white group-hover:text-indigo-600 group-hover:shadow-sm transition-all">
                              <ChevronRight size={20} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Financial Quick View */}
                  <div className="lg:col-span-5 bento-card p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                          <Wallet size={24} />
                        </div>
                        <button className="text-slate-400 hover:text-indigo-600 transition-colors">
                          <TrendingUp size={20} />
                        </button>
                      </div>
                      <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Faturamento Mês</p>
                      <h3 className="text-4xl font-black text-slate-900 mt-2">
                        R$ {transactions.reduce((acc, tx) => acc + (tx.status === 'paid' ? tx.amount : 0), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </h3>
                      <div className="mt-6 space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-500 font-medium">Recebido</span>
                          <span className="text-emerald-600 font-bold">
                            R$ {transactions.filter(t => t.status === 'paid').reduce((acc, t) => acc + t.amount, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500 rounded-full transition-all duration-1000" 
                            style={{ width: `${(transactions.filter(t => t.status === 'paid').length / transactions.length) * 100}%` }} 
                          />
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-500 font-medium">Pendente</span>
                          <span className="text-amber-600 font-bold">
                            R$ {transactions.filter(t => t.status === 'pending').reduce((acc, t) => acc + t.amount, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => setActiveTab('finance')}
                      className="mt-8 w-full py-4 rounded-2xl bg-slate-50 text-slate-600 font-bold hover:bg-slate-100 transition-all active:scale-95 border border-slate-100"
                    >
                      Relatório Completo
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'calendar' && (
              <CalendarView 
                patients={patients} 
                appointments={appointments} 
                setAppointments={setAppointments} 
              />
            )}
            {activeTab === 'ai' && (
              <AICopilot 
                patient={selectedPatientForRecord} 
                onSaveNotes={(notes) => {
                  if (selectedPatientForRecord) {
                    handleSavePatientNotes(selectedPatientForRecord.id, notes);
                  }
                }}
              />
            )}
            {activeTab === 'patients' && (
              <PatientList 
                patients={patients} 
                onAddClick={() => {
                  setEditingPatient(null);
                  setNewPatient({ name: '', email: '', phone: '', modality: 'Online' });
                  setIsPatientModalOpen(true);
                }} 
                onEditClick={openEditModal}
                onViewRecordClick={(patient) => {
                  setSelectedPatientForRecord(patient);
                  setActiveTab('ai');
                }}
              />
            )}
            {activeTab === 'finance' && (
              <FinanceManager 
                transactions={transactions} 
                onAddClick={() => setIsFinanceModalOpen(true)} 
              />
            )}
          </div>
        </div>

        {/* Modals */}
        <Modal 
          isOpen={isPatientModalOpen} 
          onClose={() => {
            setIsPatientModalOpen(false);
            setEditingPatient(null);
            setNewPatient({ name: '', email: '', phone: '', modality: 'Online' });
          }} 
          title={editingPatient ? "Editar Paciente" : "Novo Paciente"}
        >
          <form onSubmit={editingPatient ? handleEditPatient : handleAddPatient} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Nome Completo</label>
                <input 
                  required
                  type="text" 
                  value={newPatient.name}
                  onChange={e => setNewPatient({...newPatient, name: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500"
                  placeholder="Ex: João Silva"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">E-mail</label>
                <input 
                  required
                  type="email" 
                  value={newPatient.email}
                  onChange={e => setNewPatient({...newPatient, email: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500"
                  placeholder="joao@email.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Telefone (WhatsApp)</label>
                <input 
                  required
                  type="text" 
                  value={newPatient.phone}
                  onChange={e => setNewPatient({...newPatient, phone: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500"
                  placeholder="5511999999999"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Modalidade</label>
                <select 
                  value={newPatient.modality}
                  onChange={e => setNewPatient({...newPatient, modality: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Online">Online</option>
                  <option value="Presencial">Presencial</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Dia Recorrente</label>
                <select 
                  value={newPatient.recurringDay}
                  onChange={e => setNewPatient({...newPatient, recurringDay: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Nenhum</option>
                  <option value="Segunda">Segunda-feira</option>
                  <option value="Terça">Terça-feira</option>
                  <option value="Quarta">Quarta-feira</option>
                  <option value="Quinta">Quinta-feira</option>
                  <option value="Sexta">Sexta-feira</option>
                  <option value="Sábado">Sábado</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Horário Fixo</label>
                <input 
                  type="time"
                  value={newPatient.recurringTime}
                  onChange={e => setNewPatient({...newPatient, recurringTime: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
              {editingPatient ? "Salvar Alterações" : "Cadastrar Paciente"}
            </button>
          </form>
        </Modal>

        <Modal 
          isOpen={isFinanceModalOpen} 
          onClose={() => setIsFinanceModalOpen(false)} 
          title="Nova Cobrança"
        >
          <form onSubmit={handleAddTransaction} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Paciente</label>
              <select 
                required
                value={newTx.patient}
                onChange={e => setNewTx({...newTx, patient: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Selecione um paciente</option>
                {patients.map(p => (
                  <option key={p.id} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Valor (R$)</label>
                <input 
                  required
                  type="number" 
                  step="0.01"
                  value={newTx.amount}
                  onChange={e => setNewTx({...newTx, amount: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500"
                  placeholder="150.00"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Categoria</label>
                <select 
                  value={newTx.category}
                  onChange={e => setNewTx({...newTx, category: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Sessão Individual">Sessão Individual</option>
                  <option value="Avaliação">Avaliação</option>
                  <option value="Laudo/Relatório">Laudo/Relatório</option>
                </select>
              </div>
            </div>
            <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
              Gerar Cobrança
            </button>
          </form>
        </Modal>

        {/* Mobile Bottom Navigation */}
        <nav className="lg:hidden fixed bottom-4 left-4 right-4 bg-white/80 backdrop-blur-xl border border-slate-200/50 px-8 py-4 flex justify-between items-center z-50 rounded-3xl shadow-2xl">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "flex flex-col items-center gap-1.5 transition-all duration-300",
                activeTab === item.id ? "text-indigo-600 scale-110" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <item.icon size={22} strokeWidth={activeTab === item.id ? 2.5 : 2} />
              <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
          <button
            onClick={() => setIsAuthenticated(false)}
            className="flex flex-col items-center gap-1.5 text-rose-400 hover:text-rose-600 transition-all duration-300"
          >
            <LogOut size={22} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Sair</span>
          </button>
        </nav>
      </main>
    </div>
  );
}

interface NavItemProps {
  icon: any;
  label: string;
  active?: boolean;
  onClick: () => void;
  key?: string | number;
}

function NavItem({ icon: Icon, label, active, onClick }: NavItemProps) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all duration-300",
        active 
          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100 translate-x-1" 
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
      )}
    >
      <Icon size={22} strokeWidth={active ? 2.5 : 2} />
      {label}
    </button>
  );
}
