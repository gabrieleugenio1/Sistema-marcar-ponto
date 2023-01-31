const Funcionarios = require('../models/funcionarios');
const Pontos = require('../models/ponto');
const Usuarios = require('../models/usuarios');
const { Conexao } = require('./Conexao');

module.exports = {
    Funcionarios, Pontos, Usuarios, Conexao
};