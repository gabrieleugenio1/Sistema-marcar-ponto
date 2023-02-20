//Definindo os principais módulos
const express = require('express');
const PrincipalController = require('../controllers/PrincipalController');
const router = express.Router();

router
      .get('/admin', PrincipalController.principal)
      .get('/', PrincipalController.principalFuncionario)
      .get('/esqueci-senha', PrincipalController.esqueciSenha)
      


      
module.exports = router;