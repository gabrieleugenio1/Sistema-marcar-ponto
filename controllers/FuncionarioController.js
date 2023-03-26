const bcrypt = require("bcrypt");
const { Funcionarios, Pontos, Sequelize } = require("../models/indexModels");
const validarFuncionario = require('../functions/validarFuncionario');
const toTitleCase = require('../functions/nameTitle');
const Autenticacao = require('../middleware/Autenticacao');

module.exports = class FuncionarioController {
    
    static async login(req, res) {
        res.clearCookie('token');
        const {email, senha} = req.body;
        const erros = [];
        await Funcionarios.findOne({ where: { email: email} }).then(employee => {
            {
              if (employee != undefined) {
                if (bcrypt.compareSync(senha, employee.senha)) {
                  const token = Autenticacao.gerarToken(employee);
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

    static async index (req,res) {
        const finalDate = new Date().toLocaleString("en-CA", {timeZone: "America/Recife"}).split(',')[0];
        let qtdPontos = await Pontos.count({where: {dataEntrada:finalDate, funcionarioMatricula: req.userId }});
        qtdPontos += await Pontos.count({where: {dataSaida:finalDate, funcionarioMatricula: req.userId }});
        console.log(qtdPontos)
        return res.status(200).render('./funcionario/home', {title: 'Home', erros: req.flash("erros"), presenca: qtdPontos});
    };

    static async cadastroFuncionario(req, res) {
        return  res.status(200).render("admin/cadastrar-funcionario", { title: "Cadastro funcionário", erros: req.flash("erros")});       
    };  

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
        const erros = validarFuncionario(validado, 'cadastro');          
        if (erros.length > 0){
            req.flash("erros", erros);
            return  res.status(200).redirect("/admin/cadastrofuncionario");
        };

        const salt = bcrypt.genSaltSync(10);
        const senhaCriptografada = bcrypt.hashSync(validado.senha, salt);
        validado.senha=senhaCriptografada;     
        await Funcionarios.create(validado).then(() =>
        res.status(200).redirect("/admin/home")
        );
    };
          
    static async alterarFuncionario (req, res) {
        await Funcionarios.findByPk(req.params.id).then( employee =>{
        return res.status(200).render("admin/alterar-funcionario", { title: "Alterar funcionário",funcionario: employee ,erros: req.flash("erros")});  
        });
    };

    static async alteracaoFuncionario (req, res) {
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

        await Funcionarios.update(validado, {where: {matricula: req.body.id}}).then(() => res.status(200).redirect("/admin/home"))
        .catch(err => {
            console.log(err);
        });
    };

    static async registraPonto(req, res) {
        const finalDate = new Date().toLocaleString("en-CA", {timeZone: "America/Recife"}).split(',')[0];
        let quantidade = await Pontos.count({where: {dataEntrada:finalDate, funcionarioMatricula: req.userId }});
        quantidade += await Pontos.count({where: {dataSaida:finalDate, funcionarioMatricula: req.userId }});
        if(quantidade == 0){
            console.log("Primeira entrada no dia", finalDate);
            return await Pontos.create({dataEntrada: Sequelize.fn('NOW'), horarioEntrada: Sequelize.fn('NOW'), funcionarioMatricula: req.userId }, {include: [ Funcionarios ]}).then(()=>{
                return res.status(200).redirect('/funcionario/home');
            }).catch(err => console.log(err));  
        }else if(quantidade == 1){
            console.log("Houve uma entrada no dia", finalDate);
            return await Pontos.update({dataSaida: Sequelize.fn('NOW'), horarioSaida: Sequelize.fn('NOW')}, {where: {dataEntrada: Sequelize.NOW(), funcionarioMatricula: req.userId}}, {include: [ Funcionarios ]}).then(()=>{
                return res.status(200).redirect('/funcionario/home');
            }).catch(err => console.log(err));  
        }
        console.log("Já teve uma entrada e saída")
        return res.status(200).redirect('/funcionario/home');
    };
};