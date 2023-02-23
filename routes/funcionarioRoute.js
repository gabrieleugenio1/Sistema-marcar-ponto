//Definindo os principais módulos
const express = require('express');
const FuncionarioController = require('../controllers/FuncionarioController');
const Autenticacao = require('../middleware/Autenticacao');
const router = express.Router();

router
      .post('/admin/cadastrarFuncionario', Autenticacao.verificaTokenAdmin, FuncionarioController.cadastrarFuncionario)
      .post('/admin/alteracaoFuncionario', Autenticacao.verificaTokenAdmin, FuncionarioController.alteracaoFuncionario) 
      .post('/login', FuncionarioController.login)   
      .get('/admin/cadastrofuncionario', Autenticacao.verificaTokenAdmin, FuncionarioController.cadastroFuncionario)
      .get('/admin/alterarfuncionario/:id', Autenticacao.verificaTokenAdmin, FuncionarioController.alterarFuncionario) 
      .get('/funcionario/home', FuncionarioController.index)  
 
module.exports = router;