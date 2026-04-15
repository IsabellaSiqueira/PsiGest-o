import React, { useState, useEffect, type FormEvent } from 'react';
import { ChevronLeft, ChevronRight, Clock, User, Video, MapPin, Plus, X, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import Modal from './Modal';

interface Appointment {
  id: string;
  patientName: string;
  time: string;
  duration: string;
  type: 'Online' | 'Presencial';
  status: 'confirmed' | 'pending' | 'completed';
}

const initialAppointments: Record<string, Appointment[]> = {};

interface CalendarViewProps {
  patients: any[];
  appointments: Record<string, Appointment[]>;
  setAppointments: React.Dispatch<React.SetStateAction<Record<string, Appointment[]>>>;
}

export default function CalendarView({ patients, appointments, setAppointments }: CalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState('2026-04-14');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [bookingData, setBookingData] = useState({
    patientName: '',
    time: '',
    type: 'Online' as 'Online' | 'Presencial',
    duration: '50min'
  });

  // Load recurring appointments when date changes
  useEffect(() => {
    const date = new Date(selectedDate + 'T00:00:00');
    const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const selectedDayName = dayNames[date.getDay()];

    const recurringPatients = patients.filter(p => p.recurringDay === selectedDayName);
    
    if (recurringPatients.length > 0) {
      setAppointments(prev => {
        const currentDayApps = prev[selectedDate] || [];
        const newApps = [...currentDayApps];
        let changed = false;

        recurringPatients.forEach(p => {
          const alreadyExists = currentDayApps.some(a => a.patientName === p.name && a.time === p.recurringTime);
          if (!alreadyExists) {
            newApps.push({
              id: `recurring-${p.id}-${selectedDate}`,
              patientName: p.name,
              time: p.recurringTime,
              duration: '50min',
              type: p.modality || 'Online',
              status: 'confirmed'
            });
            changed = true;
          }
        });

        if (!changed) return prev;

        return {
          ...prev,
          [selectedDate]: newApps.sort((a, b) => a.time.localeCompare(b.time))
        };
      });
    }
  }, [selectedDate, patients, setAppointments]);

  const hours = Array.from({ length: 13 }, (_, i) => `${(i + 8).toString().padStart(2, '0')}:00`);

  const handleOpenBooking = (time: string) => {
    setBookingData({ ...bookingData, time });
    setSelectedAppointment(null);
    setIsBookingModalOpen(true);
  };

  const handleOpenEdit = (app: Appointment) => {
    setSelectedAppointment(app);
    setBookingData({
      patientName: app.patientName,
      time: app.time,
      type: app.type,
      duration: app.duration
    });
    setIsBookingModalOpen(true);
  };

  const handleDeleteAppointment = (id: string) => {
    setAppointments(prev => ({
      ...prev,
      [selectedDate]: prev[selectedDate].filter(a => a.id !== id)
    }));
    setIsBookingModalOpen(false);
  };

  const handleUpdateStatus = (id: string, status: Appointment['status']) => {
    setAppointments(prev => ({
      ...prev,
      [selectedDate]: prev[selectedDate].map(a => a.id === id ? { ...a, status } : a)
    }));
  };

  const handleSaveAppointment = (e: FormEvent) => {
    e.preventDefault();
    
    if (selectedAppointment) {
      // Update existing
      setAppointments(prev => ({
        ...prev,
        [selectedDate]: prev[selectedDate].map(a => 
          a.id === selectedAppointment.id 
            ? { ...a, ...bookingData } 
            : a
        ).sort((a, b) => a.time.localeCompare(b.time))
      }));
    } else {
      // Create new
      const newAppointment: Appointment = {
        id: Math.random().toString(36).substr(2, 9),
        patientName: bookingData.patientName,
        time: bookingData.time,
        duration: bookingData.duration,
        type: bookingData.type,
        status: 'confirmed'
      };

      const dayAppointments = appointments[selectedDate] || [];
      setAppointments({
        ...appointments,
        [selectedDate]: [...dayAppointments, newAppointment].sort((a, b) => a.time.localeCompare(b.time))
      });
    }

    setIsBookingModalOpen(false);
    setBookingData({ patientName: '', time: '', type: 'Online', duration: '50min' });
    setSelectedAppointment(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-black text-slate-900">Agenda</h2>
          <p className="text-slate-500 text-xs lg:text-sm font-medium mt-1">Gerencie seus horários e sessões</p>
        </div>
        <div className="flex items-center justify-between md:justify-end gap-3 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
          <button 
            className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors"
            aria-label="Mês anterior"
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <span className="px-4 font-bold text-slate-700 text-sm lg:text-base" aria-live="polite">Abril 2026</span>
          <button 
            className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors"
            aria-label="Próximo mês"
          >
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Mini Calendar / Date Selector */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bento-card p-6 bg-white">
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
                <div key={`${d}-${i}`} className="text-center text-[0.625rem] font-black text-slate-300 uppercase">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 30 }, (_, i) => {
                const day = i + 1;
                const dateStr = `2026-04-${day.toString().padStart(2, '0')}`;
                const isSelected = selectedDate === dateStr;
                const hasAppointments = !!appointments[dateStr];
                
                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(dateStr)}
                    className={cn(
                      "h-10 w-full rounded-xl text-sm font-bold transition-all relative flex items-center justify-center",
                      isSelected 
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" 
                        : "hover:bg-slate-50 text-slate-600"
                    )}
                    aria-label={`Selecionar dia ${day} de Abril`}
                    aria-pressed={isSelected}
                  >
                    {day}
                    {hasAppointments && !isSelected && (
                      <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-400 rounded-full" aria-hidden="true" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bento-card p-6 bg-indigo-600 text-white">
            <h4 className="font-bold mb-2">Resumo do Dia</h4>
            <p className="text-indigo-100 text-sm leading-relaxed">
              Você tem {appointments[selectedDate]?.length || 0} sessões agendadas para hoje.
            </p>
            <button 
              onClick={() => handleOpenBooking('08:00')}
              className="mt-6 w-full py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
            >
              <Plus size={18} />
              Novo Agendamento
            </button>
          </div>
        </div>

        {/* Timeline View */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bento-card bg-white overflow-hidden">
            <div className="p-4 lg:p-6 border-b border-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h3 className="font-bold text-slate-900">Cronograma</h3>
              <div className="flex gap-4">
                <span className="flex items-center gap-1.5 text-[0.625rem] font-black text-slate-400 uppercase tracking-widest">
                  <span className="w-2 h-2 rounded-full bg-sky-400" /> Online
                </span>
                <span className="flex items-center gap-1.5 text-[0.625rem] font-black text-slate-400 uppercase tracking-widest">
                  <span className="w-2 h-2 rounded-full bg-amber-400" /> Presencial
                </span>
              </div>
            </div>
            
            <div className="p-0 max-h-[500px] lg:max-h-[600px] overflow-y-auto custom-scrollbar">
              <div className="relative">
                {hours.map((hour) => {
                  const hourPrefix = hour.split(':')[0];
                  const dayAppointments = appointments[selectedDate] || [];
                  const hourAppointments = dayAppointments.filter(a => a.time.startsWith(hourPrefix));
                  
                  return (
                    <div key={hour} className="flex border-b border-slate-50 group last:border-0">
                      <div className="w-16 lg:w-20 py-6 lg:py-8 px-2 lg:px-4 text-[0.625rem] lg:text-xs font-black text-slate-300 text-right border-r border-slate-50 bg-slate-50/30">
                        {hour}
                      </div>
                      <div className="flex-1 p-2 relative min-h-[80px] lg:min-h-[100px] space-y-2">
                        {hourAppointments.length > 0 ? (
                          hourAppointments.map(appointment => (
                            <motion.div 
                              key={appointment.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              onClick={() => handleOpenEdit(appointment)}
                              className={cn(
                                "p-3 lg:p-4 rounded-xl lg:rounded-2xl border-l-4 shadow-sm flex flex-col justify-between transition-all hover:shadow-md cursor-pointer",
                                appointment.type === 'Online' 
                                  ? "bg-sky-50 border-sky-500 text-sky-900" 
                                  : "bg-amber-50 border-amber-500 text-amber-900"
                              )}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <p className="font-black text-xs lg:text-sm uppercase tracking-tight truncate">{appointment.patientName}</p>
                                  <div className="flex flex-wrap items-center gap-2 lg:gap-3 mt-1 opacity-70">
                                    <span className="flex items-center gap-1 text-[0.5625rem] lg:text-[0.625rem] font-bold">
                                      <Clock size={10} /> {appointment.time}
                                    </span>
                                    <span className="flex items-center gap-1 text-[0.5625rem] lg:text-[0.625rem] font-bold">
                                      {appointment.type === 'Online' ? <Video size={10} /> : <MapPin size={10} />}
                                      {appointment.type}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1 lg:gap-2 shrink-0">
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleUpdateStatus(appointment.id, appointment.status === 'completed' ? 'confirmed' : 'completed');
                                    }}
                                    className={cn(
                                      "p-1.5 lg:p-2 rounded-lg transition-all",
                                      appointment.status === 'completed' ? "bg-emerald-500 text-white" : "bg-white/50 text-slate-400 hover:text-emerald-600"
                                    )}
                                    aria-label={appointment.status === 'completed' ? "Marcar como não concluído" : "Marcar como concluído"}
                                  >
                                    <CheckCircle2 size={14} aria-hidden="true" />
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          ))
                        ) : (
                          <div className="h-full w-full rounded-xl lg:rounded-2xl border-2 border-dashed border-slate-50 group-hover:border-slate-100 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 min-h-[60px] lg:min-h-[80px]">
                            <button 
                              onClick={() => handleOpenBooking(hour)}
                              className="text-[0.625rem] lg:text-xs font-bold text-slate-300 hover:text-indigo-400 flex items-center gap-1"
                            >
                              <Plus size={12} /> Reservar
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        title={selectedAppointment ? "Editar Agendamento" : "Novo Agendamento"}
      >
        <form onSubmit={handleSaveAppointment} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Paciente</label>
            <select 
              required
              value={bookingData.patientName}
              onChange={e => setBookingData({...bookingData, patientName: e.target.value})}
              className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500"
              disabled={!!selectedAppointment}
            >
              <option value="">Selecione um paciente</option>
              {patients.map(p => (
                <option key={p.id} value={p.name}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Horário</label>
              <input 
                type="time"
                required
                value={bookingData.time}
                onChange={e => setBookingData({...bookingData, time: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Duração</label>
              <select 
                value={bookingData.duration}
                onChange={e => setBookingData({...bookingData, duration: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500"
              >
                <option value="30min">30 min</option>
                <option value="50min">50 min</option>
                <option value="90min">90 min</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Modalidade</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setBookingData({...bookingData, type: 'Online'})}
                className={cn(
                  "py-3 rounded-xl text-sm font-bold border-2 transition-all",
                  bookingData.type === 'Online' 
                    ? "bg-sky-50 border-sky-600 text-sky-600" 
                    : "bg-white border-slate-100 text-slate-400"
                )}
              >
                Online
              </button>
              <button
                type="button"
                onClick={() => setBookingData({...bookingData, type: 'Presencial'})}
                className={cn(
                  "py-3 rounded-xl text-sm font-bold border-2 transition-all",
                  bookingData.type === 'Presencial' 
                    ? "bg-amber-50 border-amber-600 text-amber-600" 
                    : "bg-white border-slate-100 text-slate-400"
                )}
              >
                Presencial
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            {selectedAppointment && (
              <button 
                type="button"
                onClick={() => handleDeleteAppointment(selectedAppointment.id)}
                className="px-6 py-4 bg-rose-50 text-rose-600 rounded-2xl font-black hover:bg-rose-100 transition-all flex items-center gap-2"
              >
                <Trash2 size={20} />
              </button>
            )}
            <button type="submit" className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
              {selectedAppointment ? "Salvar Alterações" : "Confirmar Agendamento"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
