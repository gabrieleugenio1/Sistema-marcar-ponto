const { Usuario, Funcionarios, Pontos, Sequelize, Relatorios } = require("../models/indexModels");
const validarAdmin = require("../functions/validarAdmin");
const Autenticacao = require("../middleware/Autenticacao");
const moment = require("moment");
const bcrypt = require("bcrypt");
const novoRelatorio = require("../functions/gerarRelatorio");

module.exports = class UsuarioController {

    static async relatorio (req, res){
        await Relatorios.findAll({
            raw:true,  
            attributes:[
                "id",
                "caminho",
                [Sequelize.fn('date_format', Sequelize.col('updatedAt'), '%d/%m/%Y - %H:%ih'), 'dataCriacao'],
                [Sequelize.fn('date_format', Sequelize.col('createdAt'), '%d/%m/%Y'), 'arquivo'],
                "usuarioId",           
        ]}).then((relatorios) =>{
            return res.status(200).render('./admin/relatorios', {title: "Relatorio Admin", relatorios: relatorios});
            
        });
    };

    static async baixarRelatorio (req, res) {
        const codigo = req.query.codigo;
        const tipo = req.query.tipo;
        if (tipo == "baixar"){
            await Relatorios.findOne({where:{id:codigo}}).then(arquivo => {
                res.status(200).download(arquivo.caminho);
            }).catch(()=> res.send(JSON.stringify("Arquivo não existe")));
        }else if(tipo == "deletar"){
            await Relatorios.destroy({where:{id:codigo}}).then(()=>  res.status(200).redirect("/admin/relatorios"));
        }else{
            res.send(JSON.stringify("Arquivo não existe ou caminho da URL incorreto"));
        }; 
        };

    static async gerarRelatorio(req, res){
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
                [Sequelize.fn('date_format', Sequelize.col('dataSaida'), '%d/%m/%Y'), 'dataSaida'],
                [Sequelize.fn('date_format', Sequelize.col('horarioSaida'), '%H:%i'), 'horarioSaida'],
            ],
            model: Pontos, 
            where:{dataEntrada: {[Sequelize.Op.gte]: moment().subtract(7, 'days').toDate()}},          
}]}).then((employees) => {
        employees.forEach((funcionario) => {
            moment.locale("pt-br"); 
            const parteA = funcionario.cpf.substring(0,3);
            const parteB = funcionario.cpf.substring(3,6);
            const parteC = funcionario.cpf.substring(6,9);
            const parteD = funcionario.cpf.substring(9,11);
            funcionario.cpf = parteA + "." + parteB + "." + parteC + "-" + parteD;
            const dataAtual = moment(funcionario['pontos.dataSaida'] + ' ' + funcionario['pontos.horarioSaida'], 'DD/MM/YYYY HH:mm');
            funcionario.dataSaida = dataAtual.format('LLL');
            const primeiroPonto = moment(funcionario['pontos.dataEntrada'] + ' ' + funcionario['pontos.horarioEntrada'], 'DD/MM/YYYY HH:mm');
            funcionario.dataEntrada = primeiroPonto.format('LLL'); ;
            dataAtual.diff(primeiroPonto, "hours") ? funcionario.horasPaga = dataAtual.diff(primeiroPonto, "hours") : null;
            delete funcionario['pontos.dataEntrada'];
            delete funcionario['pontos.horarioEntrada'];
            delete funcionario['pontos.dataSaida'];
            delete funcionario['pontos.horarioSaida'];
        });   
        moment.locale("cv");    
        novoRelatorio(moment().format("L"), employees, req.userId );         
        return res.status(200).redirect('/admin/relatorios');
    });
    };

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

    static async home (req, res)  {
        let todosFuncionarios = await Funcionarios.findAll(
            {   
                include: [{
                model: Pontos,
                attributes:[
                    "id",
                    [Sequelize.fn('date_format', Sequelize.col('dataEntrada'), '%d/%m/%Y'), 'dataEntrada'],
                    [Sequelize.fn('date_format', Sequelize.col('horarioEntrada'), '%H:%i'), 'horarioEntrada'],
                    [Sequelize.fn('date_format', Sequelize.col('dataSaida'), '%d/%m/%Y'), 'dataSaida'],
                    [Sequelize.fn('date_format', Sequelize.col('horarioSaida'), '%H:%i'), 'horarioSaida'],
                    "funcionarioMatricula"
                ],
                where:{dataEntrada: {[Sequelize.Op.between]: [moment().day(0).toDate(), moment().day(6).toDate()]}}, 
                required:false,     
            }], 
        });
        todosFuncionarios = JSON.parse(JSON.stringify(todosFuncionarios, null, 2 ));
        todosFuncionarios.map((funcionario) =>{
            let horasPagas = 0;
            const parteA = funcionario.cpf.substring(0,3);
            const parteB = funcionario.cpf.substring(3,6);
            const parteC = funcionario.cpf.substring(6,9);
            const parteD = funcionario.cpf.substring(9,11);
            funcionario.cpf = parteA + "." + parteB + "." + parteC + "-" + parteD;

            for(let pontos of funcionario.pontos) {
                const dataAtual = moment(pontos['dataSaida'] + ' ' + pontos['horarioSaida'], 'DD/MM/YYYY HH:mm');
                const primeiroPonto = moment(pontos['dataEntrada'] + ' ' +  pontos['horarioEntrada'], 'DD/MM/YYYY HH:mm');
                dataAtual.diff(primeiroPonto, "hours") ? horasPagas += dataAtual.diff(primeiroPonto, "hours") : null;
            };
            funcionario.horasPagas = horasPagas;

            if(funcionario.pontos.length >= 1) {
                funcionario.ultimaEntrada = funcionario.pontos[funcionario.pontos.length -1].dataEntrada.concat(' ', funcionario.pontos[funcionario.pontos.length -1].horarioEntrada);
                funcionario.ultimaSaida = funcionario.pontos[funcionario.pontos.length -1].dataSaida.concat(' ', funcionario.pontos[funcionario.pontos.length -1].horarioSaida);
                delete funcionario.pontos;
            };
        });
        return res.status(200).render('./admin/home', {title: "Home", funcionarios: todosFuncionarios});
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
        };
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