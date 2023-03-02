const { Usuario, Funcionarios, Pontos } = require('../models/indexModels');
const validarAdmin = require('../functions/validarAdmin');
const Autenticacao = require('../middleware/Autenticacao');
const bcrypt = require("bcrypt");

module.exports = class UsuarioController {

    static async criarConta (req,res) {
        const validado = {
            id:req.body.id,
            idAtual:req.body.idAtual,
            email: req.body.email,  
            senha: req.body.senha
        }
        const erros = validarAdmin(validado, 'cadastro');     

        if(erros.length > 0){
            req.flash("erros", erros);
            return res.status(200).redirect("/");
        };
        const salt = bcrypt.genSaltSync(10);
        let senhaCriptografada = bcrypt.hashSync(validado.senha, salt);
        const User = {
            email:validado.email,
            senha:senhaCriptografada
        };
        await Usuario.create(User).then( user => {
            res.redirect("/admin");
        });};

    static async login (req, res) { 
        res.clearCookie('token');
        let erros = [];
        let email = req.body.email;
        let senha = req.body.senha;
        await Usuario.findOne({ where: { email: email} }).then(usuario => {
            {
              if (usuario != undefined) {
                if (bcrypt.compareSync(senha, usuario.senha)) {
                    const token = Autenticacao.gerarToken(usuario, "Admin");
                    res.cookie("token", token, {
                      httpOnly: true,
                    });
                    console.log('Você está logado com e-mail e senha\n', token);
                    return res.redirect("/admin/home");
                } else {
                    erros.push({ error:"Email ou senha invalidos."});
                    req.flash("erros", erros);
                  return res.redirect("/admin");
                };
              } else {
                erros.push({ error:"Email ou senha invalidos."});
                req.flash("erros", erros);
                res.redirect("/admin");
              };
            };
        });
    };

    static async home (req, res)  {
        await Funcionarios.findAll({
            raw: true,
            include: [{
                model: Pontos, 
                group: ['matricula'],
                order: [ [ 'tipo', 'ASC' ]]
    }]}).then((employees) =>{
            employees.forEach((funcionario) => {
                let cpf = funcionario.cpf;
                let parteA = cpf.substring(0,3);
                let parteB = cpf.substring(3,6);
                let parteC = cpf.substring(6,9);
                let parteD = cpf.substring(9,11);
                cpf = parteA + "." + parteB + "." + parteC + "-" + parteD;
                funcionario.cpf=cpf;   
                console.log(funcionario)
            });                     
         return res.status(200).render('./admin/home', {title: "Home", funcionarios: employees});
        });
    };

    static async alterarDados (req, res)  {
        await Usuario.findAll().then(user => {
            console.log(user[0]);
            res.status(200).render('./admin/alterar-dados', {title: "Alterar conta",user:user[0] ,erros: req.flash("erros")});
        });
    };

    static async alteracaoDados (req, res)  {
        const validado = {
            id:req.body.id,
            email: req.body.email,  
            senha: req.body.senha
        }
        console.log(validado)
        const erros = validarAdmin(validado, 'alteracao');     
        const salt = bcrypt.genSaltSync(10);
        const senhaCriptografada = bcrypt.hashSync(validado.senha, salt);        

        if(req.body.senha == undefined || req.body.senha == null || req.body.senha.trim() == ''){
            delete validado.senha;         
        }else if (req.body.senha <= 6) {
            erros.push({error: "Senha inválida! A senha deve ter no minimo 6 caracteres."});
        }else{
            validado.senha = senhaCriptografada;
        }
        
        if (erros.length > 0){
            req.flash("erros", erros);
            return  res.status(200).redirect(`/admin/alterardados`);
        };   
        await Usuario.update(validado, {where: {id: req.body.idAtual}}).then(user => {
            res.status(200).redirect('/admin/home');
        });
    };
};