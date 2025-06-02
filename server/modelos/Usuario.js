const conexao = require("../infraestrutura/conexao")
const bcrypt = require('bcrypt');

class Usuario {
    // metodo para simplificar o mesmo comando 
    executarQuery(sql, params) {
        return new Promise((resolve, reject) => {
            conexao.execute(sql, params, (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });
    }
    async login(nome, senhaFornecida) {
            const sql = `SELECT * FROM Usuario WHERE nome = ?`;
            try {
                const resultados = await this.executarQuery(sql, [nome]);

                if (resultados.length === 0) {
                    // Usuário não encontrado
                    return null; 
                }

                const usuario = resultados[0];
                const senhaHashDoBanco = usuario.senha; // 'senha' no banco DEVE ser o hash

                // Compara a senha fornecida com o hash armazenado
                const senhaCorresponde = await bcrypt.compare(senhaFornecida, senhaHashDoBanco);

                if (senhaCorresponde) {
                    // Senha correta! Retorne os dados do usuário (sem o hash da senha)
                    const { senha, ...dadosDoUsuarioSemSenha } = usuario;
                    return dadosDoUsuarioSemSenha;
                } else {
                    // Senha incorreta
                    return null;
                }
            } catch (error) {
                console.error("Erro no processo de login:", error);
                throw error; 
            }
        }
    async cadastro(nome,email,senha, cargo){
        const saltRounds = 10;
        try {
            // Gera o hash da senha
            const senhaHash = await bcrypt.hash(senha, saltRounds);

            const sql = `INSERT INTO Usuario (nome,email,senha,cargo) VALUES (?, ?, ?,?)`; 
            const params = [nome,email,senhaHash,cargo]; 

            const resultadoDaInsercao = await this.executarQuery(sql, params);
            
     
            return { id: resultadoDaInsercao.insertId };

        } catch (error) {
            console.error("Erro ao registrar usuário:", error);
            
            if (error.code === 'ER_DUP_ENTRY') { 
                throw new Error('Nome de usuário ou email já existe.');
            }
            throw error; 
        }
    }
}
module.exports = new Usuario;