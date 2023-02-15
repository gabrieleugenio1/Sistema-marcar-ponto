const { Sequelize, Conexao } = require('../db/Conexao');

const Funcionarios = Conexao.define("funcionarios", {
    matricula: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: Sequelize.STRING(130),
        allowNull: false
    },
    email: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    senha: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            min: 6
        }
    },
    cpf:{
        type:Sequelize.STRING(15),
        allowNull:false
    },
    funcao: {
        type: Sequelize.STRING(130),
        allowNull: false
    },
    setor: {
        type: Sequelize.STRING(50),
        allowNull: false
    },
    cargahorariasemanal: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    ativo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
});


Funcionarios.sync({ force: false });
module.exports = Funcionarios;