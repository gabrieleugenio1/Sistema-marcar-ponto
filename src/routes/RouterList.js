const MainRoute = require('./MainRoute');
const adminRoute = require('./adminRoute');
const EmployeeRoute = require('./EmployeeRoute');

//Pegando todas as rotas
module.exports = app => {
    app.use(
        MainRoute,
        adminRoute,
        EmployeeRoute
    );
};