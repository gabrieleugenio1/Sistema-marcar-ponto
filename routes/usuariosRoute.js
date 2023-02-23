const express = require('express');
const UsuarioController = require('../controllers/UsuarioController');
const Autenticacao = require('../middleware/Autenticacao');
const router = express.Router();

router
      .post('/admin/criarUsuario', UsuarioController.criarConta)
      .post('/admin/login', UsuarioController.login)
      .post('/admin/alteracaoDados', Autenticacao.verificaTokenAdmin, UsuarioController.alteracaoDados)
      .get('/admin/home', Autenticacao.verificaTokenAdmin, UsuarioController.home)
      .get('/admin/alterardados', Autenticacao.verificaTokenAdmin, UsuarioController.alterarDados)

module.exports = router;