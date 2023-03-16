module.exports = (link, email) => {
    const nodemailer = require('nodemailer');

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure:process.env.EMAIL_SECURE,
        auth:{
            user:process.env.EMAIL,
            pass:process.env.EMAIL_PASSWORD,
        },
    })

    transport.sendMail({
        from: `Sistema ponto <${process.env.EMAIL}>`,
        to:`${email}`,
        subject: 'Recuperação de senha',
        html: `<h1>Acesse o link abaixo para redefinir sua senha</h1><br><h3>${link}</h3>`,
        //Caso o servidor email não suporte em html
        text: `Acesse o link para redefinir sua senha:\n ${link}`
    }).then((resposta) =>{
        console.log('Email enviado com sucesso!', resposta)
    }).catch((err) => console.log('Erro ao enviar email: ', err));
}
