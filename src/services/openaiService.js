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
    console.error("Erro no processChat:", error);
    throw new Error("Falha ao comunicar com a OpenAI");
  }
};

const uploadPdfToOpenAI = async (fileBuffer, fileName) => {
  try {
    const file = await openai.files.create({
      file: {
        url: fileName,
        blob: () => new Blob([fileBuffer]),
      },
      purpose: "assistants",
    });
    return file.id;
  } catch (error) {
    console.error("Erro no uploadPdfToOpenAI:", error);
    throw error;
  }
};

const createVectorStore = async (name) => {
  try {
    const vectorStore = await openai.beta.vectorStores.create({
      name: name,
    });
    return vectorStore.id;
  } catch (error) {
    console.error("Erro no createVectorStore:", error);
    throw error;
  }
};

const attachFileToVectorStore = async (vectorStoreId, fileId) => {
  try {
    const myVectorStoreFile = await openai.beta.vectorStores.files.create(
      vectorStoreId,
      {
        file_id: fileId,
      },
    );
    return myVectorStoreFile.id;
  } catch (error) {
    console.error("Erro no attachFileToVectorStore:", error);
    throw error;
  }
};

const listVectorStoreFiles = async (vectorStoreId) => {
  try {
    const list = await openai.beta.vectorStores.files.list(vectorStoreId);
    return list.data;
  } catch (error) {
    console.error("Erro no listVectorStoreFiles:", error);
    throw error;
  }
};

const deleteVectorStoreFile = async (vectorStoreId, fileId) => {
  try {
    return await openai.beta.vectorStores.files.del(vectorStoreId, fileId);
  } catch (error) {
    console.error("Erro no deleteVectorStoreFile:", error);
    throw error;
  }
};

const deleteFile = async (fileId) => {
  try {
    return await openai.files.del(fileId);
  } catch (error) {
    console.error("Erro no deleteFile:", error);
    throw error;
  }
};

module.exports = {
  processChat,
  uploadPdfToOpenAI,
  createVectorStore,
  attachFileToVectorStore,
  listVectorStoreFiles,
  deleteVectorStoreFile,
  deleteFile,
};