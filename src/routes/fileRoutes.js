const express = require("express");
const router = express.Router();
const multer = require("multer");
const fileController = require("../controllers/fileController");

const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.single("file"), fileController.uploadFile);
router.post("/vector-stores", fileController.createVectorStore);
router.post("/vector-stores/attach", fileController.addFileToVectorStore);
router.get("/vector-stores/:vectorStoreId/files", fileController.listFiles);
router.delete("/:fileId", fileController.deleteFile);
router.delete("/vector-stores/:vectorStoreId/files/:fileId", fileController.detachFile,);

module.exports = router;