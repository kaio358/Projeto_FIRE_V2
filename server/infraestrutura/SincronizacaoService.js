// server/infraestrutura/SincronizacaoService.js

const fs = require('fs');
const csv = require('csv-parser');
const conexao = require('./conexao');

/**
 * Converte um valor de string do CSV para um número, tratando casos vazios.
 * @param {string} value - O valor da célula do CSV.
 * @returns {number} - O valor convertido para número, ou 0 se estiver vazio/inválido.
 */
const parseNumericValue = (value) => {
    // Se o valor for uma string vazia, nulo ou indefinido, retorna 0.
    if (!value || value.trim() === '') {
        return 0;
    }
    // Usa parseFloat para converter a string para um número.
    // parseFloat lida bem com números que têm ".0" no final.
    const number = parseFloat(value);
    // Se a conversão falhar (resultando em NaN - Not a Number), retorna 0.
    return isNaN(number) ? 0 : number;
};

async function processarHistoricoAgregado(caminhoArquivo, nomeDaTabela) {
    return new Promise((resolve, reject) => {
        const registros = [];
        let contadorLidos = 0;

        fs.createReadStream(caminhoArquivo)
            .pipe(csv())
            .on('data', (data) => {
                contadorLidos++;
                registros.push(data);
            })
            .on('end', async () => {
                if (registros.length === 0) {
                    return resolve({ lidos: 0, atualizados: 0, inseridos: 0 });
                }

                console.log(`Processando ${contadorLidos} registros para a tabela '${nomeDaTabela}'...`);

                const sql = `
                    INSERT INTO ?? (Ano, Janeiro, Fevereiro, Marco, Abril, Maio, Junho, Julho, Agosto, Setembro, Outubro, Novembro, Dezembro, Total)
                    VALUES ?
                    ON DUPLICATE KEY UPDATE
                        Janeiro = VALUES(Janeiro), Fevereiro = VALUES(Fevereiro), Marco = VALUES(Marco),
                        Abril = VALUES(Abril), Maio = VALUES(Maio), Junho = VALUES(Junho),
                        Julho = VALUES(Julho), Agosto = VALUES(Agosto), Setembro = VALUES(Setembro),
                        Outubro = VALUES(Outubro), Novembro = VALUES(Novembro), Dezembro = VALUES(Dezembro),
                        Total = VALUES(Total);
                `;
                
                // *** AQUI ESTÁ A CORREÇÃO PRINCIPAL ***
                // Mapeia os registros, usando a função parseNumericValue para limpar cada coluna numérica.
                const valores = registros.map(r => [
                    parseNumericValue(r.Ano),
                    parseNumericValue(r.Janeiro),
                    parseNumericValue(r.Fevereiro),
                    parseNumericValue(r.Marco),
                    parseNumericValue(r.Abril),
                    parseNumericValue(r.Maio),
                    parseNumericValue(r.Junho),
                    parseNumericValue(r.Julho),
                    parseNumericValue(r.Agosto),
                    parseNumericValue(r.Setembro),
                    parseNumericValue(r.Outubro),
                    parseNumericValue(r.Novembro),
                    parseNumericValue(r.Dezembro),
                    parseNumericValue(r.Total)
                ]);

                conexao.query(sql, [nomeDaTabela, valores], (error, result) => {
                    if (error) return reject(error);
                    resolve({ lidos: contadorLidos, linhasAfetadas: result.affectedRows });
                });
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}

module.exports = { processarHistoricoAgregado };