const http = require("http");

const servidor = http.createServer(function(req, res){
    let html
    if (req.url == "/") {
        html = 
        `
        <html>
            <head>
                <meta charset="utf-8"/>
            </head>
            <body>
            <h1> Hello World! </h1>
            <p> Bem vindo ao meu simples servidor e página</p>
            <p> Aproveite que está aqui e se cadastre:</p>
            <br>
            <button type="button"><a href="https://localhost:3001/cadastro">Cadastrar</a></button>
            </body>
        </html>
        `
    } else if (req.url == "/cadastro") {
        html = 
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
    }

    res.end(html)
})

servidor.listen(3001);