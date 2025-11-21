let dados = [];
let cardContainer = document.querySelector(".card-container");
iniciarBusca();
async function iniciarBusca() {
    let resposta = await fetch("data.json");
    dados = await resposta.json();

    let campoBusca = normalizarString(document.getElementById("campo-busca").value);

    let resultados = dados.filter(dado =>
        normalizarString(dado.nome).includes(campoBusca) ||
        normalizarString(dado.tipo).includes(campoBusca)
    );

    renderizarCards(resultados);
}

function normalizarString(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function renderizarCards(dados) {
    cardContainer.innerHTML = ""; // Limpa o container antes de renderizar
    for (let dado of dados) {
        let article = document.createElement("article");
        article.classList.add("card");
        article.innerHTML = `
        <h2>${dado.nome}</h2>
        <p>${dado.tipo}</p>
        <a href="${dado.link}">Leia mais</a>
        `;
        cardContainer.appendChild(article);
    }
}