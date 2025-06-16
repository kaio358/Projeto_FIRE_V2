const fs = require('fs');
const csv = require('csv-parser');
const conexao = require('./conexao');

/**
 * Converte um valor de string do CSV para um número inteiro, tratando casos vazios/inválidos.
 * Retorna 0 se o valor for inválido.
 * @param {string | number} value - O valor da célula do CSV.
 * @returns {number}
 */
const parseNumericValue = (value) => {
    if (value === null || value === undefined || String(value).trim() === '') {
        return 0;
    }
    const number = parseInt(String(value).trim(), 10);
    return isNaN(number) ? 0 : number;
};

// *** AQUI ESTÁ A MUDANÇA PRINCIPAL ***
// Definimos manualmente os nomes das colunas na ordem em que aparecem no CSV.
// Isso ignora o cabeçalho do arquivo e usa os nomes que definimos aqui.
const headers = [
    'Ano', 'Janeiro', 'Fevereiro', 'Marco', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro', 'Total'
];


async function processarHistoricoAgregado(caminhoArquivo, tipoDeDado) {
    let localidade;
    if (tipoDeDado === 'historico_brasil') {
        localidade = 'BRASIL';
    } else {
        localidade = tipoDeDado.split('_')[1].toUpperCase();
    }

    return new Promise((resolve, reject) => {
        const registrosParaInserir = [];
        let contadorLidos = 0;

        fs.createReadStream(caminhoArquivo)
            // Passamos as opções para o csv-parser
            .pipe(csv({
                headers: headers, // Usa os nomes de coluna que definimos
                skipLines: 1      // Pula a primeira linha do CSV (o cabeçalho problemático)
            }))
            .on('data', (linha) => {
                // Não precisa mais de console.log de depuração, a menos que queira
                contadorLidos++;
                
                // Agora podemos confiar que 'linha.Ano', 'linha.Janeiro', etc., existem.
                const registroFormatado = [
                    localidade,
                    parseNumericValue(linha.Ano),
                    parseNumericValue(linha.Janeiro),
                    parseNumericValue(linha.Fevereiro),
                    parseNumericValue(linha.Marco),
                    parseNumericValue(linha.Abril),
                    parseNumericValue(linha.Maio),
                    parseNumericValue(linha.Junho),
                    parseNumericValue(linha.Julho),
                    parseNumericValue(linha.Agosto),
                    parseNumericValue(linha.Setembro),
                    parseNumericValue(linha.Outubro),
                    parseNumericValue(linha.Novembro),
                    parseNumericValue(linha.Dezembro),
                    parseNumericValue(linha.Total)
                ];
                registrosParaInserir.push(registroFormatado);
            })
            .on('end', () => {
                if (registrosParaInserir.length === 0) {
                    return resolve({ lidos: contadorLidos, linhasAfetadas: 0 });
                }

                console.log(`Processando ${contadorLidos} registros para a localidade '${localidade}'...`);

                const sql = `
                    INSERT INTO historico_agregado (localidade, ano, janeiro, fevereiro, marco, abril, maio, junho, julho, agosto, setembro, outubro, novembro, dezembro, total)
                    VALUES ?
                    ON DUPLICATE KEY UPDATE
                        janeiro = VALUES(janeiro), fevereiro = VALUES(fevereiro), marco = VALUES(marco),
                        abril = VALUES(abril), maio = VALUES(maio), junho = VALUES(junho),
                        julho = VALUES(julho), agosto = VALUES(agosto), setembro = VALUES(setembro),
                        outubro = VALUES(outubro), novembro = VALUES(novembro), dezembro = VALUES(dezembro),
                        total = VALUES(total);
                `;

                conexao.query(sql, [registrosParaInserir], (error, result) => {
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