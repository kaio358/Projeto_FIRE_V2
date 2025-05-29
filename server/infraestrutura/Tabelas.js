class Tabelas {
    init(conexao){
        this.conexao = conexao;
        this.criandoTabelaUsuario()
    }
    criandoTabelaUsuario(){
        const sql = `CREATE TABLE if not exists Usuario(idUsuario int auto_increment, nome varchar(255),email varchar(255), senha varchar(255), cargo varchar(255), PRIMARY KEY(idUsuario))`
        this.conexao.query(sql,erro=>{
            if(erro){
                console.log(erro);
                
            }else{
                console.log("A tabela usuario criada com sucesso");
                
            }
        })
    }
}

module.exports = new Tabelas;