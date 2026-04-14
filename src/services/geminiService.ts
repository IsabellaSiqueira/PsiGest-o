import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function formatTCCEvolution(rawNotes: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Você é um assistente especializado em Terapia Cognitivo-Comportamental (TCC) e no código de ética do CFP.
      Transforme as seguintes anotações brutas de uma sessão em uma evolução clínica estruturada.
      
      A estrutura deve conter:
      1. Humor e Estado Mental
      2. Pauta da Sessão
      3. Intervenções Realizadas (TCC)
      4. Tarefa de Casa (se houver)
      5. Plano para próxima sessão
      
      Anotações: ${rawNotes}`,
      config: {
        temperature: 0.7,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            humor: { type: Type.STRING },
            pauta: { type: Type.STRING },
            intervencoes: { type: Type.STRING },
            tarefa: { type: Type.STRING },
            plano: { type: Type.STRING },
            evolucaoTexto: { type: Type.STRING, description: "Texto completo formatado" }
          },
          required: ["humor", "pauta", "intervencoes", "evolucaoTexto"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Erro ao formatar evolução TCC:", error);
    throw error;
  }
}
