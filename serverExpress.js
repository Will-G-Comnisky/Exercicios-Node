
const express = require('express');

const app = express();

// Criando o servidor
const porta = 3001;
app.listen(porta, function () {
    console.log(`Servidor rodando na porta ${porta}`);
})

// Rotas de aplicação
app.get("/", function (req, res) {
    res.send (
        `
        <html>
            <head>
                <meta charset="utf-8"/>
            </head>
            <body>
            <h1> Hello World! </h1>
            <p> Bem vindo ao meu simples servidor e página que está rodando pelo Express!</p>
            <p> Aproveite que está aqui e cadastre-se:</p>
            <br>
            <a href='/cadastro'>Cadastrar</a>
            </body>
        </html>
        `
    );
});

app.get('/cadastro', function(req, res) {
    res.send (
        `
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Formulário</title>
        </head>
        <body>
        
            <div class="container">
                <form>
                    <div class="form-group">
                        <label for="nome">Nome:</label>
                        <input type="text" id="nome" placeholder="Digite seu nome">
                    </div>
                    <div class="form-group">
                        <label for="idade">Idade:</label>
                        <input type="number" id="idade" placeholder="Digite sua idade">
                    </div>
                    <button type="submit">Enviar</button>
                </form>
            </div>
        </body>
        </html>
        `
    )
});

app.get('/livros', function(req, res) {
    let livro1 = {
        titulo: "Duna",
        autor: "Mark" 
    };

    res.json(livro1);
});