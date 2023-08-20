const  Conn  = require('../db/Conn');
const { DataTypes } = require("sequelize");
const Funcionarios = require('./Funcionarios');
const Usuario = require('./Usuario');

const Codigo = Conn.define("codigo", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    codigo:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    dataGerada:{
        type:DataTypes.DATE,
        allowNull:false
    },
}, { timestamps: false });

Funcionarios.hasMany(Codigo, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

Usuario.hasMany(Codigo, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

Codigo.belongsTo(Funcionarios);

Codigo.belongsTo(Usuario);

Codigo.sync({ force: false });

module.exports = Codigo;