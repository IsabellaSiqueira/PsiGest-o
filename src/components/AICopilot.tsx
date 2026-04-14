import { useState, useEffect } from 'react';
import { BrainCircuit, Send, Sparkles, History, CheckCircle2, Copy, FileText, Info, User, Calendar } from 'lucide-react';
import { formatTCCEvolution } from '../services/geminiService';
import { cn } from '../lib/utils';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import type { ReactNode } from 'react';

const toneOptions = [
  { id: 'detailed', label: 'Mais Detalhado' },
  { id: 'concise', label: 'Mais Conciso' },
  { id: 'planning', label: 'Foco em Planejamento' },
  { id: 'behavioral', label: 'Foco Comportamental' },
];

interface AICopilotProps {
  patient?: any;
  onSaveNotes?: (notes: string) => void;
}

export default function AICopilot({ patient, onSaveNotes }: AICopilotProps) {
  const [rawNotes, setRawNotes] = useState(patient?.notes || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [selectedTone, setSelectedTone] = useState('detailed');
  const [editorValue, setEditorValue] = useState('');

  // Update rawNotes when patient changes
  useEffect(() => {
    if (patient) {
      setRawNotes(patient.notes || '');
    } else {
      setRawNotes('');
    }
    setResult(null);
    setEditorValue('');
  }, [patient]);

  const handleGenerate = async () => {
    if (!rawNotes.trim()) return;
    setIsGenerating(true);
    try {
      const formatted = await formatTCCEvolution(rawNotes);
      setResult(formatted);
      setEditorValue(formatted.evolucaoTexto);
    } catch (error) {
      alert("Erro ao processar com IA. Verifique sua chave de API.");
    } finally {
      setIsGenerating(false);
    }
  };

  const xaiTerms: Record<string, string> = {
    'reestruturação cognitiva': 'Técnica para identificar e contestar pensamentos irracionais ou mal-adaptativos.',
    'pensamento automático': 'Pensamentos rápidos e involuntários que surgem em resposta a situações específicas.',
    'distorção cognitiva': 'Erros sistemáticos no processamento de informações que mantêm crenças negativas.',
    'ativação comportamental': 'Estratégia para aumentar o engajamento em atividades que proporcionam prazer ou domínio.',
  };

  const renderXAIContent = (text: string) => {
    let elements: ReactNode[] = [];
    let lastIndex = 0;
    
    // Simple regex for XAI terms
    const terms = Object.keys(xaiTerms);
    const regex = new RegExp(`(${terms.join('|')})`, 'gi');
    
    let match;
    while ((match = regex.exec(text)) !== null) {
      elements.push(text.substring(lastIndex, match.index));
      const term = match[0].toLowerCase();
      elements.push(
        <span key={match.index} className="relative group cursor-help border-b border-dotted border-indigo-400 text-indigo-700 font-bold">
          {match[0]}
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-slate-900 text-white text-[10px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl leading-relaxed">
            <Info size={12} className="inline mr-1 mb-0.5" />
            {xaiTerms[term]}
          </span>
        </span>
      );
      lastIndex = regex.lastIndex;
    }
    elements.push(text.substring(lastIndex));
    return elements;
  };

  const handleCopy = () => {
    const textToCopy = editorValue.replace(/<[^>]*>/g, '');
    navigator.clipboard.writeText(textToCopy);
    alert('Copiado para a área de transferência!');
  };

  const handleSave = () => {
    if (!patient) {
      alert('Selecione um paciente na lista para salvar as anotações no prontuário.');
      return;
    }
    
    // Save either the formatted evolution or the raw notes
    const contentToSave = editorValue || rawNotes;
    
    if (!contentToSave.trim()) {
      alert('Não há conteúdo para salvar.');
      return;
    }

    if (onSaveNotes) {
      onSaveNotes(contentToSave);
      alert(`Evolução de ${patient.name} salva com sucesso no histórico!`);
      setRawNotes('');
      setResult(null);
      setEditorValue('');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900">Copiloto IA</h2>
          {patient ? (
            <div className="flex items-center gap-2 mt-2 text-indigo-600 font-bold bg-indigo-50 px-4 py-2 rounded-xl w-fit">
              <User size={18} />
              Prontuário: {patient.name}
            </div>
          ) : (
            <p className="text-slate-500 font-medium mt-1">Inteligência artificial para evoluções clínicas</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="bento-card overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
            <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Notas Brutas</span>
              <span className="text-xs font-bold text-slate-400">{rawNotes.length} caracteres</span>
            </div>
            <textarea 
              value={rawNotes}
              onChange={(e) => setRawNotes(e.target.value)}
              placeholder="Ex: Paciente relatou ansiedade ao falar em público. Identificamos pensamento automático 'vão rir de mim'. Trabalhamos reestruturação cognitiva..."
              className="w-full h-80 p-8 resize-none border-none focus:ring-0 text-slate-700 text-lg leading-relaxed placeholder:text-slate-300 font-medium"
            />
            <div className="p-6 bg-white border-t border-slate-50 space-y-6">
              <div className="flex flex-wrap gap-2">
                {toneOptions.map(tone => (
                  <button
                    key={tone.id}
                    onClick={() => setSelectedTone(tone.id)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                      selectedTone === tone.id 
                        ? "bg-indigo-50 text-indigo-600 border-indigo-200" 
                        : "bg-white text-slate-400 border-slate-100 hover:border-slate-200"
                    )}
                  >
                    {tone.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={handleSave}
                  disabled={!patient}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-black transition-all border-2",
                    !patient 
                      ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed" 
                      : "bg-white text-indigo-600 border-indigo-100 hover:border-indigo-600 active:scale-95"
                  )}
                >
                  <FileText size={20} />
                  Salvar Notas
                </button>
                <button 
                  onClick={handleGenerate}
                  disabled={isGenerating || !rawNotes.trim()}
                  className={cn(
                    "flex-[2] flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-black transition-all shadow-lg",
                    isGenerating || !rawNotes.trim() 
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none" 
                      : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100 active:scale-95"
                  )}
                >
                  {isGenerating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Gerar Evolução
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100 flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
              <BrainCircuit size={20} />
            </div>
            <p className="text-sm text-indigo-900 leading-relaxed font-medium">
              <strong>Dica Ética:</strong> Evite incluir nomes reais ou dados sensíveis que identifiquem o paciente diretamente.
            </p>
          </div>
        </div>

        {/* Output Section */}
        <div className="space-y-6">
          {!result && !isGenerating ? (
            <div className="h-full min-h-[400px] bento-card border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-12 text-center text-slate-400 bg-slate-50/30">
              <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-6">
                <Sparkles size={40} className="text-slate-200" />
              </div>
              <p className="font-bold text-lg text-slate-500">O resultado aparecerá aqui</p>
              <p className="text-sm font-medium mt-2 max-w-[240px]">Insira suas notas ao lado e clique em gerar para ver a mágica.</p>
            </div>
          ) : isGenerating ? (
            <div className="h-full min-h-[400px] bento-card p-10 space-y-8 animate-pulse">
              <div className="h-6 bg-slate-100 rounded-xl w-1/4" />
              <div className="space-y-4">
                <div className="h-4 bg-slate-100 rounded-lg w-full" />
                <div className="h-4 bg-slate-100 rounded-lg w-5/6" />
                <div className="h-4 bg-slate-100 rounded-lg w-4/6" />
              </div>
              <div className="h-6 bg-slate-100 rounded-xl w-1/3" />
            </div>
          ) : (
            <div className="bento-card overflow-hidden animate-in zoom-in-95 duration-500">
              <div className="p-6 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between">
                <div className="flex items-center gap-3 text-emerald-700 font-black text-xs uppercase tracking-widest">
                  <CheckCircle2 size={20} />
                  Evolução Estruturada
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={handleCopy}
                    className="w-10 h-10 flex items-center justify-center hover:bg-emerald-100 rounded-xl text-emerald-600 transition-colors" 
                    title="Copiar"
                  >
                    <Copy size={20} />
                  </button>
                  <button 
                    onClick={handleSave}
                    className="w-10 h-10 flex items-center justify-center hover:bg-emerald-100 rounded-xl text-emerald-600 transition-colors" 
                    title="Salvar"
                  >
                    <FileText size={20} />
                  </button>
                </div>
              </div>
              
              <div className="p-8 lg:p-10 space-y-8 max-h-[600px] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 gap-6">
                  <Section title="Humor e Estado Mental" content={renderXAIContent(result.humor)} />
                  <Section title="Pauta da Sessão" content={renderXAIContent(result.pauta)} />
                  <Section title="Intervenções Realizadas" content={renderXAIContent(result.intervencoes)} />
                </div>
                
                <div className="pt-8 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Editor de Evolução (Human-in-the-loop)</h4>
                    <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-md font-black uppercase">Revisão Obrigatória</span>
                  </div>
                  <div className="rich-text-editor">
                    <ReactQuill 
                      theme="snow" 
                      value={editorValue} 
                      onChange={setEditorValue}
                      className="bg-white rounded-2xl overflow-hidden border-slate-100"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* History Section */}
      {patient && patient.history && patient.history.length > 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-indigo-600 shadow-sm">
              <History size={20} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Histórico de Evoluções</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {patient.history.map((entry: any) => (
              <div key={entry.id} className="bento-card p-6 bg-white border border-slate-100 hover:shadow-md transition-all group">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-xs font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-lg">
                    <Calendar size={14} />
                    {entry.date}
                  </div>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(entry.content.replace(/<[^>]*>/g, ''));
                      alert('Copiado!');
                    }}
                    className="text-slate-300 hover:text-indigo-600 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Copy size={16} />
                  </button>
                </div>
                <div 
                  className="text-sm text-slate-600 leading-relaxed line-clamp-6 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: entry.content }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ title, content }: { title: string, content: ReactNode }) {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-bold text-slate-800">{title}</h4>
      <div className="text-sm text-slate-600 leading-relaxed">{content}</div>
    </div>
  );
}
