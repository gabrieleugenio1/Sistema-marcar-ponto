const { Sequelize } = require('sequelize');
const Funcionarios = require('./Funcionarios');
const Pontos = require('./Ponto');
const Usuario = require('./Usuario');
const Codigo = require('./Codigo');

module.exports = {
    Funcionarios, Pontos, Usuario, Codigo, Sequelize
};