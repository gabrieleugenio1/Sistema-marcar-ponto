const  Conn  = require('../db/Conn');
const { DataTypes } = require("sequelize");
const Funcionarios = require('./Funcionarios');
const Usuario = require('./Usuario');

const Relatorios = Conn.define("relatorios", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    caminho:{
        type:DataTypes.STRING(200),
        allowNull: false
    },
}, { timestamps: true });

Usuario.hasMany(Relatorios, {
    foreignKey: { allowNull: false } ,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

Relatorios.belongsTo(Usuario);

Relatorios.sync({ force: false });

module.exports = Relatorios;