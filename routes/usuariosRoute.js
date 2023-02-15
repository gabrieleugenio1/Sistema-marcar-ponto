const express = require('express');
const UsuarioController = require('../controllers/UsuarioController');
const router = express.Router();

router
      .post('/criarUsuario', UsuarioController.criarConta)
      .post('/login', UsuarioController.login)
      .get('/admin/home', UsuarioController.home)
      .get('/admin/alterardados', UsuarioController.alterarDados)

module.exports = router;