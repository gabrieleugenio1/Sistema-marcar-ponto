//Definindo os principais módulos
const express = require('express');
const PrincipalController = require('../controllers/PrincipalController');
const router = express.Router();

router
      .get('/', PrincipalController.principal)
      .get('/esqueci-senha', PrincipalController.esqueciSenha )
      .get('/criar-conta', PrincipalController.criarConta)

      
module.exports = router;