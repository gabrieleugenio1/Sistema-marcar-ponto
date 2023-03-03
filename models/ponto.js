const { Sequelize, Conexao } = require('../db/Conexao');
const Funcionarios = require('./Funcionarios');

const Pontos = Conexao.define("pontos", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    dataEntrada:{
        type:Sequelize.DATEONLY,
    },
    horarioEntrada: {
        type: Sequelize.TIME,
    },
    dataSaida:{
        type:Sequelize.DATEONLY,
    },
    horarioSaida: {
        type: Sequelize.TIME,
    },

}, { timestamps: false });

Funcionarios.hasMany(Pontos, {
    foreignKey: 'funcionarioMatricula',
    foreignKey: { allowNull: false } ,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

Pontos.belongsTo(Funcionarios, {foreignKey: 'funcionarioMatricula'});

Pontos.sync({ force: false });
module.exports = Pontos;