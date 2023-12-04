let candidates
const btnConfirma = document.getElementById('idBtnConfirma');
const btnCancela = document.getElementById('idBtnCancela');
const btnBranco = document.getElementById('idBtnBranco');

(function() {
    loadSelect()
})();

numberCandidate = document.getElementById('idCandidateNr');
let select = document.getElementById('idCandidates');

function displayCandidate() {
    console.log(numberCandidate.value);

    let candidate = candidates.filter((value) => {
        return value.numeroCandidato === numberCandidate.value
    })

    if (candidate.length == 1) {
        document.getElementById('idCandidateName').innerText = candidate[0].nomeCandidato;
        document.getElementById('idCandidateImg').src = candidate[0].urlFoto;
        document.getElementById('idCandidateImg').alt = candidate[0].nomeCandidato;
    } else {
        // Limpar os detalhes do candidato se nenhum candidato for encontrado
        document.getElementById('idCandidateName').innerText = '';
        document.getElementById('idCandidateImg').src = '';
        document.getElementById('idCandidateImg').alt = '';
    }
};

numberCandidate.addEventListener('input', function () {
    let inputedCandidate = numberCandidate.value;
    select.value = inputedCandidate
    displayCandidate();
});


select.addEventListener('change', function () {
    let selectedCandidate = select.value
    numberCandidate.value = selectedCandidate
    displayCandidate();
});


async function loadSelect() {
    candidates = await loadUrna();
    console.log(candidates[0].tipoEleicao);

    if (candidates[0].tipoEleicao === "a") {
        document.getElementById('idCpf').hidden = true;
    }

    const selectCandidates = document.getElementById('idCandidates');
        candidates.forEach(candidate => {
            const option = document.createElement('option');
            option.value = candidate.numeroCandidato;
            option.text = `${candidate.numeroCandidato} - ${candidate.nomeCandidato}`;
            selectCandidates.add(option);
            selectCandidates.onchange = function changeCandidate(e) {
                document.getElementById('idCandidateNr').value = e.target.value;
            }
        
});
}

function getDate() {
    const date = new Date();
    let day = date.getDate().toString().padStart(2, '0');
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let year = date.getFullYear();

    let hours = String(date.getHours()).padStart(2, '0')
    let minutes = String(date.getMinutes()).padStart(2, '0')
    let seconds = String(date.getSeconds()).padStart(2, '0')
    let milliseconds = String(date.getMilliseconds()).padStart(3, '0')

    let timeAndDate = `${day}-${month}-${year}-${hours}-${minutes}-${seconds}-${milliseconds}`;
    return timeAndDate;
}

// TRECHO QUE CONFIGURA AS MODAIS EM BS

function abrirModal(idModal) {
    // Desabilita todos os botões e inputs
    desabilitarElementos();
    // Evento para habilitar os elementos quando a modal for fechada
    var modal = document.getElementById(idModal)
    modal.style.display = "flex"
    setTimeout(() => habilitarElementos, 2100); 
}
function fecharModal(idModal) {
    var modal = document.getElementById(idModal)
    modal.style.display = "none"
    habilitarElementos();
}

// TRECHO QUE HABILITA E DESABILITA BOTÕES E CAMPOS ENQUANTO MODAL ESTÁ ATIVA OU NÃO

function desabilitarElementos() {
    const elementosParaDesabilitar = document.getElementsByClassName('disabledOrEnabled');
    // Convertendo a coleção HTML em um array
    const arrayElementos = Array.from(elementosParaDesabilitar);
    // Itera sobre os elementos e desabilita cada um deles
    arrayElementos.forEach(elemento => {
        elemento.disabled = true;
    });
}
function habilitarElementos() {
    const elementosParaHabilitar = document.getElementsByClassName('disabledOrEnabled');
    // Convertendo a coleção HTML em um array
    const arrayElementos = Array.from(elementosParaHabilitar);
    // Itera sobre os elementos e habilita cada um deles
    arrayElementos.forEach(elemento => {
        elemento.disabled = false;
    });
}

// TRECHO QUE CANCELA INFORMAÇÕES DE VOTO (BOTÃO CANCELA)

btnCancela.addEventListener('click', function() {
    document.getElementById('idCandidateName').innerText = '';
    document.getElementById('idCandidateImg').src = '';
    document.getElementById('idCandidateImg').alt = '';
    select.value = '';
    numberCandidate.value = '';
})

// TRECHO QUE REALIZA O REGISTRO DE VOTO (BOTÃO CONFIRMA)

btnConfirma.addEventListener('click', registrarVoto)

async function registrarVoto() {

    let dataHora = getDate();
    let dadosVoto = {
        method: 'POST',
        body: JSON.stringify({
            cpf: '',
            numeroCandidato: numberCandidate.value,
            timeStamp: dataHora
        }), headers: { 'Content-Type': 'application/json' }
    };

    let response = await fetch ('http://localhost:3001/voto', dadosVoto);
    let mensagem = await response.json();
    console.log (mensagem);

    if (mensagem.status == 200 && numberCandidate.value.trim() != '') {
        console.log ('status de mensagem foi 200, logo entrou no IF');
        abrirModal('idModalSucesso')

        // Fecha o modal após 2000 milissegundos
        setTimeout(() => fecharModal('idModalSucesso'), 2100);      
    } else {
        console.error('Erro ao registrar seu voto. Tente contatar o administrador do sistema');
        abrirModal('idModalFalha');

    }
}

// TRECHO QUE REALIZA O REGISTRO DE VOTO EM BRANCO (BOTÃO BRANCO)

btnBranco.addEventListener('click', registrarVotoBranco)

async function registrarVotoBranco() {

    let dataHora = getDate();
    let dadosVoto = {
        method: 'POST',
        body: JSON.stringify({
            cpf: '',
            numeroCandidato: 'BRANCO',
            timeStamp: dataHora
        }), headers: { 'Content-Type': 'application/json' }
    };

    let response = await fetch ('http://localhost:3001/voto', dadosVoto);
    let mensagem = await response.json();
    console.log (mensagem);

    if (mensagem.Status == 200) {
        console.log ('status de mensagem foi 200, logo entrou no IF');
        abrirModal('idModalSucesso')

        // Fecha o modal após 2000 milissegundos
        setTimeout(() => fecharModal('idModalSucesso'), 3000);      
    } else {
        console.error('Erro ao registrar seu voto. Tente contatar o administrador do sistema');
        abrirModal('idModalFalha');

    }
}


// Função para carregar a configuração inicial da urna
async function loadUrna() {
    try {
        const response = await fetch('http://localhost:3001/cargainicial');
            return response.json();
        } catch (error) {
            console.error('Erro ao carregar a configuração inicial:', error);
        }
    }
