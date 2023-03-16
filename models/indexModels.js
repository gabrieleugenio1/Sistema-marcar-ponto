const { Sequelize } = require('sequelize');
const Funcionarios = require('./Funcionarios');
const Pontos = require('./Ponto');
const Usuario = require('./Usuario');


module.exports = {
    Funcionarios, Pontos, Usuario, Sequelize
};