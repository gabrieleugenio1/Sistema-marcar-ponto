"use strict";
//Ativar .env
require("dotenv").config();

//Configurações iniciais
const Conn = require("./src/db/Conn");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

//Ativar configurações
const configExpress = require("./src/config/config")(express, app);

//Sincronizar com o banco de dados e porta em execução
Conn.sync().then(() => {
  app.listen(port, console.log(`Servidor executando na porta ${port}`));
});
