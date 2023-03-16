const { DataTypes, Conexao } = require('../db/Conexao');

const Funcionarios = Conexao.define("funcionarios", {
    matricula: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING(130),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        },
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            min: 6
        },
    },
    cpf:{
        type: DataTypes.STRING(15),
        allowNull:false
    },
    funcao: {
        type: DataTypes.STRING(130),
        allowNull: false
    },
    setor: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    cargahorariasemanal: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 0, 
            max: 44,   
        },
    },
    ativo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
});


Funcionarios.sync({ force: false });
module.exports = Funcionarios;