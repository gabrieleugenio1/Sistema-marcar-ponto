//Definindo os principais módulos
const express = require('express');
const PrincipalController = require('../controllers/PrincipalController');
const router = express.Router();

router
      .get('/', PrincipalController.principal)
      .get('/esqueci-senha', PrincipalController.esqueciSenha)
      


      
module.exports = router;