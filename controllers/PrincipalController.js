const {Usuario, Funcionarios, Codigo, Sequelize} = require("../models/indexModels");
const enviarEmail = require("../functions/enviarEmail");
const gerarCodigo = require("../functions/gerarCodigo");
const moment = require('moment');
const bcrypt = require('bcrypt');

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
        const codigo = req.query['codigo'];
        return res.status(200).render("esqueciSenha", { title: "Esqueci a senha", codigo: codigo, mensagem: req.flash("mensagem"), mensagemErro: req.flash("mensagemErro")});
    };

    static async envioSenha (req, res) {
        const email = req.body.email;
        let codigo = gerarCodigo();
        const usuarioEmail = await Usuario.findOne({where:{email: email}})
        const funcionarioEmail = await Funcionarios.findOne({where:{email: email}})
        if(usuarioEmail){
            const codigoEmail = await Codigo.create({codigo:codigo, dataGerada:Sequelize.fn('NOW'), horarioGerado:Sequelize.fn('NOW'), ativo:true,usuarioId:usuarioEmail.id}); 
            const link = req.headers.host + '/esqueci-senha?codigo=' + codigoEmail.codigo;
            enviarEmail(link, usuarioEmail.email, req.protocol);
        }else if(funcionarioEmail){
            const codigoEmail = await Codigo.create({codigo:codigo, dataGerada:Sequelize.fn('NOW'), horarioGerado:Sequelize.fn('NOW'), ativo:true,funcionarioMatricula:funcionarioEmail.matricula}); 
            const link = req.headers.host + '/esqueci-senha?codigo=' + codigoEmail.codigo;
            enviarEmail(link, funcionarioEmail.email, req.protocol);
        };
        req.flash('mensagem','Link para recuperação enviado,caso não encontre, verifique a caixa de spam');
        return res.status(200).redirect("/esqueci-senha");
    };

    static async criarNovaSenha (req, res) {
        const { senhaUm, senhaDois, CodigoHidden} = req.body;
        if(senhaUm === senhaDois && senhaUm.length >= 6){
            const dataAtual = moment(Date.now());
            let horarioToken;
            let diferenca;
            const salt = bcrypt.genSaltSync(10);
            const senhaCriptografada = bcrypt.hashSync(senhaUm, salt);
            const user = await Codigo.findOne({
                raw:true, 
                include: {model: Funcionarios, Usuario}, 
                where: { codigo: CodigoHidden }}
            );
            if(user) horarioToken = moment(user.dataGerada), diferenca = dataAtual.diff(horarioToken, 'minutes');
            if(diferenca <= 5){
                req.flash('mensagem','Alteração feita com sucesso!');
                if(user?.usuarioId) {
                    await Usuario.update({senha:senhaCriptografada}, {where: {id: user?.usuarioId}})                 
                    return res.status(200).redirect("/admin");
                }else{
                    await Funcionarios.update({senha:senhaCriptografada}, {where: {email: user['funcionario.email']}})
                    return res.status(200).redirect("/");
                }
            };
            req.flash('mensagemErro','Código expirado ou inexistente.');
            return res.status(200).redirect("/esqueci-senha");
        };
        req.flash('mensagemErro','Insira uma senha valida.');
        return res.status(200).redirect(`/esqueci-senha?codigo=${CodigoHidden}`);
    };

    static async cadastroFuncionario (req, res)  {
        return res.status(200).render('admin/cadastrar-funcionario', {title: "Cadastrar nova senha", erros: req.flash("erros")});
    };

    static async relatorio (req, res)  {
        return res.status(200).render('admin/relatorio', {title: "Relatório"}); 
    };
    
    static async logout (req, res)  {
        res.clearCookie('token');
        if (req.tipoConta === 'Admin') {            
            return res.status(200).redirect('/admin');
        }
        return res.status(200).redirect('/')
    };
};