/*----links entrar/registrar----*/

function menuShow() {
    document.querySelector('.links-entrarRegistrar').style.display = 'block';
}

function menuHide() {
    document.querySelector('.links-entrarRegistrar').style.display = 'none';
}

// Adicionar eventos para garantir que o menu permaneça visível
document.querySelector('.box-entrarRegistrar').addEventListener('mouseover', menuShow);
document.querySelector('.box-entrarRegistrar').addEventListener('mouseout', function(event) {
    if (!event.relatedTarget.closest('.links-entrarRegistrar')) {
        menuHide();
    }
});

document.querySelector('.links-entrarRegistrar').addEventListener('mouseover', menuShow);
document.querySelector('.links-entrarRegistrar').addEventListener('mouseout', function(event) {
    if (!event.relatedTarget.closest('.box-entrarRegistrar')) {
        menuHide();
    }
});




// Inicializar o autocompletar do Google Places API
function initAutocomplete() {
    const addressInput = document.getElementById('address');
    const autocomplete = new google.maps.places.Autocomplete(addressInput);
}

// Inicializar o calendário do Flatpickr
function initFlatpickr() {
    flatpickr("#date", {
        enableTime: true,
        dateFormat: "Y-m-d H:i",
        locale: {
            firstDayOfWeek: 1
        }
    });
}

// Chamar as funções de inicialização
document.addEventListener('DOMContentLoaded', function() {
    initAutocomplete();
    initFlatpickr();
});



//local storage para guardar informações dos produtos para usar no carrinho

// Função para atualizar a quantidade de produtos no carrinho
function updateCartQuantity(event, action) {
    const button = event.target;
    const productElement = button.closest('.produto-carrinho'); // Div que contém o produto no carrinho
    const productName = productElement.querySelector('.product-title').innerText; // Nome do produto
    const quantityInput = productElement.querySelector('.quantity-input'); // Input da quantidade

    let currentQuantity = parseInt(quantityInput.value); // Converte o valor do input para número

    // Aumenta ou diminui a quantidade com base no botão clicado
    if (action === 'add') {
        currentQuantity += 1;
    } else if (action === 'remove' && currentQuantity > 1) {
        currentQuantity -= 1;
    }

    // Atualiza o valor do input de quantidade
    quantityInput.value = currentQuantity;

    // Atualiza o produto no localStorage
    updateProductInLocalStorage(productName, currentQuantity);

    // Atualiza o emblema do carrinho com a quantidade total
    updateCartBadge();
}

// Função para atualizar o produto no localStorage
// Função para adicionar produto ao carrinho
function addProductToCart(event) {
    const button = event.target;
    const productInfos = button.closest('.card-produtos');
    const productImage = productInfos.querySelector(".product-image").src;
    const productName = productInfos.querySelector(".product-title").innerText;
    const productPrice = productInfos.querySelector(".product-price").innerText;

    // Criando um objeto para armazenar as informações do produto
    const product = {
        image: productImage,
        name: productName,
        price: productPrice,
        quantity: 1,
    };

    // Recuperando os produtos existentes no carrinho do localStorage
    let cartProducts = JSON.parse(localStorage.getItem("cartProducts")) || [];

    // Verificando se o produto já está no carrinho
    const existingProductIndex = cartProducts.findIndex(p => p.name === productName);
    if (existingProductIndex !== -1) {
        // Se o produto já está no carrinho, aumenta a quantidade
        cartProducts[existingProductIndex].quantity += 1;
    } else {
        // Caso contrário, adiciona o novo produto ao carrinho
        cartProducts.push(product);
    }

    // Salvando o carrinho atualizado no localStorage
    localStorage.setItem("cartProducts", JSON.stringify(cartProducts));

    // Atualiza o emblema do carrinho com a quantidade total
    updateCartBadge();

    alert('Produto adicionado ao carrinho!');
}






// Local storage onde guarda informações dos itens add ao carrinho
function addProductToCart(event) {
    const button = event.target;
    const productInfos = button.parentElement.parentElement;
    const productImage = productInfos.getElementsByClassName("product-image")[0].src;
    const productName = productInfos.getElementsByClassName("product-title")[0].innerText;
    const productPrice = productInfos.getElementsByClassName("product-price")[0].innerText;

    // Criando um objeto para armazenar as informações do produto
    const product = {
        image: productImage,
        name: productName,
        price: productPrice,
        quantity: 1,
        checked: false // Adiciona uma propriedade para o estado da checkbox
    };

    // Recuperando os produtos existentes no carrinho do localStorage
    let cartProducts = JSON.parse(localStorage.getItem("cartProducts")) || [];

    // Verificando se o produto já está no carrinho
    const existingProductIndex = cartProducts.findIndex(p => p.name === productName);
    if (existingProductIndex !== -1) {
        // Atualiza a quantidade do produto existente
        cartProducts[existingProductIndex].quantity += 1;
    } else {
        // Adiciona o novo produto ao carrinho
        cartProducts.push(product);
    }

    // Salvando o carrinho atualizado no localStorage
    localStorage.setItem("cartProducts", JSON.stringify(cartProducts));

    alert('Produto adicionado ao carrinho!');
}

document.querySelectorAll('.product-link').forEach(link => {
    link.addEventListener('click', (event) => {
        // Previne o comportamento padrão de ir para a página diretamente
        event.preventDefault();

        // Encontra o elemento pai (card) do produto
        const productCard = event.target.closest('.card-produtos');
        
        // Captura as informações do produto
        const productImage = productCard.querySelector('.product-image').src;
        const productName = productCard.querySelector('.product-title').innerText;
        const productPrice = productCard.querySelector('.product-price').innerText;

        // Cria o objeto com as informações do produto
        const productDetails = {
            image: productImage,
            name: productName,
            price: productPrice
        };

        // Armazena o objeto no localStorage
        localStorage.setItem('selectedProduct', JSON.stringify(productDetails));

        // Redireciona o usuário para a página do produto
        window.location.href = '/src/page/produtosPage.html';
    });
});