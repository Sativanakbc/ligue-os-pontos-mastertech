// Função utilitária - transforma cor hexadecimal em RGB
function hexToRgb(hex) {
    let c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length == 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return 'rgb(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(', ') + ')';
    }
    throw new Error('Bad Hex');
}

// Função utilitária - encurta o processo de seleção de elemento

function meuSelector(a) {
    return document.querySelector(a)
}

// Define as configs do jogo, sendo elas nomes e cores a ser utilizados.

function defineJogo() {
    if (meuSelector('#game').childElementCount === 0) {
        if (meuSelector('#nomePlayer1').value != "" || meuSelector('#nomePlayer2').value != "") {
            if (meuSelector('#corPlayer1').value !== meuSelector('#corPlayer2').value) {

                players["playerA"].nome = meuSelector('#nomePlayer1').value;
                players["playerB"].nome = meuSelector('#nomePlayer2').value;

                players["playerA"].corUsada = hexToRgb(meuSelector('#corPlayer1').value);
                players["playerB"].corUsada = hexToRgb(meuSelector('#corPlayer2').value);

                players["playerA"].pontos = 0;
                players["playerB"].pontos = 0;

                meuSelector('#nomeA').textContent = meuSelector('#nomePlayer1').value + ":";
                meuSelector('#nomeB').textContent = meuSelector('#nomePlayer2').value + ":";

                configsGame.style.display = 'none';
                construirEstrutura()
            } else {
                alert(`A cor do ${meuSelector('#nomePlayer1').value} deve ser diferente da cor do ${meuSelector('#nomePlayer2').value}.`)
            }
        }
    }else{
        cancelarPartida();
        setTimeout(defineJogo, 1500);
    }
}

// Função utilitária - cria elementos para serem vinculados a outros, e se necessário, inserir os mesmos em vetores

function criarElemento(elemento, tipo, identificador, indice, posicao, vetor) {
    let novoElemento = document.createElement(elemento);

    tipo === 'class' ? novoElemento.classList.add(identificador) : novoElemento.id = identificador;

    if (indice != undefined && posicao != undefined && vetor != undefined) {
        vetor[indice].splice(posicao, posicao, novoElemento);
    }

    return novoElemento;
}

// Constrói a estrutura do game, com base no vetor de quadrados

function construirEstrutura() {
    for (let l = 0; l < quadrados.length; l++) {
        for (let c = 0; c < quadrados[l].length; c++) {
            // Adiciona quadrados ao game e vincula cada item a matriz para manipulação futura
            centroGame.appendChild(criarElemento('div', 'id', 'q' + l.toString() + c.toString(), l, c, quadrados));

            // Adiciona os botões ao topo do quadrado
            quadrados[l][c].appendChild(criarElemento('button', 'class', 'botaoTopo'));
            quadrados[l][c].appendChild(criarElemento('span', 'class', 'ponto'));
            // Adiciona os botões esquerdos do quadrado
            quadrados[l][c].appendChild(criarElemento('button', 'class', 'botaoEsquerdo'));

            if (quadrados[l].length - 1 == c) {
                quadrados[l][c].appendChild(criarElemento('span', 'class', 'pontoDireita'));
                quadrados[l][c].appendChild(criarElemento('button', 'class', 'botaoDireita'));
            }

            if (quadrados.length - 1 == l) {
                quadrados[l][c].appendChild(criarElemento('span', 'class', 'pontoBottom'));
                quadrados[l][c].appendChild(criarElemento('button', 'class', 'botaoBottom'));
                if (quadrados[l].length - 1 == c) {

                    quadrados[l][c].appendChild(criarElemento('span', 'class', 'pontoBottomD'));
                }
            }
        }
    }

    let botoes = document.querySelectorAll('#game button');
    for (botao of botoes) {
        botao.onclick = function () {
            let quadrado = this.parentElement;

            // Adiciona o evento ao botão que fica ao topo do quadrado
            if (this.classList[0] === "botaoTopo") {
                this.parentElement.style.borderTop = `5px solid ${players[quemJoga].corUsada}`;
                if (quadrado.id.charAt(1) != '0') {
                    let numeroLinha = parseInt(quadrado.id.charAt(1))
                    let idAcima = quadrado.id.charAt(0) + (numeroLinha - 1).toString() + quadrado.id.charAt(2)
                    document.querySelector(`#${idAcima}`).style.borderBottom = `5px solid ${players[quemJoga].corUsada}`;
                }
            } else if (this.classList[0] === "botaoEsquerdo") {
                this.parentElement.style.borderLeft = `5px solid ${players[quemJoga].corUsada}`;
                if (quadrado.id.charAt(2) != '0') {
                    let numColuna = parseInt(quadrado.id.charAt(2))
                    let idAcima = quadrado.id.charAt(0) + quadrado.id.charAt(1) + (numColuna - 1).toString()
                    document.querySelector(`#${idAcima}`).style.borderRight = `5px solid ${players[quemJoga].corUsada}`;
                }

            } else if (this.classList[0] === "botaoDireita") {
                this.parentElement.style.borderRight = `5px solid ${players[quemJoga].corUsada}`;
            } else {
                this.parentElement.style.borderBottom = `5px solid ${players[quemJoga].corUsada}`
            }
            this.parentElement.removeChild(this);
            verificarPonto(quadrado, this);
        }
    }
}

function verificarPonto(q, b) {
    // As três condições abaixo faz a verificação se o quadrado atual || vizinho está preenchido.
    if (b.classList[0] === "botaoEsquerdo" && q.id.charAt(2) != '0') {
        let numColuna = parseInt(q.id.charAt(2))
        let idAcima = q.id.charAt(0) + q.id.charAt(1) + (numColuna - 1).toString()
        if (document.querySelector(`#${idAcima}`).style.borderColor === players[quemJoga].corUsada) {
            meuSelector(`#${quemJoga}`).textContent = players[quemJoga].pontos += 1;
        };
    }

    if (b.classList[0] === "botaoTopo" && q.id.charAt(1) != '0') {
        let numeroLinha = parseInt(q.id.charAt(1))
        let idAcima = q.id.charAt(0) + (numeroLinha - 1).toString() + q.id.charAt(2)
        if (document.querySelector(`#${idAcima}`).style.borderColor === players[quemJoga].corUsada) {
            meuSelector(`#${quemJoga}`).textContent = players[quemJoga].pontos += 1;
        };
    }

    if (q.style.borderColor === players[quemJoga].corUsada) {
        meuSelector(`#${quemJoga}`).textContent = players[quemJoga].pontos += 1;
    };
    // Faz a troca de próximo jogar
    quemJoga === 'playerA' ? quemJoga = 'playerB' : quemJoga = 'playerA';
    // Se não houver mais botões para aplicar a borda, ele exclui a estrutura atual e cria uma nova rodada.
    let botoes = document.querySelectorAll('#game button');
    if (botoes.length === 0) {
        setTimeout(construirEstrutura, 1500);
    }
}

// Define quem jogará primeiro, opções: playerA || playerB
let quemJoga = 'playerA';
// Define o objeto do player, com informações básicas para o game
let players = {
    'playerA': {
        'nome': null,
        'corUsada': null,
        'pontos': 0
    },

    'playerB': {
        'nome': null,
        'corUsada': null,
        'pontos': 0
    }
}
// Define a estrutura dos quadrados por linhas e colunas (o número em cada indice do vetor é indiferente)
let quadrados = [
    [1, 2, 3, 4],
    [1, 2, 3, 4],
    [1, 2, 3, 4],
    [1, 2, 3, 4]
];
// Define o campo de game e quantos quadrados haverá em jogo
let centroGame = document.querySelector('#game');

let novaPartida = document.querySelector('#novaPartida');
novaPartida.onclick = comecarPartida;

let botaoCancelarPartida = document.querySelector('#cancelaPartida');
botaoCancelarPartida.onclick = cancelarPartida;

let botaoApagarPlacar = document.querySelector('#apagaPlacar');
botaoApagarPlacar.onclick = apagarPlacar;

let configsGame = document.querySelector('#configs');

function comecarPartida() {
    configsGame.style.display = 'flex';
}

function cancelarPartida() {
    let quadrados = document.querySelectorAll('#game div');
    for (div of quadrados) {
        div.parentElement.removeChild(div);
    }

    for (player in players) {
        meuSelector(`#${player}`).textContent = player.pontos = 0;
    }
}

function apagarPlacar() {
    for (player in players) {
        meuSelector(`#${player}`).textContent = player.pontos = 0;
    }
}


let comecarGame = document.querySelector('#comecarGame');
comecarGame.onclick = defineJogo;