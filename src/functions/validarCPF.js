"use strict";
module.exports = (cpf) => {
    // Remover caracteres não numéricos
    cpf = cpf.replace(/[^\d]/g, '');

    // Verificar se o CPF possui 11 dígitos e se não possui nenhum dígito repetido
    if (cpf.length !== 11 || /^(.)\1+$/.test(cpf)) {
        return false;
    }

    // Calcular o primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let firstDigit = 11 - (sum % 11);
    if (firstDigit > 9) {
        firstDigit = 0;
    }

    // Calcular o segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    let secondDigit = 11 - (sum % 11);
    if (secondDigit > 9) {
        secondDigit = 0;
    }

    // Verificar se os dígitos verificadores são os mesmos do CPF
    let digits = cpf.substring(9);
    return digits === firstDigit.toString() + secondDigit.toString();
}
