const openaiService = require("../services/openaiService");

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Nenhum arquivo enviado." });
    }

    const fileBuffer = req.file.buffer;
    const fileName = req.file.originalname;

    const openAiFileId = await openaiService.uploadPdfToOpenAI(
      fileBuffer,
      fileName
    );

    return res.json({
      fileId: openAiFileId,
      message: "Arquivo salvo com sucesso!",
    });
  } catch (error) {
    console.error("Erro no fileController (upload):", error);
    return res.status(500).json({ error: "Erro ao processar o arquivo." });
  }
};

const createVectorStore = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res
        .status(400)
        .json({ error: "Nome do Vector Store é obrigatório." });
    }

    const vectorStoreId = await openaiService.createVectorStore(name);

    return res.json({ vectorStoreId });
  } catch (error) {
    console.error("Erro no fileController (vector store):", error);
    return res
      .status(500)
      .json({ error: "Erro ao criar o banco de dados da IA." });
  }
};

const addFileToVectorStore = async (req, res) => {
  try {
    const { vectorStoreId, fileId } = req.body;

    if (!vectorStoreId || !fileId) {
      return res.status(400).json({ error: "Faltam IDs necessários." });
    }

    const vectorStoreFileId =
      await openaiService.attachFileToVectorStore(
        vectorStoreId,
        fileId
      );

    return res.json({
      vectorStoreFileId,
      message: "Arquivo indexado com sucesso!",
    });
  } catch (error) {
    console.error("Erro no fileController (attach):", error);
    return res.status(500).json({
      error: "Erro ao anexar arquivo na IA.",
    });
  }
};

const chat = async (req, res) => {
  try {
    const { message, history, context, vectorStoreId } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        error: "Mensagem é obrigatória.",
      });
    }

    const reply = await openaiService.processChat(
      message,
      history || [],
      context || "",
      vectorStoreId || null
    );

    return res.json({ reply });
  } catch (error) {
    console.error("Erro no chat:", error);
    return res.status(500).json({
      error: "Erro ao processar chat.",
    });
  }
};

const listFiles = async (req, res) => {
  try {
    const { vectorStoreId } = req.params;

    if (!vectorStoreId) {
      return res.status(400).json({
        error: "VectorStoreId é obrigatório.",
      });
    }

    const files =
      await openaiService.listVectorStoreFiles(vectorStoreId);

    return res.json(files);
  } catch (error) {
    console.error("Erro ao listar arquivos:", error);
    return res.status(500).json({
      error: "Erro ao listar arquivos.",
    });
  }
};

const detachFile = async (req, res) => {
  try {
    const { vectorStoreId, fileId } = req.params;

    if (!vectorStoreId || !fileId) {
      return res.status(400).json({
        error: "IDs são obrigatórios.",
      });
    }

    await openaiService.deleteVectorStoreFile(
      vectorStoreId,
      fileId
    );

    return res.json({
      message: "Arquivo removido do índice.",
    });
  } catch (error) {
    console.error("Erro ao remover do índice:", error);
    return res.status(500).json({
      error: "Erro ao remover do índice.",
    });
  }
};

const deleteFile = async (req, res) => {
  try {
    const { fileId } = req.params;

    if (!fileId) {
      return res.status(400).json({
        error: "FileId é obrigatório.",
      });
    }

    await openaiService.deleteFile(fileId);

    return res.json({
      message: "Arquivo deletado permanentemente.",
    });
  } catch (error) {
    console.error("Erro ao deletar arquivo:", error);
    return res.status(500).json({
      error: "Erro ao deletar arquivo.",
    });
  }
};

module.exports = {
  uploadFile,
  createVectorStore,
  addFileToVectorStore,
  listFiles,
  deleteFile,
  detachFile,
  chat,
};