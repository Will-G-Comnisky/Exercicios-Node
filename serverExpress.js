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
    try {
        // Temos que capturar os dados vindos do frontend
        let {cpf, numeroCandidato, timeStamp} = req.body;
    
        let successMsg = {
            "status": "200",
            "msg": "Seu voto foi registrado com sucesso!"
        }
        // Salvar os dados capturados no arquivo votacao.csv (o arquivo será criado automaticamente ao salvar)
        await fs.appendFile('backend/votacao.csv', `${cpf}, ${numeroCandidato}, ${timeStamp}` + '\n');
        
        res.json(successMsg)      
    } catch (error) {
        let errorMsg = {
            'status': "500",
            "msg": "Erro ao registrar seu voto, contate o administrador do sistema"
        }
        console.error('Erro: ', error)
        res.json(errorMsg)       
    }

})

app.get('/apuracao', async (req, res) => {

    try {
        const registroDeVotos = await fs.readFile('backend/votacao.csv', 'utf-8')
        const votos = registroDeVotos.split('\n');
    
        const apuracaoDosVotos = {
            'nulo': 0,
            'branco': 0,
            '101': 0,
            '202': 0,
            '303': 0,
            '404': 0,
            '505': 0
        };
        
        votos.forEach((voto) => {
            const dados = voto.split(',');
            const numeroCandidato = dados[1];
            if (numeroCandidato in apuracaoDosVotos) {
                apuracaoDosVotos[numeroCandidato]++;
            } else {
                apuracaoDosVotos[numeroCandidato] = 1;
            }
        })  
        // Está faltando determinar as informações dos candidatos, então precisamos ler o documento config.csv que seria nosso banco de dados dos candidatos:
        const candidatosInfo = await fs.readFile('config.csv', 'utf-8');
        const candidatosArray = candidatosInfo.split(',');

        // Após lermos os dados, eles estarão em array. O certo seria transformar para JS Object facilitando acesso as informações
        const candidatosObj = {};
        candidatosArray.forEach((_, i) => { //Percorremos o array criado e adicionamos as informações dentro do JS Object 'candidatosObj'
            if (i % 4 == 0) {
                const numeroCandidato = candidatosArray[i + 1]; // Posição 0 do array é o CPF, numeroCandidato é na posição 1 do array
                candidatosObj[numeroCandidato] = {
                    nomeCandidato: candidatosArray[i + 2],
                    imagemCandidato: candidatosArray[i + 3],
                };
            }
            const resultadoApuracao = Object.entries(apuracaoDosVotos) // Retorna as entradas(entries) do array apuracaoDosVotos
            .map(([numeroCandidato, qtdVotos]) => { // Como o retorno é [chave, valor], chave = numeroCandidato, valor = qtdVotos
                const infoCandidato = candidatosObj[numeroCandidato];

                return {
                    numeroCandidato,
                    qtdVotos,
                    nomeCandidato: infoCandidato ? infoCandidato.nome : numeroCandidato,
                    urlFotoCandidato: infoCandidato ? infoCandidato.imagem : null,
                };
            })
            .sort((a, b) => b.qtdVotos - a.qtdVotos); // ordena em ordem decrescente pela quantidade de votos

        res.json(resultadoApuracao);

        })

    } catch (error) {
        console.error("Erro:", error);
        res.status(500).json({
            "Status": "500",
            "Mensagem": "Erro ao obter apuração, contate o administrador do sistema"
        });
    }
});

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


