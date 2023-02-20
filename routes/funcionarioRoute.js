//Definindo os principais módulos
const express = require('express');
const FuncionarioController = require('../controllers/FuncionarioController');
const router = express.Router();

router
      .post('/admin/cadastrarFuncionario', FuncionarioController.cadastrarFuncionario)
      .post('/admin/alteracaoFuncionario', FuncionarioController.alteracaoFuncionario) 
      .post('/login', FuncionarioController.login)   
      .get('/admin/cadastrofuncionario', FuncionarioController.cadastroFuncionario)
      .get('/admin/alterarfuncionario/:id', FuncionarioController.alterarFuncionario) 
      .get('/funcionario/home', FuncionarioController.index)  
 
module.exports = router;