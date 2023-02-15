//Definindo os principais módulos
const express = require('express');
const FuncionarioController = require('../controllers/FuncionarioController');
const router = express.Router();

router
      .get('/admin/cadastrofuncionario', FuncionarioController.cadastroFuncionario)
      .post('/admin/cadastrarFuncionario', FuncionarioController.cadastrarFuncionario)
      .get('/admin/alterarfuncionario/:id', FuncionarioController.alterarFuncionario)  
      .post('/admin/alteracaoFuncionario', FuncionarioController.alteracaoFuncionario)  
module.exports = router;