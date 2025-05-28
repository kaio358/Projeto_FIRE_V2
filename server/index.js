const express = require("express");
const http = require("http");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

app.use(cors);
app.use(express.json());
app.use(express.urlencoded({extended:true}));


server.listen(PORT,()=>{
    console.log(`Servidor backend rodando na porta ${PORT}`);
})
