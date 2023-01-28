//Ativar .env
require("dotenv").config();
//Configuração inicial
const express = require("express");
const app = express();
const flash = require("connect-flash");
//Editar depois - const jwt = require("jsonwebtoken");
const port = process.env.PORT || 3000;
const session = require("express-session");

const configExpress = require("./config/express")(express, app);
app.use(flash());

//Session
app.use(session({
    secret:"dj!2@#5ASGFASAD@Q#Wf@##@s",
    resave:false,
    saveUninitialized:true    
})); 

//Pegando todas as rotas
const { rotaPrincipal, Autenticacao } = require("./routes/allRoutes");

//Rotas
app.use("/", rotaPrincipal);
app.use("/", Autenticacao);
//Porta em execução
app.listen(port, console.log(`Servidor executando na porta ${port}`));
