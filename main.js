const displayMode = (function() {
    const hide = function(element) {
        element.classList.add("hidden");
    }
    
    const show = function(element) {
        element.classList.remove('hidden');
    }

    return {hide, show};

})();

const createReceipt = function(productList, applyDiscount) {

    const productNames = []

    productList.forEach(element => {
        productNames.push(products[element].name);
    });
    
    const subtotal = productList.reduce((accumulator, current) => accumulator + products[current].price, 0);

    let discount = 0;
    if( !!applyDiscount && subtotal >= 200000) discount = 20;
    else if( !!applyDiscount && subtotal >= 100000) discount = 10;
    else if ( !!applyDiscount && subtotal >= 50000) discount = 5;

    return {
        productNames,
        productIndexes : productList,
        subtotal,
        discount,
        total: (discount > 0 ? subtotal - (subtotal * discount / 100) : subtotal) 
    }
}

const organizeReceipt = function() {
    const currentReceipt = receipts[receipts.length - 1]

    document.querySelector("#receipt-number").innerText = receipts.length - 1;

    const container = document.querySelector(".prices-container");
    container.innerHTML = "";

    for(let i = 0; i < currentReceipt.productNames.length; i++) {
        const row = document.createElement('div');
        row.classList.add('receipt-row');

        const nameSpan = document.createElement('span');
        nameSpan.classList.add('product-name');
        nameSpan.innerText = currentReceipt.productNames[i];

        const priceSpan = document.createElement('span');
        priceSpan.classList.add('product-price');
        priceSpan.innerText = `$${products[currentReceipt.productIndexes[i]].price}`;

        row.appendChild(nameSpan);
        row.appendChild(priceSpan);
        container.appendChild(row);

    }

    const leaveButton = document.createElement('button');
    leaveButton.setAttribute('id', "leave");
    leaveButton.innerText = "Confirmar";
    leaveButton.addEventListener('click',() => {
        displayMode.show(document.querySelector(".shop-container"))
        displayMode.hide(document.querySelector(".receipt-container"))
    })

    const subtotal = document.createElement('div');
    subtotal.classList.add('receipt-row2');
    subtotal.innerHTML = `<strong>Subtotal: </strong> $${currentReceipt.subtotal}`

    const discount = document.createElement('div');
    discount.classList.add('receipt-row2');
    discount.innerHTML = `<strong>Descuento: </strong> ${currentReceipt.discount}%`

    const total = document.createElement('div');
    total.classList.add('receipt-row2');
    total.innerHTML = `<strong>Total: </strong> $${currentReceipt.total}`

    container.appendChild(subtotal);
    if ( currentReceipt.discount > 0 )container.appendChild(discount);
    container.appendChild(total);
    container.appendChild(leaveButton);

}


const products = [
    {
        name: "Computador",
        price: 800000,
    },
    {
        name: "Celular",
        price: 500000,
    },
    {
        name: "Repuestos",
        price: 20000,
    }
]

const receipts = []

const buyButton = document.getElementById('buy').addEventListener('click', () => {
    const checkedProducts = document.querySelectorAll('input[type="checkbox"]:checked');

    if(checkedProducts.length < 1) return alert("No ha elegido nada...");

    const checkedIndexes = Array.from(checkedProducts).map((product) => product.value);
    receipts.push(createReceipt(checkedIndexes, true));
    organizeReceipt();

    displayMode.hide(document.querySelector(".shop-container"))
    displayMode.show(document.querySelector(".receipt-container"))
    
    console.log(receipts[receipts.length - 1])
})

const displayProducts = function () {
    const productsDOM = document.querySelector('.shop-products');
    productsDOM.innerHTML = "";
    for(let i = 0; i < products.length; i++){
        const productRow = document.createElement('div');
        productRow.classList.add('shop-row')

        const checkboxInput = document.createElement('input');
        checkboxInput.setAttribute("id", `product-${i}`);
        checkboxInput.setAttribute("type", "checkbox");
        checkboxInput.setAttribute("value", i);

        const productName = document.createElement('label');
        productName.setAttribute("for", `product-${i}`)
        productName.innerText = products[i].name;

        const productPrice = document.createElement('span');
        productPrice.setAttribute("class", 'price')
        productPrice.innerText = `$${products[i].price}`;

        productRow.appendChild(checkboxInput);
        productRow.appendChild(productName);
        productRow.appendChild(productPrice);
        productsDOM.appendChild(productRow);
    }    
}

const addButton = document.getElementById('add').addEventListener('click', () => {
    const pName = prompt("Nombre del producto: ");
    if(!pName || Number(pName)) return alert("Nombre de producto no valido...");
    const pPrice = Number(prompt("Precio del producto: "));
    if(isNaN(pPrice) || pPrice < 1) return alert("Precio de producto no valido...");


    createProduct(pName, pPrice);
    alert("Producto creado");
});

const createProduct = function(name, price) {
    products.push({
        name, 
        price,
    })

    displayProducts();

}

displayProducts();