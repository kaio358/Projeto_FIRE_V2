const express = require("express")
const rota = express()

// segurança
const jwt = require("jose")



// Comandos para o mysql
const Usuario = require("../modelos/Usuario")

rota.post("/login",async (req,res)=>{

    const nome = req.body.nome
    const senha = req.body.senha

     if (!nome || !senha) {
        return res.status(400).json({ mensagem: 'Nome e senha são obrigatórios.' });
    }

    const usuario = await Usuario.login(nome,senha)

    if(usuario){
        res.json({ mensagem: 'Login bem-sucedido!', usuario: usuario });
        
    }else{
        res.status(401).json({ mensagem: 'Nome de usuário ou senha inválidos.' });
    }    
    // jwt.SignJWT({})
})

rota.post("/cadastro", (req,res)=>{
    const {nome,email,senha,cargo} = req.body

     if (!nome || !senha || !email || !cargo) {
        return res.status(400).json({ mensagem: 'Nome, senha e email são obrigatórios.' });
    }

})

module.exports = rota;