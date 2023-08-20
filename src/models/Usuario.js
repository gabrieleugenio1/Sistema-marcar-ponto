const  Conn  = require('../db/Conn');
const { DataTypes } = require("sequelize");

const Usuario = Conn.define('usuario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
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
        type: DataTypes.STRING(150),
        allowNull: false,
        validate: {
            min: 6
        },
    }
});

Usuario.sync({ force: false });

module.exports = Usuario;