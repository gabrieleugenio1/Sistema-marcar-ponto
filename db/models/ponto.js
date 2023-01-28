const { Sequelize, Conexao } = require('../Conexao');
const Funcionarios = require('./funcionarios');

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