let dados = [];
let cardContainer = document.querySelector(".card-container");
iniciarBusca();
async function iniciarBusca() {
    let resposta = await fetch("data.json");
    dados = await resposta.json();
    // console.log(dados);

    renderizarCards(dados);


}
function renderizarCards(dados) {
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