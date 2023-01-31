//Definindo os principais módulos
const express = require('express');
const router = express.Router();
const {  Funcionarios, Pontos, Usuarios } = require("../db/indexBD");
const bcrypt = require("bcryptjs");


router.post("/criarnovousuario", async (req,res) =>{
let email = req.body.email;
let senha = req.body.senha;
let salt = bcrypt.genSaltSync(10);
let senhaCriptografada = bcrypt.hashSync(senha, salt);

await Usuarios.create({email:email, senha:senha}).then(
    req.flash("mensagem", "Conta criada com sucesso."),
    res.redirect("/")
)});

module.exports = router;