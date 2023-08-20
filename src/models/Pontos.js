const  Conn  = require('../db/Conn');
const { DataTypes } = require("sequelize");
const Funcionarios = require('./Funcionarios');

const Pontos = Conn.define("pontos", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    dataEntrada:{
        type:DataTypes.DATEONLY,
    },
    horarioEntrada: {
        type: DataTypes.TIME,
    },
    intervaloDataEntrada:{
        type:DataTypes.DATEONLY,
    },
    intervaloHorarioEntrada: {
        type: DataTypes.TIME,
    },
    intervaloDataSaida:{
        type:DataTypes.DATEONLY,
    },
    intervaloHorarioSaida: {
        type: DataTypes.TIME,
    },
    dataSaida:{
        type:DataTypes.DATEONLY,
    },
    horarioSaida: {
        type: DataTypes.TIME,
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