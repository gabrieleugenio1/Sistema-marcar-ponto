module.exports = async(link, email) => {
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

    await transport.sendMail({
        from: `Sistema ponto <${process.env.EMAIL}>`,
        to:`${email}`,
        subject: 'Recuperação de senha',
        html: `<h1>Acesse o link abaixo para redefinir sua senha, o link é válido por 5 minutos.</h1><br><a href='http://${link}'>Redefinir senha</a>`,
        //Caso o servidor email não suporte em html
        text: `Acesse o link para redefinir sua senha, o link é válido por 5 minutos:\n ${link}`
    }).then((resposta) =>{
        console.log('Email enviado com sucesso!', resposta)
    }).catch((err) => console.log('Erro ao enviar email: ', err));
}
