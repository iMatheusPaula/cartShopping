const productsContainer = document.querySelector(".list-products");
const lsContent = [];

function setLSContent(lsContent) {
  // salva dentro do localStorage
  localStorage.setItem("products", JSON.stringify(lsContent));
}

function saveProduct(clickedBtn) {
  // salve o produto selecionado no localStorage e exibe no carrinho juntos

  // variaveis
  const productId = clickedBtn.getAttribute("data-id");
  const divBox = clickedBtn.parentElement.parentElement;
  const divProductPrice = clickedBtn.parentElement;
  const prodImage = divBox.querySelector("img").src;
  const prodName = divBox.querySelector("h4").textContent;
  const prodPrice = divProductPrice.querySelector("p").textContent;

  lsContent.push({
    id: productId,
    image: prodImage,
    name: prodName,
    price: prodPrice
  });

  // adiciona um produto no LocalStorage
  setLSContent(lsContent);
}

document.addEventListener("DOMContentLoaded", funcao);

function funcao(){
    productsContainer.addEventListener("click", function(e) {
        if (e.target.classList.contains("buy")) {
          e.preventDefault();
          const clickedBtn = e.target;
          saveProduct(clickedBtn);
        }  
    });
}