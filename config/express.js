//Conectando com o banco
const { Conexao } = require("../db/indexBD");

function configExpress(express, app) {
  //Configurando express
  app.set("view engine", "ejs");
  app.use(express.static("public"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  Conexao.authenticate();
}

module.exports = configExpress;
