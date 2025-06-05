const express = require("express")
const rota = express.Router();

// segurança
const { SignJWT } = require('jose');

// Infra e modelos
const Usuario = require("../modelos/Usuario")

const { JWT_SECRET_KEY, JWT_ALGORITHM } = require('../infraestrutura/jwtConfig')

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

    const usuarioCadastro = await Usuario.cadastro(nome,email,senha,cargo)
    
    res.status(200).json(usuarioCadastro)
    

})

module.exports = rota;