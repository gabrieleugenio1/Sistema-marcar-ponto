const { Sequelize, Conexao } = require('../db/Conexao');

const Usuario = Conexao.define('usuario', {
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

Usuario.sync({ force: false });

module.exports = Usuario;