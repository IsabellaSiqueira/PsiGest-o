import { useState } from 'react';
import { 
  Search, 
  UserPlus, 
  Mail, 
  Phone, 
  Calendar,
  ChevronRight,
  Download,
  X
} from 'lucide-react';
import { cn } from '../lib/utils';

interface PatientListProps {
  patients: any[];
  onAddClick: () => void;
  onEditClick: (patient: any) => void;
  onViewRecordClick: (patient: any) => void;
}

export default function PatientList({ patients, onAddClick, onEditClick, onViewRecordClick }: PatientListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  const filters = ['Todos', 'Ativos', 'Inativos', 'Aguardando Prontuário'];

  const filteredPatients = patients.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeFilter === 'Todos') return matchesSearch;
    if (activeFilter === 'Ativos') return matchesSearch && p.status === 'Ativo';
    if (activeFilter === 'Inativos') return matchesSearch && p.status === 'Inativo';
    return matchesSearch;
  });

  const exportToCSV = () => {
    const headers = ['Nome', 'Email', 'Telefone', 'Ultima Sessao', 'Status', 'Modalidade'];
    const rows = filteredPatients.map(p => [
      p.name,
      p.email,
      p.phone,
      p.lastSession,
      p.status,
      p.modality
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'pacientes.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900">Pacientes</h2>
          <p className="text-slate-500 font-medium mt-1">Gerencie seus prontuários e contatos</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={onAddClick}
            className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 flex items-center gap-2"
          >
            <UserPlus size={18} />
            Novo Paciente
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Quick Filters */}
        <div className="flex flex-wrap gap-3">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "px-5 py-2.5 rounded-2xl text-sm font-bold transition-all border",
                activeFilter === filter 
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100" 
                  : "bg-white text-slate-500 border-slate-100 hover:border-indigo-200 hover:text-indigo-600"
              )}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="bento-card overflow-hidden">
          <div className="p-6 border-b border-slate-50 bg-white flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Buscar por nome, e-mail ou CPF..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
            <button 
              onClick={exportToCSV}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
            >
              <Download size={18} />
              Exportar CSV
            </button>
          </div>

          <div className="overflow-x-auto -mx-4 lg:mx-0">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Paciente</th>
                    <th className="hidden md:table-cell px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contato</th>
                    <th className="hidden sm:table-cell px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Última Sessão</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredPatients.map((patient) => (
                    <tr 
                      key={patient.id} 
                      onClick={() => setSelectedPatient(patient)}
                      className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-lg shrink-0">
                            {patient.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-slate-900 text-lg truncate">{patient.name}</p>
                              {patient.risk === 'high' && (
                                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" title="Alto Risco" />
                              )}
                            </div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {patient.tags?.map((tag: string) => (
                                <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md text-[10px] font-black uppercase tracking-wider">
                                  {tag}
                                </span>
                              ))}
                              <span className={cn(
                                "px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider",
                                patient.modality === 'Online' ? "bg-blue-50 text-blue-600" : "bg-indigo-50 text-indigo-600"
                              )}>
                                {patient.modality}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="hidden md:table-cell px-8 py-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                            <Mail size={14} className="text-slate-300" />
                            {patient.email}
                          </div>
                          <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                            <Phone size={14} className="text-slate-300" />
                            {patient.phone}
                          </div>
                        </div>
                      </td>
                      <td className="hidden sm:table-cell px-8 py-6">
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                          <Calendar size={14} className="text-slate-300" />
                          {patient.lastSession}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={cn(
                          "px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap",
                          patient.status === 'Ativo' ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                        )}>
                          {patient.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="w-10 h-10 flex items-center justify-center bento-card text-slate-300 group-hover:text-indigo-600 group-hover:bg-white transition-all">
                            <ChevronRight size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {filteredPatients.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-slate-400">Nenhum paciente encontrado com esses termos.</p>
            </div>
          )}

          <div className="p-4 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between text-sm text-slate-500">
            <p>Mostrando {filteredPatients.length} de {patients.length} pacientes</p>
            <div className="flex gap-2">
              <button className="px-3 py-1 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-50" disabled>Anterior</button>
              <button className="px-3 py-1 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-50" disabled>Próximo</button>
            </div>
          </div>
        </div>
      </div>

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedPatient(null)} />
          <div className="relative w-full max-w-lg bg-white rounded-4xl p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-2xl font-black">
                  {selectedPatient.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">{selectedPatient.name}</h3>
                  <p className="text-slate-500 font-medium">Prontuário #{selectedPatient.id}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedPatient(null)}
                className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                  <p className="font-bold text-slate-900">{selectedPatient.status}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Modalidade</p>
                  <p className="font-bold text-slate-900">{selectedPatient.modality}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-600">
                  <Mail size={18} className="text-slate-300" />
                  <span className="font-medium">{selectedPatient.email}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <Phone size={18} className="text-slate-300" />
                  <span className="font-medium">{selectedPatient.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <Calendar size={18} className="text-slate-300" />
                  <span className="font-medium">Última sessão: {selectedPatient.lastSession}</span>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex gap-3">
                <button 
                  onClick={() => {
                    onViewRecordClick(selectedPatient);
                    setSelectedPatient(null);
                  }}
                  className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
                >
                  Ver Prontuário
                </button>
                <button 
                  onClick={() => {
                    onEditClick(selectedPatient);
                    setSelectedPatient(null);
                  }}
                  className="px-6 py-4 bg-slate-50 text-slate-600 rounded-2xl font-black hover:bg-slate-100 transition-all"
                >
                  Editar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
