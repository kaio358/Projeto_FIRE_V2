const express = require("express")
const rota = express()

// segurança
const jwt = require("jose")
const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

// Comandos para o mysql
const Usuario = require("../modelos/Usuario")

rota.post("/login",async (req,res)=>{
    const nome = req.body.nome
    const senha = req.body.senha
    const usuario = await Usuario.login(nome,senha)

    console.log();
    
    // jwt.SignJWT({})
})

module.exports = rota;