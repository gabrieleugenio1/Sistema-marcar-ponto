"use strict";
//Conectando com o banco
const RouterList = require('../routes/RouterList');
const flash = require('connect-flash');
const robots = require('express-robots-txt');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');

function configExpress(express, app) {

  //Robots
  app.use(robots({
    UserAgent: "*",
    Allow: "/",
    Disallow: "/*"
  }));

  //Configurando o express
  app.set("view engine", "ejs");
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  
  //Caminho das views e public
  app.set("views", path.join(__dirname, "../views"));
  app.use(express.static(path.join(__dirname, "../public")));

  //Utilização das mensagens e cookies
  app.use(flash());
  app.use(cookieParser());

  //Session para utilizar o flash
   app.use(session({
    secret:process.env.SECRET_SESSION,
    resave:false,
    saveUninitialized:true    
  }));

  //Rotas
  RouterList(app);

  //Página não encontrada: 404
  app.get("*", (req, res) => {
    res.status(404).json({message:'Página não encontrada.'});
  });
};

module.exports = configExpress;
