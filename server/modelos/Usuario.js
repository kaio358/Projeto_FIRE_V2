const conexao = require("../infraestrutura/conexao")
class Usuario {
    login(nome,senha){
        const sql = `SELECT * FROM Usuario where nome = ? and senha = ?`;
        return new Promise((resolve,reject)=>{
            conexao.execute(sql,[nome,senha],(resultado,erro)=>{
                if(erro){
                    reject(erro)
                }else{
                    resolve(resultado)
                }
            })
        })
    }
}
module.exports = new Usuario;