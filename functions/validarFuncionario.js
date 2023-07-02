const validateCPF = require('./validarCPF');

module.exports = async (funcionario, tipo, matriculaOriginal) => {
  let matricula = funcionario.matricula;
  let nome = funcionario.nome;
  let email = funcionario.email;
  let senha = funcionario.senha;
  let cpf = funcionario.cpf;
  let funcao = funcionario.funcao;
  let setor = funcionario.setor;
  let cargaHorariaSemanal = parseInt(funcionario.cargahorariasemanal);
  let ativo = funcionario.ativo;

  /** INICIO DAS VALIDAÇÕES **/      
  let erros = [];     

  let regex = {
  nome: /^[a-zA-Z]+ [a-zA-Z]+ [a-zA-Z]+$/,
  email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
  senha: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  };

  if(nome) {
    nome = nome.trim(); // Limpa espaços no inicio e no final do nome.        
    nome = nome.replace(/[^a-zA-Z\s]/g, ''); // Remove caracteres não textuais.        
    nome = nome.toLowerCase(); // Padroniza o nome em minúsculo.
  };

  if(email) {
    email = email.trim(); // Limpa espaços em branco no inicio e final do e-mail.
    email = email.toLowerCase(); // Padroniza o e-mail em minúsculo.
  };

  if(tipo !== "alteracao") {
    if(cpf) { 
      cpf = cpf.trim(); // Limpa espaços em branco no inicio e final do cpf.}
      /*  cpf = cpf.replace(/[^\d]/g, ''); */ // Remove caracteres não numéricos. 
      if (!validateCPF(cpf) || !cpf || cpf === undefined || cpf === null) {
        erros.push({ error: "CPF inválido!" });
      };    

    };
  };
  
  if(matricula && isNaN(matricula)){
    erros.push({error: "Matrícula inválida! Deve ser apenas números."});
  };
  
  if(!nome || nome === undefined || nome === null ) {
   erros.push({error: "Nome inválido! Não pode ser vazio e deve ser completo."});
  };  

  if (!email || email === undefined || email === null || !regex.email.test(email)) {
   erros.push({ error: "E-mail inválido!" });
  };     

  if (!cargaHorariaSemanal || cargaHorariaSemanal === undefined || cargaHorariaSemanal > 44 || isNaN(cargaHorariaSemanal) || cargaHorariaSemanal === null) {
    erros.push({ error: "Carga horária inválida!" });
  }; 

  if (!funcao || funcao === undefined ||funcao === null) {
    erros.push({ error: "Função inválida!" });
  }; 

  if (!setor || setor === undefined ||setor === null) {
   erros.push({ error: "Setor inválido!" });
  }; 
  
  if (ativo === undefined || ativo === null || (ativo !== false && ativo !== true )) {
   erros.push({ error: "Ativo inválido!" });
  }; 

  if(tipo === "cadastro") {
    if(!senha || senha === undefined || senha === null || senha <= 6 ) {
      erros.push({error: "Senha inválida! A senha deve ter no minimo 6 caracteres."});
    };
  };
  /* FINAL DAS VALIDAÇÕES */ 

  return erros;   
};
