const { Sequelize, Conexao } = require('../Conexao');

const Usuarios = Conexao.define('usuarios', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
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
        type: Sequelize.STRING(150),
        allowNull: false,
        validate: {
            min: 6
        }
    }

});

Usuarios.sync({ force: false });

module.exports = Usuarios;