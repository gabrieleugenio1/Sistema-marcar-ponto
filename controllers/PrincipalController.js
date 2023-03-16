const {Usuario, Funcionarios} = require("../models/indexModels");
const  gerarCodigo = require("../functions/gerarCodigo");

module.exports = class PrincipalController {
    static async  principal  (req, res) {
        const user = await Usuario.count();
        return res.status(200).render("indexAdmin", { title: "Sistema de ponto", qtdUsuarios: user, mensagem: req.flash("mensagem"), erros: req.flash("erros")});     
    };
    static async  principalFuncionario  (req, res) {
        const employee = await Funcionarios.count();
        return res.status(200).render("index", { title: "Sistema de ponto", qtdFuncionarios: employee, mensagem: req.flash("mensagem"), erros: req.flash("erros")});     
    };
    static async esqueciSenha (req, res) {
        console.log(gerarCodigo())
        return res.status(200).render("esquecisenha", {title: "Esqueci a senha", mensagem: req.flash("mensagem")});
    };
    static async envioSenha (req, res) {
        const email = req.body.email;
        gerarCodigo();
        req.flash('mensagem','Código enviado, caso não encontre, verifique a caixa de spam');
        return res.status(200).redirect("/esqueci-senha");
    };
    static async cadastroFuncionario (req, res)  {
        return res.status(200).render('admin/cadastrar-funcionario', {title: "Cadastro Funcionário", erros: req.flash("erros")});
    };
    static async relatorio (req, res)  {
        return res.status(200).render('admin/relatorio', {title: "Relatório"}); 
    };
    static async logout (req, res)  {
        res.clearCookie('token');
        if (req.tipoConta == 'Admin') {            
            return res.status(200).redirect('/admin');
        }
        return res.status(200).redirect('/')
    };
};