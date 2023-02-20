const express = require('express');
const UsuarioController = require('../controllers/UsuarioController');
const router = express.Router();

router
      .post('/admin/criarUsuario', UsuarioController.criarConta)
      .post('/admin/login', UsuarioController.login)
      .post('/admin/alteracaoDados', UsuarioController.alteracaoDados)
      .get('/admin/home', UsuarioController.home)
      .get('/admin/alterardados', UsuarioController.alterarDados)

module.exports = router;