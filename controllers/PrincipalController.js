const bcrypt = require("bcrypt");



module.exports = class PrincipalController {
    static async  principal (req, res) {
        res.status(200).render("index", { title: "Sistema de ponto", mensagem: req.flash("mensagem"), erros: req.flash("erros")});
    };
    static async esqueciSenha (req, res) {
        res.status(200).render("esquecisenha", {title: "Esqueci a senha"});
    };
    static async criarConta (req, res) {
        res.status(200).render("criarconta", {title: "Criar conta"} );
    };
};