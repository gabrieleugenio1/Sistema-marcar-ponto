"use strict";
const { Sequelize } = require('sequelize');
const { Funcionarios, Pontos } = require("../models/Models");
const Autentication = require('../middleware/Autentication');
const bcrypt = require("bcrypt");
const validarFuncionario = require('../functions/validarFuncionario');
const toTitleCase = require('../functions/nameTitle');

module.exports = class FuncionarioController {
    
    //Login no sistema - POST
    static async login(req, res) {
        res.clearCookie('token');
        const { email, senha } = req.body;
        const erros = [];
        await Funcionarios.findOne({ where: { email: email} }).then(employee => {
            {
              if (employee != undefined) {
                if (bcrypt.compareSync(senha, employee.senha) && employee.ativo === true) {
                  const token = Autentication.gerarToken(employee);
                  res.cookie("token", token, {
                      httpOnly: true,
                    });
                    console.log(token)
                  return res.redirect("/funcionario/home");
                } else {
                    erros.push({ error:"Email ou senha invalidos."});
                    req.flash("erros", erros);
                  return res.redirect("/");
                };
              } else {
                erros.push({ error:"Email ou senha invalidos."});
                req.flash("erros", erros);
                return res.redirect("/");
              };
            };
          });
    };

    //Página principal do funcionário - GET
    static async index(req,res) {
        const finalDate = new Date().toLocaleString("en-CA", {timeZone: "America/Recife"}).split(',')[0];
        let qtdPontos = await Pontos.count({where: {dataEntrada:finalDate, funcionarioMatricula: req.userId }});
        qtdPontos += await Pontos.count({where: {intervaloDataEntrada:finalDate, funcionarioMatricula: req.userId }});
        qtdPontos += await Pontos.count({where: {intervaloDataSaida:finalDate, funcionarioMatricula: req.userId }});
        qtdPontos += await Pontos.count({where: {dataSaida:finalDate, funcionarioMatricula: req.userId }});
        console.log(qtdPontos)
        return res.status(200).render('./funcionario/home', {title: 'Home', erros: req.flash("erros"), presenca: qtdPontos});
    };

    //Cadastrar funcionário - GET
    static async renderCadastrarFuncionario(req, res) {
        return  res.status(200).render("./admin/cadastrar-funcionario", { title: "Cadastro funcionário", erros: req.flash("erros")});       
    };  

    //Cadastrar funcionário - POST
    static async cadastrarFuncionario(req, res) {
        /*Variaveis*/
        let ativo = req.body.ativo;
        if (ativo == 'true'){
            ativo = true;
        } else if (ativo == 'false'){
            ativo = false;
        };
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
        const erros = await validarFuncionario(validado, 'cadastro');          
        if (erros.length > 0){
            req.flash("erros", erros);
            return res.status(200).redirect("/admin/cadastrofuncionario");
        };

        const salt = bcrypt.genSaltSync(process.env.SALT_BCRYPT ? parseInt(process.env.SALT_BCRYPT) : 10);
        const senhaCriptografada = bcrypt.hashSync(validado.senha, salt);
        validado.senha=senhaCriptografada; 
        try{
            await Funcionarios.create(validado).then(() => {
               return res.status(201).redirect("/admin/home")}
            );
        }catch{
            req.flash("erros", [{error: "Falha ao criar funcionário."}]);
            return res.status(500).redirect("/admin/home");
        } 
    };
          
    static async renderAlterarFuncionario(req, res) {
        await Funcionarios.findByPk(req.params.id).then( employee =>{
        return res.status(200).render("./admin/alterar-funcionario", { title: "Alterar funcionário",funcionario: employee ,erros: req.flash("erros")});  
        });
    };

    //Modificar dados do funcionário - POST
    static async alterarFuncionario(req, res) {
        let ativo = req.body.ativo;        
        if (ativo === 'true') {
            ativo = true;
        } else if (ativo === 'false') {
            ativo = false;
        };
        const validado = {
            matricula: req.body.matricula,
            nome: toTitleCase(req.body.nome),
            email: req.body.email,
            senha :req.body.senha,
            funcao: req.body.funcao,
            setor: req.body.setor,
            cargahorariasemanal: req.body.cargahorariasemanal,
            ativo: ativo
        };     
        const erros = await validarFuncionario(validado, 'alteracao', req.body.id);   
        if(req.body.senha == undefined || req.body.senha == null || req.body.senha.trim() == '') {
            delete validado.senha;         
        }else if (req.body.senha <= 6) {
            erros.push({error: "Senha inválida! A senha deve ter no minimo 6 caracteres."});
        }else{
            const salt = bcrypt.genSaltSync(process.env.SALT_BCRYPT || 10);
            const senhaCriptografada = bcrypt.hashSync(validado.senha, salt);   
            validado.senha = senhaCriptografada;          
        }
        if (erros.length > 0){
            req.flash("erros", erros);
            return  res.status(200).redirect(`/admin/alterarfuncionario/${req.body.matricula}`);
        };        

        await Funcionarios.update(validado, {where: {matricula: req.body.id}}).then(() => {return res.status(200).redirect("/admin/home")})
        .catch(err => {
            console.log(err);
        });
    };

    //Registrar o ponto do funcionário - POST
    static async registrarPonto(req, res) {
        const finalDate = new Date().toLocaleString("en-CA", {timeZone: "America/Recife"}).split(',')[0];
        let quantidade = await Pontos.count({where: {dataEntrada:finalDate, funcionarioMatricula: req.userId }});
        quantidade += await Pontos.count({where: {intervaloDataEntrada:finalDate, funcionarioMatricula: req.userId }});
        quantidade += await Pontos.count({where: {intervaloDataSaida:finalDate, funcionarioMatricula: req.userId }});
        quantidade += await Pontos.count({where: {dataSaida:finalDate, funcionarioMatricula: req.userId }});
        console.log("Contagem:", quantidade)
        if(quantidade == 0){
            console.log("Primeira entrada no dia", finalDate);
            return await Pontos.create({dataEntrada: Sequelize.fn('NOW'), horarioEntrada: Sequelize.fn('NOW'), funcionarioMatricula: req.userId }, {include: [ Funcionarios ]}).then(()=>{
                return res.status(201).redirect('/funcionario/home');
            }).catch(err => console.log(err));  
        }else if(quantidade == 1){
            console.log("Houve uma entrada no dia", finalDate);
            return await Pontos.update({intervaloDataEntrada: Sequelize.fn('NOW'), intervaloHorarioEntrada: Sequelize.fn('NOW')}, {where: {dataEntrada: Sequelize.NOW(), funcionarioMatricula: req.userId}}, {include: [ Funcionarios ]}).then(()=>{
                return res.status(200).redirect('/funcionario/home');
            }).catch(err => console.log(err));  
        }else if(quantidade == 2){
            console.log("Houve um intervalo no dia", finalDate);
            return await Pontos.update({intervaloDataSaida: Sequelize.fn('NOW'), intervaloHorarioSaida: Sequelize.fn('NOW')}, {where: {dataEntrada: Sequelize.NOW(), funcionarioMatricula: req.userId}}, {include: [ Funcionarios ]}).then(()=>{
                return res.status(200).redirect('/funcionario/home');
            }).catch(err => console.log(err));  
        }else if(quantidade == 3){
            console.log("Houve uma saida do intervalo no dia", finalDate);
            return await Pontos.update({dataSaida: Sequelize.fn('NOW'), horarioSaida: Sequelize.fn('NOW')}, {where: {dataEntrada: Sequelize.NOW(), funcionarioMatricula: req.userId}}, {include: [ Funcionarios ]}).then(()=>{
                return res.status(200).redirect('/funcionario/home');
            }).catch(err => console.log(err));  
        };
        
        console.log("Já teve uma entrada e saída")
        return res.status(200).redirect('/funcionario/home');
    };
};