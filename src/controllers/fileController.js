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
      fileName,
    );

    return res.json({
      fileId: openAiFileId,
      message: "Arquivo salvo com sucesso no back-end!",
    });
  } catch (error) {
    console.error("Erro no fileController (upload):", error);
    return res.status(500).json({ error: "Erro ao processar o arquivo." });
  }
};

const createVectorStore = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name)
      return res
        .status(400)
        .json({ error: "Nome do Vector Store é obrigatório." });

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
    if (!vectorStoreId || !fileId)
      return res.status(400).json({ error: "Faltam IDs necessários." });

    const vectorStoreFileId = await openaiService.attachFileToVectorStore(
      vectorStoreId,
      fileId,
    );
    return res.json({ vectorStoreFileId });
  } catch (error) {
    console.error("Erro no fileController (attach):", error);
    return res.status(500).json({ error: "Erro ao anexar arquivo na IA." });
  }
};

const listFiles = async (req, res) => {
  try {
    const { vectorStoreId } = req.params;
    const files = await openaiService.listVectorStoreFiles(vectorStoreId);
    res.json(files);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar arquivos." });
  }
};

const deleteFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    await openaiService.deleteFile(fileId);
    res.json({ message: "Arquivo deletado." });
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar arquivo." });
  }
};

const detachFile = async (req, res) => {
  try {
    const { vectorStoreId, fileId } = req.params;
    await openaiService.deleteVectorStoreFile(vectorStoreId, fileId);
    res.json({ message: "Arquivo removido do índice." });
  } catch (error) {
    res.status(500).json({ error: "Erro ao remover do índice." });
  }
};

module.exports = {
  uploadFile,
  createVectorStore,
  addFileToVectorStore,
  listFiles,
  deleteFile,
  detachFile,
};