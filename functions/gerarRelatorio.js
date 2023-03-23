module.exports = (nomePlanilhaArquivo, data) => {
    const xl = require("excel4node");
    const wb = new xl.Workbook();
    const ws = wb.addWorksheet(nomePlanilhaArquivo);

     const headingColumnNames = [
        "Nome",
        "E-mail",
        "CPF",
        "Funcao",
        "Setor",
        "Carga Horaria Semanal",
        "Ativo",
        "Data Entrada",
        "Data Saida",
        "Horas Pagas"
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
    wb.write(`./private/${nomePlanilhaArquivo}.xlsx`);

};
  