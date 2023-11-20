const express = require('express'); //O módulo express retorna uma função que instancia o express
const conversorJson = require("body-parser")
const cors = require("cors")

const app = express(); //A função express cria uma instância de todo o framework express em app

app.use(conversorJson.urlencoded({extended: false})) //middleware
app.use(conversorJson.json());

app.use(function(req, resp, next){
    resp.header("Access-Control-Allow-Origin", "*")
    //resp.header("Access-Control-Allow-Origin", "http://localhost:8080")

    app.use(cors())
    next()
})

//Rota Get com passagem de parametros 
app.get("/usuario", function (req, resp) {
    
    let name = req.query.nmName
    let lastName = req.query.nmLastName
    let dataNascimento = req.query.nmDataNasc
    let endereco = req.query.nmEndereco
    let email = req.query.nmEmail
    let telefone = req.query.nmTel

    console.log("Chegou na rota usuario",  name, lastName, dataNascimento, endereco, email, telefone);

    resp.json({
        "nameUsu": name, 
        "lastNameUsu:": lastName, 
        "dataNascimentoUsu:": dataNascimento,
        "enderecoUsu:": endereco,
        "emailUsu:": email,
        "telefoneUsu:": telefone
        })
})

app.post("/usuario", function(req, resp){

    //console.log(req);

    let name = req.body.nmName
    let lastName = req.body.nmLastName
    let dataNascimento = req.body.nmDataNasc
    let endereco = req.body.nmEndereco
    let email = req.body.nmEmail
    let telefone = req.body.nmTel

    resp.json({
        "nameUsu": name, 
        "lastNameUsu:": lastName, 
        "dataNascimentoUsu:": dataNascimento,
        "enderecoUsu:": endereco,
        "emailUsu:": email,
        "telefoneUsu:": telefone
        })
})

// Criando o servidor
const porta = 3001;
app.listen(porta, function () {
    console.log(`Servidor rodando na porta ${porta}`);
})

