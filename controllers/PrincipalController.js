const bcrypt = require("bcrypt");
const {Usuario,Funcionarios} = require("../models/indexDB");


module.exports = class PrincipalController {
    static async  principal  (req, res) {
        const user = await Usuario.count();
        res.status(200).render("indexAdmin", { title: "Sistema de ponto",qtdUsuarios: user, mensagem: req.flash("mensagem"), erros: req.flash("erros")});     
    };
    static async  principalFuncionario  (req, res) {
        const employee = await Funcionarios.count();
        res.status(200).render("index", { title: "Sistema de ponto",qtdFuncionarios: employee, mensagem: req.flash("mensagem"), erros: req.flash("erros")});     
    };
    static async esqueciSenha (req, res) {
        res.status(200).render("esquecisenha", {title: "Esqueci a senha"});
    };
    static async cadastroFuncionario (req, res)  {
        res.status(200).render('admin/cadastrar-funcionario', {title: "Cadastro Funcionário", erros: req.flash("erros")});
    };
    static async relatorio (req, res)  {
        res.status(200).render('admin/relatorio', {title: "Relatório"});
    };
};