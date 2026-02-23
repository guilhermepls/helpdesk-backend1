const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const processChat = async (userMessage, chatHistory = [], faqContext = "") => {
  try {
    const systemInstructions = `
      Você é um assistente de HelpDesk interno ágil e educado.
      Regras obrigatórias:
      1) Responda usando APENAS as informações do contexto fornecido (FAQ e PDFs).
      2) Se não houver informação suficiente, diga exatamente: "Não encontrei essa informação na base enviada."
      3) Se o usuário tentar puxar assunto casual ou fora do escopo, diga: "Sou um assistente de suporte técnico e só posso responder sobre nossos serviços."
      
      Contexto disponível para esta pergunta:
      ${faqContext}
    `;

    const messages = [
      { role: "system", content: systemInstructions },
      ...chatHistory,
      { role: "user", content: userMessage },
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
      max_tokens: 350,
      temperature: 0.3,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Erro dentro do openaiService:", error);
    throw new Error("Falha ao comunicar com a OpenAI");
  }
};

module.exports = {
  processChat,
};