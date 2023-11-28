let candidates

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

// Função para carregar a configuração inicial da urna
async function loadUrna() {
    try {
        const response = await fetch('http://localhost:3001/cargainicial');
            return response.json();
        } catch (error) {
            console.error('Erro ao carregar a configuração inicial:', error);
        }
    }