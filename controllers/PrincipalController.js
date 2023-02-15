const bcrypt = require("bcrypt");
const Funcionarios = require("../models/Funcionarios");
const Usuario = require("../models/Usuario");


module.exports = class PrincipalController {
    static async  principal  (req, res) {
      const user = await Usuario.count();
            console.log(user.length);
            res.status(200).render("index", { title: "Sistema de ponto",qtdUsuarios: user, mensagem: req.flash("mensagem"), erros: req.flash("erros")});
        
    };
    static async esqueciSenha (req, res) {
        res.status(200).render("esquecisenha", {title: "Esqueci a senha"});
    };
    
    static async cadastroFuncionario (req, res)  {
        res.status(200).render('admin/cadastrar-funcionario', {title: "Cadastro Funcionário", erros: req.flash("erros")});
    }
    static async relatorio (req, res)  {
        res.status(200).render('admin/relatorio', {title: "Relatório"});
    }
};