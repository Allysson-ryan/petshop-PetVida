// Verificando se o código HTML foi carregado totalmente
if (document.readyState == "loading") {
    document.addEventListener("DOMContentLoaded", ready);
} else {
    ready();
}

// Função que é chamada quando o HTML está pronto
function ready() {
    attachRemoveListeners(); 
    attachQuantityListeners(); 
    attachAddCartListeners(); 
    attachCheckboxListeners(); 
    attachClearAllListener(); 

    // Recuperar quantidade e subtotal do localStorage
    recuperarQuantidade();
    updateTotal();
    updateCartItemCount();
}

// Adicionando event listener para a div que remove todos os produtos
function attachClearAllListener() {
    const clearAllButton = document.querySelector(".tirar-tudo-carrinho");
    if (clearAllButton) {
        clearAllButton.addEventListener("click", clearAllProducts);
    }
}

// Função para remover todos os produtos do carrinho
function clearAllProducts() {
    // Remover todos os produtos da visualização
    const productElements = document.querySelectorAll(".produtos");
    productElements.forEach(productElement => productElement.remove());

    // Limpar o localStorage
    localStorage.removeItem("cartProducts");

    // Atualizar o subtotal e o contador de itens
    updateTotal();
    updateCartItemCount();

    // Opcional: Mostrar uma mensagem de confirmação
    alert('Todos os produtos serão removidos do carrinho.');
}

// Adicionando produto no carrinho
document.addEventListener("DOMContentLoaded", function () {
    let cartProducts = JSON.parse(localStorage.getItem("cartProducts")) || [];

    cartProducts.forEach(product => {
        let newCartProduct = document.createElement("div");
        newCartProduct.classList.add("produtos");

        newCartProduct.innerHTML = `
            <div class="box-left-produtos">
                <label class="selecionar-produto">
                    <input type="checkbox" class="selectItem-checkbox">
                </label>
                <div class="img-produto">
                    <img src="${product.image}" alt="${product.name}" style="width: 6rem; margin-left: 10px;">
                </div>
            </div>
            <div class="box-right-produtos">
                <div class="nome-produto-carrinho">
                    <a href="/src/page/produtosPage.html" style="text-decoration: none; color: #000000" class="nomeProduto"> ${product.name} </a>
                    <div class="icon-deletar">
                        <button style="margin-left: 20px; border: none; background: none;" class="removerProduto">
                            <img src="../../assets/icons/lixo.png" alt="lixeira icon" style="width: 15.5px; margin-left: 25px;">
                        </button>
                    </div>
                </div>
                <div class="preco-produto">
                    <div class="carrinho-preço-produto-compreAgora">
                        <span class="cart-product-price"> ${product.price}</span>
                    </div>
                    <div class="quantidade-produto">
                        <button class="icon-remove-umProduto" style="border: none; background: none;">
                            <img src="../../assets/icons/menos-pequeno.png" alt="icon menos" style="width: 18px;">
                        </button>
                        <div class="box-inputNumeroProduto">
                            <input type="text" class="input-numero-produto" value="${product.quantity}">
                        </div>
                        <button class="icon-adiciona-umProduto" style="border: none; background: none;">
                            <img src="../../assets/icons/mais-pequeno.png" alt="icon mais" style="width: 20px">
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.querySelector(".container-produtosCarrinho").appendChild(newCartProduct);
    });

    // Adiciona event listeners aos novos itens
    attachRemoveListeners();
    attachQuantityListeners();
    attachCheckboxListeners(); // Adiciona os event listeners às checkboxes dos produtos existentes
    updateTotal(); // Atualiza o subtotal após carregar os produtos
    updateCartItemCount(); // Atualiza o número de itens no carrinho após carregar os produtos
});

// Adicionando event listeners aos botões de remover produto
function attachRemoveListeners() {
    const btnRemoverProduto = document.getElementsByClassName("removerProduto");
    for (var i = 0; i < btnRemoverProduto.length; i++) {
        btnRemoverProduto[i].addEventListener("click", removeProduct);
    }
}

// Adicionando event listeners aos botões de adicionar ao carrinho
function attachAddCartListeners() {
    const addCartButtons = document.getElementsByClassName("btn-addCarrinho");
    for (var i = 0; i < addCartButtons.length; i++) {
        addCartButtons[i].addEventListener("click", addProductToCart);
    }
}

// Adicionando event listeners aos botões de quantidade
function attachQuantityListeners() {
    const btnAdicionar = document.querySelectorAll('.icon-adiciona-umProduto');
    const btnRemover = document.querySelectorAll('.icon-remove-umProduto');

    btnAdicionar.forEach((botao) => {
        botao.addEventListener('click', function () {
            const container = this.closest('.quantidade-produto');
            if (container) {
                const input = container.querySelector('.input-numero-produto');
                if (input) {
                    let quantidade = parseInt(input.value);
                    if (!isNaN(quantidade)) {
                        input.value = quantidade + 1;
                        // Salvar quantidade no localStorage
                        salvarQuantidade(container.closest('.produtos'), input.value);
                    } else {
                        input.value = 1;
                    }
                    updateTotal(); // Atualiza o subtotal após incrementar
                }
            }
        });
    });

    btnRemover.forEach((botao) => {
        botao.addEventListener('click', function () {
            const container = this.closest('.quantidade-produto');
            if (container) {
                const input = container.querySelector('.input-numero-produto');
                if (input) {
                    let quantidade = parseInt(input.value);
                    if (!isNaN(quantidade) && quantidade > 1) {
                        input.value = quantidade - 1;
                        // Salvar quantidade no localStorage
                        salvarQuantidade(container.closest('.produtos'), input.value);
                    } else {
                        input.value = 1;
                    }
                    updateTotal(); // Atualiza o subtotal após decrementar
                }
            }
        });
    });
}

// Adicionando event listeners às checkboxes
function attachCheckboxListeners() {
    const checkboxes = document.querySelectorAll(".selectItem-checkbox");
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateTotal);
    });
}

// Função para remover um produto do carrinho
function removeProduct(event) {
    const productElement = event.target.closest('.produtos');
    const productName = productElement.querySelector(".nomeProduto").innerText;
    
    // Remover o produto da visualização
    productElement.remove();

    // Atualizar o localStorage
    let cartProducts = JSON.parse(localStorage.getItem("cartProducts")) || [];
    cartProducts = cartProducts.filter(product => product.name !== productName);
    localStorage.setItem("cartProducts", JSON.stringify(cartProducts));

    updateTotal();
    updateCartItemCount(); // Atualiza o número de itens no carrinho após a remoção
}

// Função para atualizar o subtotal
function updateTotal() {
    let totalAmount = 0;
    const cartProducts = document.getElementsByClassName("produtos");

    for (var i = 0; i < cartProducts.length; i++) {
        const productElement = cartProducts[i];
        const checkbox = productElement.querySelector(".selectItem-checkbox");
        
        // Verificar se a checkbox está marcada
        if (checkbox.checked) {
            const productPrice = productElement.getElementsByClassName("cart-product-price")[0].innerText.replace("R$", "").replace(",", ".");
            const productQuantity = productElement.getElementsByClassName("input-numero-produto")[0].value;

            totalAmount += productPrice * productQuantity;

            // Salvar quantidade no localStorage
            salvarQuantidade(productElement, productQuantity);
        }
    }

    totalAmount = totalAmount.toFixed(2);
    totalAmount = totalAmount.replace(".", ",");
    document.querySelector(".box-subtotal span").innerText = "R$" + totalAmount;

    localStorage.setItem('subtotal', totalAmount);
}

// Função para salvar a quantidade no localStorage
function salvarQuantidade(productElement, quantity) {
    const productName = productElement.querySelector(".nomeProduto").innerText;
    
    // Recuperar os produtos do localStorage
    let cartProducts = JSON.parse(localStorage.getItem("cartProducts")) || [];
    
    // Encontrar o produto específico e atualizar sua quantidade
    cartProducts = cartProducts.map(product => {
        if (product.name === productName) {
            product.quantity = quantity;
        }
        return product;
    });

    // Atualizar o localStorage com as novas informações
    localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
}

// Função para recuperar a quantidade do localStorage
function recuperarQuantidade() {
    const cartProducts = document.getElementsByClassName("produtos");
    for (var i = 0; i < cartProducts.length; i++) {
        const productName = cartProducts[i].querySelector(".nomeProduto").innerText;
        const quantity = localStorage.getItem(productName);

        if (quantity) {
            cartProducts[i].querySelector(".input-numero-produto").value = quantity;
        }
    }
}

// Função para atualizar o contador de itens no carrinho
function updateCartItemCount() {
    const itemCount = document.querySelectorAll(".produtos").length;
    document.querySelector(".Number-Itens").innerText = `(${itemCount})`;

    console.log(itemCount);
}


