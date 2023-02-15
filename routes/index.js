const principal = require('./principalRoute');
const usuario = require('./usuariosRoute');
const funcionario = require('./funcionarioRoute');

//Pegando todas as rotas
module.exports = app =>{
    app.use(
        principal,
        usuario,
        funcionario
        )
}