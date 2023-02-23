const jwt = require('jsonwebtoken');
const secret = process.env.SECRET_JWT;

module.exports = class Autenticacao{

    static gerarToken(user, tipoConta){
        const payload = {userId: user.id, tipoConta: tipoConta? tipoConta : undefined};
        const options = {expiresIn: '1d'};
        return jwt.sign(payload, secret, options);
    } 

    static verificaTokenAdmin(req, res, next){
        const token = req.cookies.token;
        console.log(token)
        if(!token){
            return res.status(401).json({message: "Faça login para acessar o contéudo!"});
        }
        jwt.verify(token, secret, (err, decoded) => {
            if(err){
                return res.status(401).json({message: 'Token inválido!'});
            }
            console.log(decoded)

            req.userId = decoded.userId;
            req.tipoConta = decoded.tipoConta;
            if(decoded.tipoConta == "Admin"){
                next();
            }else{
                return res.status(401).json({message: "Nível de acesso diferente"});
            }
        });
    }
    
    static verificaTokenFuncionario(req, res, next){
        const token = req.cookies.token;
        console.log(token)
        if(!token){
            return res.status(401).json({message: "Faça login para acessar o contéudo!"});
        }
        jwt.verify(token, secret, (err, decoded) => {
            if(err){
                return res.status(401).json({message: 'Token inválido!'});
            }
            console.log(decoded)

            req.userId = decoded.userId;
            req.tipoConta = decoded.tipoConta;

            if(decoded.tipoConta == "Funcionario"){
                next();
            }else{
                return res.status(401).json({message: "Nível de acesso diferente"});
            }
        });
    }
}