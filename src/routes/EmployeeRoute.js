//Definindo os principais módulos
const express = require('express');
const FuncionarioController = require('../controllers/EmployeeController');
const Autentication = require('../middleware/Autentication');
const router = express.Router();

router
      .post('/admin/cadastrarFuncionario', Autentication.verificaTokenAdmin, FuncionarioController.cadastrarFuncionario)
      .post('/admin/alteracaoFuncionario', Autentication.verificaTokenAdmin, FuncionarioController.alterarFuncionario) 
      .post('/funcionario/registraPonto', Autentication.verificaTokenFuncionario, FuncionarioController.registrarPonto) 
      .post('/login', FuncionarioController.login)   
      .get('/admin/cadastrofuncionario', Autentication.verificaTokenAdmin, FuncionarioController.renderCadastrarFuncionario)
      .get('/admin/alterarfuncionario/:id', Autentication.verificaTokenAdmin, FuncionarioController.renderAlterarFuncionario) 
      .get('/funcionario/home', Autentication.verificaTokenFuncionario,FuncionarioController.index)  
      //.get('/funcionario/relatorios',Autentication.verificaTokenFuncionario, FuncionarioController.relatorio)
      
module.exports = router;