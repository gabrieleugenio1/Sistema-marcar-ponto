const { Sequelize } = require('sequelize');
const Funcionarios = require('./Funcionarios');
const Pontos = require('./Pontos');
const Usuario = require('./Usuario');
const Codigo = require('./Codigo');
const Relatorios =require('./Relatorios');

module.exports = {
    Funcionarios, Pontos, Usuario, Codigo, Relatorios, Sequelize, 
};