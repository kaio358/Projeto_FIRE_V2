class Tabelas {
    init(conexao){
        this.conexao = conexao;
        this.criandoTabelaUsuario()
        this.criandoTabelaHistoricoAgregado()
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
    criandoTabelaHistoricoAgregado(){
        const sql = `
                CREATE TABLE if not exists historico_agregado (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    localidade VARCHAR(50) NOT NULL, 
                    ano INT NOT NULL,
                    janeiro INT DEFAULT 0,
                    fevereiro INT DEFAULT 0,
                    marco INT DEFAULT 0,
                    abril INT DEFAULT 0,
                    maio INT DEFAULT 0,
                    junho INT DEFAULT 0,
                    julho INT DEFAULT 0,
                    agosto INT DEFAULT 0,
                    setembro INT DEFAULT 0,
                    outubro INT DEFAULT 0,
                    novembro INT DEFAULT 0,
                    dezembro INT DEFAULT 0,
                    total INT DEFAULT 0,
                    UNIQUE KEY idx_localidade_ano (localidade, ano) 
                );`

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