const { resolvePtr } = require("dns");
const http = require("http");

const servidor = http.createServer(function(req, res){
    let resposta = 20;

    res.end(
        `
        <html>
            <head>
                <meta charset="utf-8"/>
            </head>
            <body>
            <h1> Hello World </h1>
            <p> Resposta a: ${resposta}</p>
            </body>
        </html>

        `
    )
})

servidor.listen(3001);