const conexao = require("../infraestrutura/conexao");

class Historico_agregado {
    /**
     * Método genérico para executar queries.
     */
    executarQuery(sql, params = []) {
        return new Promise((resolve, reject) => {
            conexao.query(sql, params, (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });
    }

    /**
     * Busca dados históricos por localidade e ano.
     */
    async buscarPorLocalidadeEAno(localidade, ano) {
        const sql = `SELECT * FROM historico_agregado WHERE localidade = ? AND ano = ?`;
        return this.executarQuery(sql, [localidade, ano]);
    }


    // Estou estudando JSDoc, então vai aparecer esses comentarios estranhos
    /**
     * ### NOVO MÉTODO ###
     * Insere ou atualiza múltiplos registros na tabela historico_agregado.
     * @param {Array<object>} registros - Um array de objetos, onde cada objeto representa uma linha.
     * @returns {Promise<object>} - O resultado da operação do banco de dados.
     */
    async inserirOuAtualizarEmMassa(registros) {
        if (!registros || registros.length === 0) {
            return { linhasAfetadas: 0 };
        }
        
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

        // Converte o array de objetos para o formato que a query em massa precisa (array de arrays)
        const valores = registros.map(r => [
            r.localidade, r.ano, r.janeiro, r.fevereiro, r.marco, r.abril, r.maio,
            r.junho, r.julho, r.agosto, r.setembro, r.outubro, r.novembro, r.dezembro, r.total
        ]);

        return this.executarQuery(sql, [valores]);
    }

    /**
         * ### NOVO MÉTODO ###
         * Busca o total de focos por ano para uma localidade específica.
         * @param {string} localidade - A localidade a ser buscada (ex: 'BRASIL').
         * @returns {Promise<Array<{ano: number, total: number}>>}
    */
    async buscarTotalAnualPorLocalidade(localidade) {
        // Seleciona apenas as colunas 'ano' e 'total' e ordena por ano.
        const sql = `
            SELECT ano, total 
            FROM historico_agregado 
            WHERE localidade = ? 
            ORDER BY ano ASC;
        `;
        
        try {
            const resultados = await this.executarQuery(sql, [localidade]);
            return resultados;
        } catch (error) {
            console.error(`Erro ao buscar o total anual para ${localidade}:`, error);
            throw error;
        }
    }
}

module.exports = new Historico_agregado();