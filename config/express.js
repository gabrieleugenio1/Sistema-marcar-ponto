//Conectando com o banco
const { Conexao } = require('../db/Conexao');
const routes = require('../routes');
const flash = require("connect-flash");
const robots = require('express-robots-txt');
const cookieParser = require('cookie-parser');
const session = require("express-session");

function configExpress(express, app) {

  //Robots
  app.use(robots({
    UserAgent: '*',
    Disallow: '/'
  }));

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
    secret:process.env.SECRET_SESSION,
    resave:false,
    saveUninitialized:true    
  }));

  //Rotas
  routes(app);

  //Página não encontrada: 404
  app.get('*', function(req, res) {
    res.status(404).json({message:'404'});
  });
};

module.exports = configExpress;
