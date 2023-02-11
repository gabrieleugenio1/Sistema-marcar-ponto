const principal = require('./principalRoute');
const usuario = require('./usuariosRoute');

//Pegando todas as rotas
module.exports = app =>{
    app.use(
        principal,
        usuario
        )
}