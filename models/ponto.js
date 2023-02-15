const { Sequelize, Conexao } = require('../db/Conexao');
const Funcionarios = require('./Funcionarios');

const Pontos = Conexao.define("pontos", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    data:{
        type:Sequelize.DATEONLY,
        allowNull: false,
        defaultValue: Sequelize.NOW,
    },
    horario: {
        type: Sequelize.TIME,
        allowNull: false,
        defaultValue: Sequelize.NOW,
        validate: {
            isDate: true
        }
    },
    tipo: {
        type: Sequelize.ENUM('Entrada', 'Saida'),
        allowNull: false
    }
}, { timestamps: false });

Funcionarios.hasMany(Pontos, {
    foreignKey: { allowNull: false },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

Pontos.belongsTo(Funcionarios);

Pontos.sync({ force: false });
module.exports = Pontos;