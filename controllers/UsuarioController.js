const { Usuarios } = require('../models/indexDB');
const bcrypt = require("bcrypt");

module.exports = class UsuarioController {
    static async criarConta (req,res) {
        /** INICIO DAS VALIDAÇÕES **/
        let erros = [];

        let regex = {
        email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
        senha: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        }

        let email = req.body.email;
        email = email.trim(); // Limpa espaços em branco no inicio e final do e-mail.
        email = email.toLowerCase(); // Padroniza o e-mail em minúsculo.

        let senha = req.body.senha;
        /*
        let cpf = req.body.cpf;
        cpf = cpf.trim(); // Limpa espaços em branco no inicio e final do cpf.
        cpf = cpf.replace(/[^\d]/g, ''); // Remove caracteres não numéricos.
        
        if (!validateCPF(cpf) || !cpf || cpf == undefined || cpf == null) {
        erros.push({ error: "CPF inválido!" });
        }
        */

        if (!email || email == undefined || email == null || !regex.email.test(email)) {
        erros.push({ error: "E-mail inválido!" });
        }

      


        if(!senha || senha == undefined || senha == null || senha < 8 || !regex.senha.test(senha)){
           erros.push({error: "Senha inválida! A senha deve ter no minimo 8 caracteres."})
        }

        /* FINAL DAS VALIDAÇÕES */   

        console.log(erros)         
        if(erros.length > 0){
            req.flash("erros", erros)
            return res.status(200).redirect("/")
        }

        let salt = bcrypt.genSaltSync(10);
        let senhaCriptografada = bcrypt.hashSync(senha, salt);
        await Usuarios.create({email:email, senha:senhaCriptografada}).then( user => {
            req.flash("mensagem", "Conta criada com sucesso."),
            res.redirect("/")
        })};

    static async login (req,res) {

    };



};

