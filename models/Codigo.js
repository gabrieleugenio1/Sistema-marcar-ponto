const { DataTypes, Conexao } = require('../db/Conexao');
const Funcionarios = require('./Funcionarios');

const Codigo = Conexao.define("codigo", {
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

Codigo.belongsTo(Funcionarios);

Codigo.sync({ force: false });
module.exports = Codigo;