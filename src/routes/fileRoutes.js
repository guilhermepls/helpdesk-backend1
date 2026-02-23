const express = require("express");
const router = express.Router();
const fileController = require("../controllers/fileController");
const multer = require("multer");

const upload = multer();

router.post("/files/upload", upload.single("file"), fileController.uploadFile);
router.post("/files/vector-stores", fileController.createVectorStore);
router.post("/files/vector-stores/attach", fileController.addFileToVectorStore);
router.get("/files/vector-stores/:vectorStoreId/files", fileController.listFiles);
router.delete("/files/vector-stores/:vectorStoreId/files/:fileId", fileController.detachFile);
router.delete("/files/:fileId", fileController.deleteFile);
router.post("/chat", fileController.chat);

module.exports = router;