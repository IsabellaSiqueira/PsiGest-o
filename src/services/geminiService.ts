import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function formatTCCEvolution(rawNotes: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Você é um assistente especializado em Terapia Cognitivo-Comportamental (TCC) e no código de ética do CFP (Conselho Federal de Psicologia).
      Transforme as seguintes anotações brutas de uma sessão em uma evolução clínica estruturada conforme a Resolução CFP 01/2009.
      
      A estrutura DEVE conter exatamente estas 5 categorias:
      1. Identificação (Dados básicos do paciente e da sessão)
      2. Avaliação de demanda e objetivos (O que o paciente trouxe e o que se pretende trabalhar)
      3. Evolução do trabalho (O que foi feito na sessão, técnicas TCC aplicadas, humor e estado mental)
      4. Registro de encaminhamento ou encerramento (Próximos passos, tarefas de casa ou finalização)
      5. Documentos resultantes de avaliação (Se houve aplicação de testes ou entrega de documentos)
      
      Anotações: ${rawNotes}`,
      config: {
        temperature: 0.7,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            identificacao: { type: Type.STRING },
            demandaObjetivos: { type: Type.STRING },
            evolucaoTrabalho: { type: Type.STRING },
            encaminhamentoEncerramento: { type: Type.STRING },
            documentosAvaliacao: { type: Type.STRING },
            evolucaoTexto: { type: Type.STRING, description: "Texto completo formatado em Markdown seguindo as normas do CFP" }
          },
          required: ["identificacao", "demandaObjetivos", "evolucaoTrabalho", "encaminhamentoEncerramento", "evolucaoTexto"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Erro ao formatar evolução TCC:", error);
    throw error;
  }
}
