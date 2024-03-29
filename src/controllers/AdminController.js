"use strict";
const { Sequelize } = require('sequelize');
const { Usuario, Funcionarios, Pontos, Relatorios } = require("../models/Models");
const Autentication = require("../middleware/Autentication");
const validarAdmin = require("../functions/validarAdmin");
const moment = require("moment");
const bcrypt = require("bcrypt");
const novoRelatorio = require("../functions/gerarRelatorio");

module.exports = class UsuarioController {

    //Mostrar todos os relatórios - GET
    static async mostrarTodosRelatorios(req, res){
        await Relatorios.findAll({
            raw:true,  
            attributes:[
                "id",
                "caminho",
                [Sequelize.fn('date_format', Sequelize.col('updatedAt'), '%d/%m/%Y - %H:%ih'), 'dataCriacao'],
                [Sequelize.fn('date_format', Sequelize.col('createdAt'), '%d/%m/%Y'), 'arquivo'],
                "usuarioId",           
        ]})
        .then((relatorios) =>{
            return res.status(200).render('./admin/relatorios', {title: "Relatorio Admin", relatorios: relatorios});
            
        });
    };

    //Baixar ou deletar algum relátorio - POST
    static async baixarOuDeletarRelatorio(req, res) {
        const codigo = req.query.codigo;
        const tipo = req.query.tipo;
        if (tipo == "baixar") {
            await Relatorios.findOne({where:{id:codigo}}).then(arquivo => {
                res.status(200).download(arquivo.caminho);
            }).catch(()=> res.send(JSON.stringify("Arquivo não existe")));
        } else if (tipo == "deletar"){
            await Relatorios.destroy({where:{id:codigo}}).then(()=>  res.status(200).redirect("/admin/relatorios"));
        } else {
            res.send(JSON.stringify("Arquivo não existe ou caminho da URL incorreto"));
        }; 
    };

    //Gerar um novo relatório - POST
    static async gerarRelatorio(req, res){
        moment.locale("en-ca");
        let dataSelecionada = req.body.data ? moment(req.body.data).format("L") : null;           
        if(dataSelecionada == "Invalid Date" || !dataSelecionada || dataSelecionada.length > 10) {
            dataSelecionada = "1900-01-01";
        };
        await Funcionarios.findAll({
            raw: true,            
            attributes:[
                "nome",
                "email",
                "cpf",
                "funcao",
                "setor",
                "cargahorariasemanal",
                "ativo"
            ],
            order: [['email', 'ASC']],
            include: [{
            attributes:[
                [Sequelize.fn('date_format', Sequelize.col('dataEntrada'), '%d/%m/%Y'), 'dataEntrada'],
                [Sequelize.fn('date_format', Sequelize.col('horarioEntrada'), '%H:%i'), 'horarioEntrada'],
                [Sequelize.fn('date_format', Sequelize.col('intervaloDataEntrada'), '%d/%m/%Y'), 'intervaloDataEntrada'],
                [Sequelize.fn('date_format', Sequelize.col('intervaloHorarioEntrada'), '%H:%i'), 'intervaloHorarioEntrada'],
                [Sequelize.fn('date_format', Sequelize.col('intervaloDataSaida'), '%d/%m/%Y'), 'intervaloDataSaida'],
                [Sequelize.fn('date_format', Sequelize.col('intervaloHorarioSaida'), '%H:%i'), 'intervaloHorarioSaida'],
                [Sequelize.fn('date_format', Sequelize.col('dataSaida'), '%d/%m/%Y'), 'dataSaida'],
                [Sequelize.fn('date_format', Sequelize.col('horarioSaida'), '%H:%i'), 'horarioSaida'],
            ],
            model: Pontos, 
            where:{dataEntrada: {[Sequelize.Op.gte]: dataSelecionada}},          
    }]})
    .then((employees) => {
        employees.forEach((funcionario) => {
            moment.locale("pt-br"); 
            let horasPagas = 0;
            let horasDescontadas = 0;
            const parteA = funcionario.cpf.substring(0,3);
            const parteB = funcionario.cpf.substring(3,6);
            const parteC = funcionario.cpf.substring(6,9);
            const parteD = funcionario.cpf.substring(9,11);
            funcionario.cpf = parteA + "." + parteB + "." + parteC + "-" + parteD;

            const primeiroPonto = moment(funcionario['pontos.dataEntrada'] + ' ' + funcionario['pontos.horarioEntrada'], 'DD/MM/YYYY HH:mm');
            funcionario.primeiroPonto = primeiroPonto.format('LLL');

            const intervaloEntrada = moment(funcionario['pontos.intervaloDataEntrada'] + ' ' + funcionario['pontos.intervaloHorarioEntrada'], 'DD/MM/YYYY HH:mm');
            funcionario.intervaloEntrada = intervaloEntrada.format('LLL');

            const intervaloSaida = moment(funcionario['pontos.intervaloDataSaida'] + ' ' + funcionario['pontos.intervaloHorarioSaida'], 'DD/MM/YYYY HH:mm');
            funcionario.intervaloSaida = intervaloSaida.format('LLL');

            const ultimoPonto = moment(funcionario['pontos.dataSaida'] + ' ' + funcionario['pontos.horarioSaida'], 'DD/MM/YYYY HH:mm');
            funcionario.ultimoPonto = ultimoPonto.format('LLL');

            ultimoPonto.diff(primeiroPonto, "hours") ? horasPagas += ultimoPonto.diff(primeiroPonto, "hours") : null;
            intervaloSaida.diff(intervaloEntrada, "hours") ? horasDescontadas += intervaloSaida.diff(intervaloEntrada, "hours") : null;
            funcionario.horasPagas = (horasPagas-horasDescontadas);
           
            delete funcionario['pontos.dataEntrada'];
            delete funcionario['pontos.horarioEntrada'];
            delete funcionario['pontos.intervaloDataEntrada'];
            delete funcionario['pontos.intervaloHorarioEntrada'];
            delete funcionario['pontos.intervaloDataSaida'];
            delete funcionario['pontos.intervaloHorarioSaida'];
            delete funcionario['pontos.dataSaida'];
            delete funcionario['pontos.horarioSaida'];
        });   

        moment.locale("cv");    
        novoRelatorio(moment().format("L"), employees, req.userId );         
        return res.status(200).redirect('/admin/relatorios');
        });
    };
    
    //Criação da conta admin(caso não tenha um admin irá mostrar na página principal para criar) - POST
    static async criarConta(req,res) {
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
        const salt = bcrypt.genSaltSync(process.env.SALT_BCRYPT ? parseInt(process.env.SALT_BCRYPT) : 10);
        let senhaCriptografada = bcrypt.hashSync(validado.senha, salt);
        const User = {
            email:validado.email,
            senha:senhaCriptografada
        };
        await Usuario.create(User).then( user => {
            res.redirect("/admin");
        });};

        //Login do admin - POST
    static async login(req, res) { 
        res.clearCookie('token');
        let erros = [];
        let email = req.body.email;
        let senha = req.body.senha;
        await Usuario.findOne({ where: { email: email} }).then(usuario => {
            {
              if (usuario != undefined) {
                if (bcrypt.compareSync(senha, usuario.senha)) {
                    const token = Autentication.gerarToken(usuario, "Admin");
                    res.cookie("token", token, {
                      httpOnly: true,
                    });
                    console.log('Você está logado com e-mail e senha\n', token);
                    return res.status(200).redirect("/admin/home");
                } else {
                    erros.push({ error:"Email ou senha invalidos."});
                    req.flash("erros", erros);
                  return res.status(200).redirect("/admin");
                };
              } else {
                erros.push({ error:"Email ou senha invalidos."});
                req.flash("erros", erros);
                res.status(200).redirect("/admin");
              };
            };
        });
    };

    //Página principal do admin - GET
    static async index(req, res) {
        let todosFuncionarios = await Funcionarios.findAll(
            {   
                include: [{
                model: Pontos,
                attributes:[
                    "id",
                    [Sequelize.fn('date_format', Sequelize.col('dataEntrada'), '%d/%m/%Y'), 'dataEntrada'],
                    [Sequelize.fn('date_format', Sequelize.col('horarioEntrada'), '%H:%i'), 'horarioEntrada'],
                    [Sequelize.fn('date_format', Sequelize.col('intervaloDataEntrada'), '%d/%m/%Y'), 'intervaloDataEntrada'],
                    [Sequelize.fn('date_format', Sequelize.col('intervaloHorarioEntrada'), '%H:%i'), 'intervaloHorarioEntrada'],
                    [Sequelize.fn('date_format', Sequelize.col('intervaloDataSaida'), '%d/%m/%Y'), 'intervaloDataSaida'],
                    [Sequelize.fn('date_format', Sequelize.col('intervaloHorarioSaida'), '%H:%i'), 'intervaloHorarioSaida'],
                    [Sequelize.fn('date_format', Sequelize.col('dataSaida'), '%d/%m/%Y'), 'dataSaida'],
                    [Sequelize.fn('date_format', Sequelize.col('horarioSaida'), '%H:%i'), 'horarioSaida'],
                    "funcionarioMatricula"
                ],
                where:{dataEntrada: {[Sequelize.Op.between]: [moment().day(0).toDate(), moment().day(6).toDate()]}}, 
                required:false,     
            }], 
            order: [
                ['ativo', 'DESC'],
                ['matricula', 'ASC'],
                ['nome', 'ASC'],
            ],
        });
        todosFuncionarios = JSON.parse(JSON.stringify(todosFuncionarios, null, 2 ));
        todosFuncionarios.map((funcionario) =>{
            let horasPagas = 0;
            let horasDescontadas = 0;
            const parteA = funcionario.cpf?.substring(0,3);
            const parteB = funcionario.cpf?.substring(3,6);
            const parteC = funcionario.cpf?.substring(6,9);
            const parteD = funcionario.cpf?.substring(9,11);
            funcionario.cpf = parteA + "." + parteB + "." + parteC + "-" + parteD;

            for(let pontos of funcionario.pontos) {
                const primeiroPonto = moment(pontos['dataEntrada'] + ' ' +  pontos['horarioEntrada'], 'DD/MM/YYYY HH:mm');
                const ultimoPonto = moment(pontos['dataSaida'] + ' ' + pontos['horarioSaida'], 'DD/MM/YYYY HH:mm');
                ultimoPonto.diff(primeiroPonto, "hours") ? horasPagas += ultimoPonto.diff(primeiroPonto, "hours") : null;


                const entradaIntervalo = moment(pontos['intervaloDataEntrada'] + ' ' +  pontos['intervaloHorarioEntrada'], 'DD/MM/YYYY HH:mm');
                const saidaIntervalo = moment(pontos['intervaloDataSaida'] + ' ' +  pontos['intervaloHorarioSaida'], 'DD/MM/YYYY HH:mm');
                saidaIntervalo.diff(entradaIntervalo, "hours") ? horasDescontadas += saidaIntervalo.diff(entradaIntervalo, "hours") : null;
            };
            funcionario.horasPagas = (horasPagas-horasDescontadas);

            if(funcionario.pontos.length >= 1) {
                funcionario.ultimaEntrada = funcionario.pontos[funcionario.pontos.length -1].dataEntrada.concat(' ', funcionario.pontos[funcionario.pontos.length -1].horarioEntrada);
                if(funcionario.pontos[funcionario.pontos.length -1].horarioSaida) funcionario.ultimoPonto = funcionario.pontos[funcionario.pontos.length -1].dataSaida.concat(' ', funcionario.pontos[funcionario.pontos.length -1].horarioSaida);
                delete funcionario.pontos;
            };

            if(funcionario.horasPagas == funcionario.cargahorariasemanal) {
                funcionario.semanaPaga = "Sim";
            }else if(funcionario.horasPagas > funcionario.cargahorariasemanal) {
                funcionario.semanaPaga = "Com Horas extras";
            }else if(funcionario.horasPagas < funcionario.cargahorariasemanal) {
                funcionario.semanaPaga = "Não";
            };


        });
        return res.status(200).render('./admin/home', {title: "Home", funcionarios: todosFuncionarios});
    };

    //Mostrar página para alteração dos dados do admin - GET
    static async renderAlterarDados(req, res)  {
        await Usuario.findAll().then(user => {
            res.status(200).render('./admin/alterar-dados', {title: "Alterar conta", user:user[0], erros: req.flash("erros")});
        });
    };

    //Alteração dos dados do admin - POST
    static async alterarDados (req, res)  {
        const validado = {
            id:req.body.id,
            email: req.body.email,  
            senha: req.body.senha
        };
        const erros = validarAdmin(validado, 'alteracao');     
        const salt = bcrypt.genSaltSync(10);
        const senhaCriptografada = bcrypt.hashSync(validado.senha, salt);        

        if(req.body.senha == undefined || req.body.senha == null || req.body.senha.trim() == ''){
            delete validado.senha;         
        }else if (req.body.senha <= 6) {
            erros.push({error: "Senha inválida! A senha deve ter no minimo 6 caracteres."});
        }else{
            validado.senha = senhaCriptografada;
        };       
        if (erros.length > 0){
            req.flash("erros", erros);
            return  res.status(200).redirect(`/admin/alterardados`);
        };   
        await Usuario.update(validado, {where: {id: req.body.idAtual}}).then(user => {
            res.status(200).redirect('/admin/home');
        });
    };
};