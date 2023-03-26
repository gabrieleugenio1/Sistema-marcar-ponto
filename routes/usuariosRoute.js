const express = require('express');
const UsuarioController = require('../controllers/UsuarioController');
const Autenticacao = require('../middleware/Autenticacao');
const router = express.Router();

router
      .get('/admin/home', Autenticacao.verificaTokenAdmin, UsuarioController.home)
      .get('/admin/alterardados', Autenticacao.verificaTokenAdmin, UsuarioController.alterarDados)
      .get('/admin/relatorios', Autenticacao.verificaTokenAdmin, UsuarioController.relatorio)
      .get('/admin/baixar-relatorio', Autenticacao.verificaTokenAdmin, UsuarioController.baixarRelatorio)
      .post('/admin/login', UsuarioController.login)
      .post('/admin/alteracaoDados', Autenticacao.verificaTokenAdmin, UsuarioController.alteracaoDados)
      .post('/admin/criarUsuario', UsuarioController.criarConta)
      .post('/admin/gerarRelatorio', Autenticacao.verificaTokenAdmin, UsuarioController.gerarRelatorio)

module.exports = router;