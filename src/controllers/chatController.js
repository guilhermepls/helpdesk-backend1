const openaiService = require("../services/openaiService");

const handleChat = async (req, res) => {
  try {
    const { message, history, context } = req.body;

    if (!message) {
      return res
        .status(400)
        .json({ error: "A mensagem não pode estar vazia." });
    }

    const aiReply = await openaiService.processChat(message, history, context);

    return res.json({ reply: aiReply });
  } catch (error) {
    console.error("Erro no chatController:", error);
    return res
      .status(500)
      .json({
        error: "Nossos servidores estão ocupados no momento. Tente novamente.",
      });
  }
};

module.exports = {
  handleChat,
};