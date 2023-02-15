const bcrypt = require("bcrypt");
const {Funcionarios} = require("../models/indexDB");
const validarFuncionario = require('../functions/validarFuncionario');
const toTitleCase = require('../functions/nameTitle');

module.exports = class FuncionarioController {
 
    
    static async cadastrarFuncionario(req, res) {
        /*Variaveis*/
        let ativo = req.body.ativo;
        if (ativo==='true'){
            ativo = true;
        } else if (ativo==='false'){
            ativo = false;
        }
        const validado = {
            matricula: req.body.matricula,
            nome: req.body.nome,
            email: req.body.email,
            senha :req.body.senha,
            cpf: req.body.cpf,
            funcao: req.body.funcao,
            setor: req.body.setor,
            cargaHorariaSemanal: req.body.cargahorariasemanal,
            ativo: ativo            
        };
        const erros = validarFuncionario(validado, 'cadastro');          
        if (erros.length > 0){
            req.flash("erros", erros);
            return  res.status(200).redirect("/admin/cadastrofuncionario");
        };

        const salt = bcrypt.genSaltSync(10);
        const senhaCriptografada = bcrypt.hashSync(validado.senha, salt);
        const Funcionario = {
            matricula:validado.matricula,
            nome:validado.nome,
            email:validado.email,
            senha:senhaCriptografada,
            cpf: validado.cpf,
            funcao:validado.funcao,
            setor:validado.setor,
            cargahorariasemanal:validado.cargaHorariaSemanal,
            ativo:validado.ativo
        };   

        await Funcionarios.create(Funcionario);
        res.status(200).redirect("/admin/home");

    };      
    static async cadastroFuncionario(req, res) {
        res.status(200).render("admin/cadastrar-funcionario", { title: "Cadastro funcionário", erros: req.flash("erros")});        
    };   

    static async alterarFuncionario (req, res) {
        await Funcionarios.findByPk(req.params.id).then( employee =>{
            res.status(200).render("admin/alterar-funcionario", { title: "Alterar funcionário",funcionario: employee ,erros: req.flash("erros")});  
        });
    };
    static async alteracaoFuncionario (req, res) {
        let ativo = req.body.ativo;
        if (ativo==='true'){
            ativo = true;
        } else if (ativo==='false'){
            ativo = false;
        }
        const validado = {
            matricula: req.body.matricula,
            nome: toTitleCase(req.body.nome),
            email: req.body.email,
            senha :req.body.senha,
            cpf: req.body.cpf,
            funcao: req.body.funcao,
            setor: req.body.setor,
            cargahorariasemanal: req.body.cargahorariasemanal,
            ativo: ativo
        };     
        
        const erros = validarFuncionario(validado, 'alteracao');     
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
            return  res.status(200).redirect(`/admin/alterarfuncionario/${req.body.matricula}`);
        };        
        

        await Funcionarios.update(validado, {where: {matricula: req.body.id}}).then(res.status(200).redirect("/admin/home"))
    .catch(err => {
        console.log(err);}          
    )};


};