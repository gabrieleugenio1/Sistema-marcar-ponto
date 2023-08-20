//Definindo os principais módulos
const express = require('express');
const PrincipalController = require('../controllers/MainController');
const Autentication = require('../middleware/Autentication');
const router = express.Router();

router
      .get('/admin' ,PrincipalController.principal)
      .get('/', PrincipalController.principalFuncionario)
      .get('/esqueci-senha', PrincipalController.esqueciSenha)
      .get('/logout', Autentication.verificaToken, PrincipalController.logout)
      .post('/envioSenha', PrincipalController.enviarSenha)
      .post('/criarNovaSenha', PrincipalController.criarNovaSenha)
      
module.exports = router;