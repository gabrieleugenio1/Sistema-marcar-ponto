const express = require('express');
const UsuarioController = require('../controllers/UsuarioController');
const router = express.Router();

router
      .post('/criarUsuario', UsuarioController.criarConta)

module.exports = router;