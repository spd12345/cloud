const express = require('express');
const FileController = require('../controllers/fileController');
const upload = require('../middleware/upload');

const router = express.Router();
const fileController = new FileController();

function setRoutes(app) {
  router.post('/upload', upload.single('file'), fileController.uploadFile);
  router.get('/files', fileController.getFiles);

  app.use('/api/files', router);
}

module.exports = setRoutes;