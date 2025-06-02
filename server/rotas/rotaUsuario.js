const express = require("express")
const rota = express.Router();

// segurança
const { SignJWT } = require('jose');

const { TextEncoder } = require('util'); 
const jwtSecretString = process.env.JWT_SECRET;
if (!jwtSecretString) {
    console.error("FATAL ERROR: JWT_SECRET não está definido nas variáveis de ambiente.");
    process.exit(1); 
}
const JWT_SECRET_KEY = new TextEncoder().encode(jwtSecretString);
const JWT_ALGORITHM = 'HS256';

// Infra e modelos
const Usuario = require("../modelos/Usuario")
const verificarToken = require("../infraestrutura/verificacaoJWT")

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

    const usuarioCadastro = await Usuario.cadastro(nome,email,senha,cargo)
    
    res.status(200).json(usuarioCadastro)
    

})

module.exports = rota;