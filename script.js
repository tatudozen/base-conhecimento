let dados = [];
let cardContainer = document.querySelector(".card-container");
let campoBuscaInput = document.getElementById("campo-busca");
let botaoBusca = document.getElementById("botao-busca");
let listaTarefas = document.getElementById("lista-tarefas");
let tarefaSelecionada = null;

// Carrega os dados ao iniciar
carregarDados();

// Adiciona eventos
botaoBusca.addEventListener("click", filtrarDados);
campoBuscaInput.addEventListener("input", filtrarDados);
campoBuscaInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        filtrarDados();
    }
});

async function carregarDados() {
    try {
        let resposta = await fetch("data.json");
        dados = await resposta.json();
        renderizarSidebar(dados);
        renderizarCards(dados);
    } catch (error) {
        console.error("Erro ao carregar dados:", error);
    }
}

function renderizarSidebar(dados) {
    let contagemTarefas = {};

    dados.forEach(dado => {
        if (dado.tarefas) {
            dado.tarefas.forEach(tarefa => {
                contagemTarefas[tarefa] = (contagemTarefas[tarefa] || 0) + 1;
            });
        }
    });

    // Ordenar tarefas por contagem (opcional) ou alfabética
    let tarefasOrdenadas = Object.keys(contagemTarefas).sort();

    listaTarefas.innerHTML = `<li class="task-item active" onclick="selecionarTarefa(null, this)">
        <span>Todas</span>
        <span class="task-count">${dados.length}</span>
    </li>`;

    tarefasOrdenadas.forEach(tarefa => {
        let li = document.createElement("li");
        li.classList.add("task-item");
        li.onclick = () => selecionarTarefa(tarefa, li);
        li.innerHTML = `
            <span>${tarefa}</span>
            <span class="task-count">${contagemTarefas[tarefa]}</span>
        `;
        listaTarefas.appendChild(li);
    });
}

function selecionarTarefa(tarefa, elemento) {
    tarefaSelecionada = tarefa;

    // Atualiza visual da sidebar
    document.querySelectorAll(".task-item").forEach(item => item.classList.remove("active"));
    elemento.classList.add("active");

    filtrarDados();
}

function filtrarDados() {
    let termoBusca = normalizarString(campoBuscaInput.value);

    let resultados = dados.filter(dado => {
        let matchTexto = normalizarString(dado.nome).includes(termoBusca) ||
            normalizarString(dado.tipo).includes(termoBusca) ||
            (dado.descricao && normalizarString(dado.descricao).includes(termoBusca));

        let matchTarefa = tarefaSelecionada ? (dado.tarefas && dado.tarefas.includes(tarefaSelecionada)) : true;

        return matchTexto && matchTarefa;
    });

    renderizarCards(resultados);
}

function normalizarString(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function renderizarCards(dados) {
    cardContainer.innerHTML = "";
    for (let dado of dados) {
        let article = document.createElement("article");
        article.classList.add("card");

        let tagsHtml = "";
        if (dado.tarefas) {
            tagsHtml = `<div class="card-tags">
                ${dado.tarefas.slice(0, 3).map(t => `<span class="tag">${t}</span>`).join('')}
                ${dado.tarefas.length > 3 ? `<span class="tag">+${dado.tarefas.length - 3}</span>` : ''}
            </div>`;
        }

        article.innerHTML = `
        <div class="card-header">
            <img src="${dado.logo}" alt="Logo ${dado.nome}" class="card-logo" onerror="this.src='https://placehold.co/60x60?text=AI'">
            <div class="card-title">
                <h2>${dado.nome}</h2>
                <span class="card-type">${dado.tipo}</span>
            </div>
        </div>
        <p class="card-description">${dado.descricao}</p>
        ${tagsHtml}
        <a href="${dado.link}" target="_blank" rel="noopener noreferrer" class="card-link">Visitar Site</a>
        `;
        cardContainer.appendChild(article);
    }
}