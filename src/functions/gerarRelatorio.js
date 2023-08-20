"use strict";
const { Relatorios } = require("../models/Models");
const { Op } = require("sequelize");
const moment = require("moment");
const path = require('path');



module.exports = async(nomePlanilhaArquivo, data, usuario) => {
    const xl = require("excel4node");
    const wb = new xl.Workbook();
    const ws = wb.addWorksheet(nomePlanilhaArquivo);
    
    const caminhoPlanilha = path.join('src', 'private', `${nomePlanilhaArquivo}.xlsx`);
     const headingColumnNames = [
        "Nome",
        "E-mail",
        "CPF",
        "Funcao",
        "Setor",
        "Carga Horaria Semanal",
        "Ativo",
        "Data Entrada",
        "Intervalo Entrada",
        "Intervalo Saida",
        "Data Saida",
        "Horas Pagas",
    ];

    let headingColumnIndex = 1;
    headingColumnNames.forEach(heading =>{
        ws.cell(1, headingColumnIndex++).string(heading);
    });

    let rowIndex = 2;
    data.forEach(record => {
        let columnIndex = 1;
        Object.keys(record).forEach(columnName => {
            if(typeof(record[columnName]) == "string"){
                ws.cell(rowIndex, columnIndex++).string(record[columnName]);
            }else if(columnName == "ativo"){
                ws.cell(rowIndex, columnIndex++).bool(record[columnName] == 1 ? true : false);
              
            }else{ 
                ws.cell(rowIndex, columnIndex++).number(record[columnName]) ;
            }
        });
        rowIndex++;
    });
    moment.locale("en-ca");
    const encontrado = await Relatorios.findOne({raw:true, where: {createdAt: {[Op.startsWith]: moment().format('L').toString()}}});
    if(!encontrado){
        await Relatorios.create({caminho: caminhoPlanilha, usuarioId: usuario})
    }else{
       await Relatorios.update({caminho: caminhoPlanilha}, { where: {createdAt: {[Op.startsWith]: moment().format('L').toString()}}});
    }
    wb.write(caminhoPlanilha);
};
  