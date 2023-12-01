let candidates
const btnConfirma = document.getElementById('idBtnConfirma');
const btnCancela = document.getElementById('idBtnCancela');
const btnBranco = document.getElementById('idBtnBranco');
const disableElements = document.querySelectorAll('button, input')

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

numberCandidate.addEventListener('input', displayCandidate);

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

// Trecho que realiza o registro de voto
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

    let modalSucesso = document.getElementById('idModalSucesso');
    let modalFalha = document.getElementById('idModalFalha');

    if (mensagem.status === 200 && numberCandidate.value.trim() !== '') {
        modalSucesso.style.display = 'flex';
        setTimeout(() => fecharModal('idModalSucesso'), 2000)
    } else {
        console.error('Erro ao registrar seu voto. Tente contatar o administrador do sistema');
        abrirModal('idModalFalha');
        btnConfirma.setAttribute('disabled', '');
        btnConfirma.classList.add('disabled');
    }
}

function abrirModal(idModal) {
    var modal = document.getElementById(idModal)
    modal.style.display = "flex"
}

function fecharModal(idModal) {
    var modal = document.getElementById(idModal)
    modal.style.display = "none"
    
    disableElements.forEach(elemento => elemento.classList.remove('disabled'))
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
