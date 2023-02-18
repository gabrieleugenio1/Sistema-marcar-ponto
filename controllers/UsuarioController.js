const { Usuario, Funcionarios } = require('../models/indexDB');
const validarAdmin = require('../functions/validarAdmin');

const bcrypt = require("bcrypt");

module.exports = class UsuarioController {

    static async criarConta (req,res) {
        /** INICIO DAS VALIDAÇÕES **/
        let erros = [];

        let regex = {
        email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
        senha: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        };

        let email = req.body.email;
        email = email.trim(); // Limpa espaços em branco no inicio e final do e-mail.
        email = email.toLowerCase(); // Padroniza o e-mail em minúsculo.
        
        let senha = req.body.senha;

        if (!email || email == undefined || email == null || !regex.email.test(email)) {
        erros.push({ error: "E-mail inválido!" });
        }  

        if(!senha || senha == undefined || senha == null || senha < 6){
           erros.push({error: "Senha inválida! A senha deve ter no minimo 6 caracteres."});
        }
        /* FINAL DAS VALIDAÇÕES */   
         
        if(erros.length > 0){
            req.flash("erros", erros);
            return res.status(200).redirect("/");
        };
        const salt = bcrypt.genSaltSync(10);
        let senhaCriptografada = bcrypt.hashSync(senha, salt);
        const User = {
            email:email,
            senha:senhaCriptografada
        };
        await Usuario.create(User).then( user => {
            res.redirect("/");
        });};

    static async login (req, res) {
        let erros = [];
        let email = req.body.email;
        let senha = req.body.senha;
        await Usuario.findOne({ where: { email: email} }).then(usuario => {
            {
              if (usuario != undefined) {
                if (bcrypt.compareSync(senha, usuario.senha)) {
                 /* req.session.usuario = {
                    id: usuario.id,
                    email: usuario.email
                  };*/
                  console.log(usuario)
                  return res.redirect("admin/home");
                } else {
                    erros.push({ error:"Email ou senha invalidos."});
                    req.flash("erros", erros);
                  return res.redirect("/");
                };
              } else {
                erros.push({ error:"Email ou senha invalidos."});
                req.flash("erros", erros);
                res.redirect("/");
              };
            };
          });
    };

    static async home (req, res)  {
        await Funcionarios.findAll().then(employees =>{
            employees.forEach(funcionario => {
                let cpf = funcionario.cpf;
                let parteA = cpf.substring(0,3);
                let parteB = cpf.substring(3,6);
                let parteC = cpf.substring(6,9);
                let parteD = cpf.substring(9,11);
                cpf = parteA + "." + parteB + "." + parteC + "-" + parteD;
                funcionario.cpf=cpf;    
            });                     
            res.status(200).render('admin/home', {title: "Home", funcionarios: employees});
        });
    };

    static async alterarDados (req, res)  {
        await Usuario.findAll().then(user => {
            console.log(user[0]);
            res.status(200).render('admin/alterar-dados', {title: "Alterar conta",user:user[0] ,erros: req.flash("erros")});
        });
    };

    static async alteracaoDados (req, res)  {
        const validado = {
            id:req.body.id,
            idAtual:req.body.idAtual,
            email: req.body.email,  
            senha: req.body.senha
        }
        const erros = validarAdmin(validado, 'alteracao');     
        const salt = bcrypt.genSaltSync(10);
        const senhaCriptografada = bcrypt.hashSync(validado.senha, salt);        
        console.log(validado);

        if(req.body.senha == undefined || req.body.senha == null || req.body.senha.trim() == ''){
            delete validado.senha;         
        }else if (req.body.senha <= 6) {
            erros.push({error: "Senha inválida! A senha deve ter no minimo 6 caracteres."});
        }else{
            validado.senha = senhaCriptografada;
        }
        if (erros.length > 0){
            req.flash("erros", erros);
            return  res.status(200).redirect(`/admin/alterarfuncionario/${req.body.matricula}`);
        };   
        await Usuario.update({where:{id: validado.id}}).then(user => {
            console.log(user[0]);
            res.status(200).render('admin/alterar-dados', {title: "Alterar conta",user:user[0] ,erros: req.flash("erros")});
        });
    };
};

