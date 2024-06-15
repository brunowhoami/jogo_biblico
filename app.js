let acertos = 0;
let erros = 0;
let perguntas = [];
let perguntaAtual = 0;
let nivelDificuldade = "facil"; // Nível de dificuldade padrão
const totalPerguntas = 7;

function exibirMensagemNaTela(tag, texto) {
    let campo = document.querySelector(tag);
    campo.innerHTML = texto;
}

function exibirTextoNaTela() {
    exibirMensagemNaTela("h1", "Bem Vindo ao jogo Bíblico");
}

exibirTextoNaTela();

function carregarPerguntas() {
    fetch("perguntas.json")
        .then(response => response.json())
        .then(data => {
            perguntas = data[nivelDificuldade];
            embaralharPerguntas();
            exibirPergunta();
        })
        .catch(error => console.error("Erro ao carregar perguntas", error));
}

function embaralharPerguntas() {
    perguntas.sort(() => Math.random() - 0.5);
}

function exibirPergunta() {
    if (perguntaAtual < totalPerguntas && perguntaAtual < perguntas.length) {
        document.getElementById("pergunta").innerText = perguntas[perguntaAtual].pergunta;
    } else {
        document.getElementById("pergunta").innerText = `Fim do jogo! Você respondeu todas as perguntas. Acertos: ${acertos}, Erros: ${erros}`;
        document.getElementById("reiniciar").disabled = false;
    }
}

function removerAcentos(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function verificarResposta() {
    const respostaUsuario = removerAcentos(document.getElementById("resposta").value.trim().toLowerCase());
    const respostaCorreta = removerAcentos(perguntas[perguntaAtual].resposta.toLowerCase());

    const palavrasCorretas = respostaCorreta.split("");
    let palavrasCorretasEncontradas = 0;

        palavrasCorretas.forEach(palavra => {
            if(respostaUsuario.includes(palavra)){
                palavrasCorretasEncontradas++;
            }
        }); 

    const percentPalavrasCorretas = palavrasCorretasEncontradas / palavrasCorretas.length;

    if (percentPalavrasCorretas >= 0.7) {
        document.getElementById("resultado").innerText = "Resposta correta!";
        acertos++;
    } else {
        document.getElementById("resultado").innerText = `Resposta errada! A resposta correta é ${perguntas[perguntaAtual].resposta}.`;
        erros++;
    }

    // Limpar o campo de resposta e passar para a próxima pergunta
    document.getElementById("resposta").value = "";
    perguntaAtual++;
    exibirPergunta();
}

function reiniciarJogo() {
    perguntaAtual = 0;
    acertos = 0;
    erros = 0;
    document.getElementById("resultado").innerText = "";
    document.getElementById("reiniciar").disabled = true;
    exibirTextoNaTela();
    mostrarSelecaoDificuldade();
}

function selecionarDificuldade() {
    nivelDificuldade = document.querySelector('input[name="dificuldade"]:checked').value;
    carregarPerguntas();
    document.querySelector('.container__selecao').style.display = 'none';
    document.querySelector('.container__informacoes').style.display = 'block';
}

function mostrarSelecaoDificuldade() {
    document.querySelector('.container__selecao').style.display = 'block';
    document.querySelector('.container__informacoes').style.display = 'none';
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("botaoIniciar").addEventListener("click", selecionarDificuldade);
    mostrarSelecaoDificuldade();
});

document.addEventListener("DOMContentLoaded", () => {
    carregarPerguntas();

    // Adicionar evento de tecla ao campo de entrada de resposta
    document.getElementById("resposta").addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault(); // Evita a submissão do formulário ao pressionar "Enter"
            verificarResposta(); // Chama a função verificarResposta() ao pressionar "Enter"
        }
    });
});
