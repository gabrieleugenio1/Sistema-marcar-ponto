//Conectando com o banco
const { Conexao } = require('../db/Conexao');
const routes = require('../routes');
const flash = require("connect-flash");
const session = require("express-session");
const robots = require('express-robots-txt');
const cookieParser = require('cookie-parser')

//Editar depois - const jwt = require("jsonwebtoken");

function configExpress(express, app) {
  //Robots
  app.use(robots({
    UserAgent: '*',
    Disallow: '/'
  }))

  //Configurando express
  app.set("view engine", "ejs");
  app.use(express.static("public"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(flash());
  app.use(cookieParser());
  Conexao.authenticate();

  //Session
  app.use(session({
    secret:"dj!2@#5ASGFASAD@Q#Wf@##@s",
    resave:false,
    saveUninitialized:true    
  })); 


  //Rotas
  routes(app);
}

module.exports = configExpress;
