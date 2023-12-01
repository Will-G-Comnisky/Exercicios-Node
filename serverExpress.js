const express = require('express'); //O módulo express retorna uma função que instancia o express
const cors = require("cors")
const fs = require("fs/promises")
const path = require('path')

const app = express(); //A função express cria uma instância de todo o framework express em app
const porta = 3001;

app.use(express.static(path.join(__dirname, "img")));
app.use(express.static(path.join(__dirname, "frontend")));
app.use(express.static(path.join(__dirname, "scripts")));

// Middleware usado para trabalhar com a rota POST
app.use(express.urlencoded({extended: false}));
app.use(express.json()); // body parser-> captura o corpo da requisição, converte em JS Object e anexa a variavel na requisição (req.body)
// Agora sim, após esse middleware conseguimos ler o (req.body) na nova rota /voto usando POST

app.use(cors())


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/frontend/index.html'));
});

//Rota Get com passagem de parametros 
app.get("/cargainicial", (req, resp) => {
    async function getCandidates() {
        console.log('Rota /cargainicial foi acessada');
        try {
            const content = await fs.readFile('backend/config.csv', 'utf-8');
            const candidates = content.split('\r\n');
            const candidate = [];
            candidates.forEach(element => {
                let candidatesData = element.split(',');

                let candidatesObj = {
                    tipoEleicao: candidatesData[0],
                    numeroCandidato: candidatesData[1],
                    nomeCandidato: candidatesData[2],
                    urlFoto: candidatesData[3]
                }

                candidate.push(candidatesObj)
            })
            
            console.log(candidate);
            resp.send(candidate);
            
        } catch (error) {
            console.error('Não foi possível ler o arquivo:', error);
            resp.status(500).send('Erro ao registrar voto, contate o administrador do sistema');
        }
    }
    getCandidates();
})

// NOVA ROTA VOTO
app.post('/voto', async (req, res) => {

    // Temos que capturar os dados vindos do frontend
    let {cpf, numeroCandidato, timeStamp} = req.body;

    let successMsg = {
        "status": "200",
        "msg": "Seu voto foi registrado com sucesso!"
    }
    let errorMsg = {
        'status': "500",
        "msg": "Erro ao registrar seu voto, contate o administrador do sistema"
    }
    // Salvar os dados capturados no arquivo votacao.csv (o arquivo será criado automaticamente ao salvar)
    await fs.appendFile('backend/votacao.csv', `${cpf}, {}` + '\n');

    res.json({
        'Status': '200',
        'mensagem': 'Seu voto foi registrado com sucesso!'
    })
})

// Criando o servidor e listener
app.listen(porta, function () {
    console.log(`Servidor rodando na porta ${porta}`);
})

            /*
            csv({ separator: ',' })() //Configura o csv-parser para usar a vírgula como o separador de campos no arquivo CSV
            .on('data', (row) => candidatesArray.push(row)) // Quando uma linha é lida, adiciona o objeto correspondente ao array candidatesArray
            .on('end', () => resp.json(candidatesArray)) // Quando todo o CSV é lido, envia os dados no formato JSON como resposta
            .write(content); // Escreve o conteúdo do arquivo CSV no parser
            */






/*
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
*/

