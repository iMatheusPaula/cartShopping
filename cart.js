
const cartContent = document.querySelector("#cart-content");
const totalPriceContainer = document.querySelector("#total-price");
const clearCartBtn = document.querySelector("#clear-cart");
const checkoutBtn = document.querySelector("#checkout-btn");

//QR CODE INICIO
const qrContainer = document.querySelector('#qr-code');

//Vars
let colorLight = '#FFF',
    colorDark = '#000',
    size = 300,
    text = 'https://www.ifms.edu.br';

async function generateQR(){
    qrContainer.innerHTML = '';
    new QRCode('qr-code', {
        text,
        height: size,
        width: size,
        colorLight,
        colorDark,
    })
}
// QR CODE FIM

function setLSContent(lsContent) {
    // salva dentro do localStorage
    localStorage.setItem("products", JSON.stringify(lsContent));
}

function getLSContent() {
    // pegando conteúdo do armazenamento local.
    // se nao tiver nada, cria um array vazio.
    const lsContent = JSON.parse(localStorage.getItem("products")) || [];
    return lsContent;
  }

function calculateTotal(prices) {
    // Calculadora de preços do carrinho
    return prices.reduce(function(prev, next) {
        return prev + next;
    }, 0);
}

function getCartItemPrices() {
    // pega todos os números dos preços dos itens do carrinho para calcular o total
    const prices = [];
    // recuperar o td no carrinho onde o preço do produto está armazenado
    // forEach para cada produto no carrinho
    let nums = cartContent.querySelectorAll("tr td:nth-child(3)");

    // olha todos os td e extrai o preço do produto
    // retire o $ do texto e converte a string em Float e insere na matriz de preços.
    if (nums.length > 0) {
        for (let cell = 0; cell < nums.length; cell++) {
            let num = nums[cell].innerText;
            num = num.replace(/[^\d]/g, "");
            num = parseFloat(num);
            prices.push(num);
        }
        // retorna o preço no array
        return prices;
    } 
    else {
        return;
    }
}

function displayCartTotal() {
    // exibe o valor total
    const prices = getCartItemPrices();
    let total = 0;
    if (prices) {
        total = calculateTotal(prices);
        totalPriceContainer.innerHTML = `<span class="total">Total: $${total.toFixed(2)}</span>`;
    } 
    else {
        totalPriceContainer.innerHTML = '<span class="total">Total: $0</span>';
    }
}

function displayProducts() {
    // mostra todos os produtos no carrinho e pega o conteudo no localstorage
    const lsContent = getLSContent();
    let productMarkup = "";
    // se o localstorage nao estiver vazio, pega os items com as informacoes
    if (lsContent !== null) {
        for (let product of lsContent) {
            productMarkup += `
            <tr>
            <td><img class="cart-image" src="${product.image}" alt="${
            product.name
            }" width="120"></td>
            <td>
                ${product.name}
            </td>
            <td>${product.price}</td>
            <td><a href="#" data-id="${product.id}" class="remove">X</a></td>
            </tr>
            `;
        }
    } 
    else {
        // se estiver vazio da um alerta
        productMarkup = "Your cart is empty.";
    }
    // adiciona no DOM
    cartContent.querySelector("tbody").innerHTML = productMarkup;
}

function removeProduct(productId) {
    // remove um produto do carrinho e localstorage e pega a lista 
    const lsContent = getLSContent();

    // pega o index do array do produto que vai ser removido
    let productIndex;
    lsContent.forEach(function(product, i) {
        if (product.id === productId) {
            productIndex = i;
        }
    });

    // modifique os itens na matriz do localstorage para remover o item selecionado.
    lsContent.splice(productIndex, 1);
    // atualiza o localstorage
    setLSContent(lsContent);
    displayProducts();
}

function clearCart() {
    // limpa tudo do carrinho e localstorage
    
    // recupera a lista de produtos do LocalStorage
    const lsContent = getLSContent();
    // Limpa o array do LocalStorage
    lsContent.splice(0, lsContent.length);
    // atualiza o localstorage
    setLSContent(lsContent);
    // mostra os produtos novamente
    displayProducts();
}

function checkout() {
    // finalizacao de compra

    // depois que o usuario confirma o fim
    const cartProducts = cartContent.querySelector("tbody").innerHTML;
    if (cartProducts !== "" && confirm("Tem certeza que deseja finalizar a compra?")) {
        const prices = getCartItemPrices();
        generateQR();
        clearCart();
    } 
    else {
        return;
    }
}

document.addEventListener("DOMContentLoaded", funcao);

function funcao(){
    // exibir lista de produtos no carrinho, se houver, no carregamento da página
    displayProducts();
    // exibir total do carrinho
    displayCartTotal();

    // vincular removeProduct ao evento click da tabela cartContent
    cartContent.querySelector("tbody").addEventListener("click", function(e) {
        e.preventDefault();
        // ve quando o botao é clicado
        const clickedBtn = e.target;
        // se for um botao de remover
        if (e.target.classList.contains("remove")) {
            // pega o id do produto selecionado
            const productId = clickedBtn.getAttribute("data-id");
            // usa o id para remover o produto
            removeProduct(productId);
            // exibir produtos no carrinho novamente,agora a lista deve ser exibida com 1 produto a menos ou vazio se não houver produtos no carrinho
            // ajusta o valor total
            displayCartTotal();
        }
    });

    // junta o botão para limpar o carrinho à função que limpa o carrinho e tambem a função que ajusta o preço total
    clearCartBtn.addEventListener("click", function(e) {
        e.preventDefault();
        clearCart();
    });
    clearCartBtn.addEventListener("click", displayCartTotal);

    // junta o botão que faz o checkout tanto à função que controla o checkout quanto à função que ajusta o preço total
    checkoutBtn.addEventListener("click", function(e) {
        e.preventDefault();
        text = 'Sua compra foi finalizada';
        checkout();
    });
    checkoutBtn.addEventListener("click", displayCartTotal);
}
