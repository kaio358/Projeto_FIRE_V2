const express = require("express")
const rota = express.Router();


// segurança
const { SignJWT } = require('jose');
const crypto = require('crypto');
// Infra e modelos
const Usuario = require("../modelos/Usuario")

const { JWT_SECRET_KEY, JWT_ALGORITHM } = require('../infraestrutura/jwtConfig')


async function isPasswordPwned(password) {
    // 1. Gera o hash SHA-1 da senha (formato exigido pela API)
    const sha1Hash = crypto.createHash('sha1').update(password).digest('hex').toUpperCase();
    const prefix = sha1Hash.substring(0, 5);
    const suffix = sha1Hash.substring(5);

    const apiUrl = `https://api.pwnedpasswords.com/range/${prefix}`;

    try {
    
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Erro ao contatar a API de senhas: Status ${response.status}`);
        }

   
        const textData = await response.text();
        const hashes = textData.split('\r\n'); 

    
        for (const line of hashes) {
            const [hashSuffix, count] = line.split(':');
            if (hashSuffix === suffix) {
               
                console.log(`AVISO: A senha fornecida foi encontrada em vazamentos ${count} vezes.`);
                return true;
            }
        }

       
        return false;

    } catch (error) {
     
        console.error("Erro durante a verificação da senha na API Pwned Passwords:", error.message);
        
      
        return false;
    }
}

// const verificarToken = require("../infraestrutura/verificacaoJWT")

rota.post("/login",async (req,res)=>{

    const nome = req.body.nome
    const senha = req.body.senha

     if (!nome || !senha) {
        return res.status(400).json({ mensagem: 'Nome e senha são obrigatórios.' });
    }

    const usuario = await Usuario.login(nome,senha)
 
    if(usuario){
        const payload = {
             userId: usuario.id, 
             cargo: usuario.cargo
        }
        const token = await new SignJWT(payload)
                .setProtectedHeader({ alg: JWT_ALGORITHM })
                .setIssuedAt() 
                .setExpirationTime('2h') 
                .sign(JWT_SECRET_KEY);

        res.json({ mensagem: 'Login bem-sucedido!',token:token ,usuario: usuario });
        
    }else{
        res.status(401).json({ mensagem: 'Nome de usuário ou senha inválidos.' });
    }    
   
})

rota.post("/cadastro", async (req,res)=>{
    const {nome,email,senha,cargo} = req.body
  
    
     if (!nome || !senha || !email || !cargo) {
        return res.status(400).json({ mensagem: 'Nome, senha e email são obrigatórios.' });
    }
    if (await isPasswordPwned(senha)) {
        return res.status(400).json({ 
            mensagem: "Esta senha é muito comum ou já apareceu em vazamentos de dados. Por favor, escolha uma senha mais segura e única." 
        });
    }

    const usuarioCadastro = await Usuario.cadastro(nome,email,senha,cargo)
    
     res.status(200).json({ mensagem: "Cadastro realizado com sucesso!" });
    

})

module.exports = rota;