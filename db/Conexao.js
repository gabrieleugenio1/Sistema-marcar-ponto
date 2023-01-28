const Sequelize = require("sequelize");

const Conexao = new Sequelize(process.env.DATABASE, process.env.DB_NOME, process.env.DB_SENHA, {
  host: "localhost",
  port: process.env.DB_PORT,
  dialect: "mysql",
  timezone: "-03:00",
});

module.exports = { Sequelize, Conexao };
