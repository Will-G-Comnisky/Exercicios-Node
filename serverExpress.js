const express = require('express'); //O módulo express retorna uma função que instancia o express
const conversorJson = require("body-parser")
const cors = require("cors")

const app = express(); //A função express cria uma instância de todo o framework express em app

// Criando o servidor
const porta = 3001;
app.listen(porta, function () {
    console.log(`Servidor rodando na porta ${porta}`);
})

// Rotas de aplicação
