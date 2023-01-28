//Definindo os principais módulos
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render("index", { title: "Sistema de pontuação", mensagem: req.flash("mensagem")});
});

router.get('/esquecisenha', (req,res) =>{
    res.render("esquecisenha", {title: "Esqueci a senha"});
});

router.get('/criarconta', (req,res) =>{
    res.render("criarconta", {title: "Criar conta"} );
});

module.exports = router;