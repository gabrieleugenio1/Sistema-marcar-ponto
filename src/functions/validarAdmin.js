"use strict";
module.exports = (admin, tipo) => {

   /** INICIO DAS VALIDAÇÕES **/
   let erros = [];

   let regex = {
   email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
   senha: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
   };

   let email = admin.email;
   email = email.trim(); // Limpa espaços em branco no inicio e final do e-mail.
   email = email.toLowerCase(); // Padroniza o e-mail em minúsculo.

   let senha = admin.senha;

   if (!email || email == undefined || email == null || !regex.email.test(email)) {
   erros.push({ error: "E-mail inválido!" });
   }  

   if(tipo == "cadastro"){
      if(!senha || senha == undefined || senha == null || senha <= 6 ){
         erros.push({error: "Senha inválida! A senha deve ter no minimo 6 caracteres."});
      };
   }
   return erros
   /* FINAL DAS VALIDAÇÕES */   
}
