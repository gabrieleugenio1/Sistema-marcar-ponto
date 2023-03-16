//Definindo os principais módulos
const express = require('express');
const PrincipalController = require('../controllers/PrincipalController');
const Autenticacao = require('../middleware/Autenticacao');
const router = express.Router();

router
      .get('/admin' ,PrincipalController.principal)
      .get('/', PrincipalController.principalFuncionario)
      .get('/esqueci-senha', PrincipalController.esqueciSenha)
      .post('/envioSenha', PrincipalController.envioSenha)
      .get('/logout', Autenticacao.verificaToken, PrincipalController.logout)
      


      
module.exports = router;