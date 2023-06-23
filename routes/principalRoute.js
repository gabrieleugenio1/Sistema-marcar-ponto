//Definindo os principais módulos
const express = require('express');
const PrincipalController = require('../controllers/PrincipalController');
const Autenticacao = require('../middleware/Autenticacao');
const router = express.Router();

router
      .get('/admin' ,PrincipalController.principal)
      .get('/', PrincipalController.principalFuncionario)
      .get('/esqueci-senha', PrincipalController.esqueciSenha)
      .get('/logout', Autenticacao.verificaToken, PrincipalController.logout)
      .post('/envioSenha', PrincipalController.envioSenha)
      .post('/criarNovaSenha', PrincipalController.criarNovaSenha)
      
module.exports = router;