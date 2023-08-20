const express = require('express');
const UsuarioController = require('../controllers/AdminController');
const Autentication = require('../middleware/Autentication');
const router = express.Router();

router
      .get('/admin/home', Autentication.verificaTokenAdmin, UsuarioController.index)
      .get('/admin/alterardados', Autentication.verificaTokenAdmin, UsuarioController.renderAlterarDados)
      .get('/admin/relatorios', Autentication.verificaTokenAdmin, UsuarioController.mostrarTodosRelatorios)
      .get('/admin/baixar-relatorio', Autentication.verificaTokenAdmin, UsuarioController.baixarOuDeletarRelatorio)
      .post('/admin/login', UsuarioController.login)
      .post('/admin/alteracaoDados', Autentication.verificaTokenAdmin, UsuarioController.alterarDados)
      .post('/admin/criarUsuario', UsuarioController.criarConta)
      .post('/admin/gerarRelatorio', Autentication.verificaTokenAdmin, UsuarioController.gerarRelatorio)

module.exports = router;