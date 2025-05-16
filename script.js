document.addEventListener('DOMContentLoaded', function() {
    // Загрузка товаров
    const savedProducts = localStorage.getItem('products');
    let products = [];

    if(savedProducts) {
        products = JSON.parse(savedProducts).sort((a, b) => a.id - b.id);
    } else {
        products = [
            { id: 1, autor: 'Иллюзион', name: 'JavaScript для начинающих', price: 1200, image: './img/Мураками-Токийские легенды.webp'},
            { id: 2, autor: 'Иллюзион', name: 'LearnReact для начинающих', price: 1900, image: './img/Мураками-Токийские легенды.webp'},
            { id: 3, autor: 'Иллюзион', name: 'Java для начинающих', price: 1500, image: './img/Мураками-Токийские легенды.webp'},
            { id: 5, autor: 'Иллюзион', name: 'ГеймДизайн', price: 1700, image: './img/Мураками-Токийские легенды.webp'},
            { id: 4, autor: 'Иллюзион', name: 'Ландшафт', price: 1100, image: './img/Мураками-Токийские легенды.webp'},
            { id: 6, autor: 'Иллюзион', name: 'Линдивальд', price: 1800, image: './img/Мураками-Токийские легенды.webp'}
        ].sort((a, b) => a.id - b.id);
        localStorage.setItem('products', JSON.stringify(products));
    }

    // Загрузка корзины
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    displayProducts(products);
    updateCartDisplay(cart);

    // Обработчик добавления в корзину
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.card');
            const productId = parseInt(card.dataset.id);
            addToCart(productId, products, cart);
        });
    });
});

function addToCart(productId, products, cart) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay(cart);
}

function updateCartDisplay(cart) {
    const cartContainer = document.getElementById('cart-items');
    const totalElement = document.getElementById('total');

    if (!cartContainer || !totalElement) return;

    cartContainer.innerHTML = '';
    let totalPrice = 0;

    cart.forEach(item => {
        totalPrice += item.price * item.quantity;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" width="50">
            <div>
                <h4>${item.name}</h4>
                <p>${item.price} руб × ${item.quantity} = ${item.price * item.quantity} руб</p>
            </div>
            <div class="cart-actions">
                <button class="decrease-btn" data-id="${item.id}">-</button>
                <button class="remove-btn" data-id="${item.id}">Удалить</button>
            </div>
        `;

        cartContainer.appendChild(cartItem);
    });

    totalElement.textContent = totalPrice;

    // Обработчики для кнопок в корзине
    document.querySelectorAll('.decrease-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            decreaseQuantity(id, cart);
        });
    });

    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            removeFromCart(id, cart);
        });
    });
}

function decreaseQuantity(productId, cart) {
    const itemIndex = cart.findIndex(item => item.id === productId);

    if (itemIndex !== -1) {
        if (cart[itemIndex].quantity > 1) {
            cart[itemIndex].quantity -= 1;
        } else {
            cart.splice(itemIndex, 1);
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay(cart);
    }
}

function removeFromCart(productId, cart) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay(cart);
}

function displayProducts(products) {
    const container = document.querySelector('.cards');
    container.innerHTML = '';

    products.forEach(product => {
        const productHTML = `
        <div class='card' data-id='${product.id}'>
            <img class='cardImgBook' src='${product.image}' alt='${product.name}'>
            <div class='containerInfoCard'>
                <p class='author'>${product.autor}</p>
                <p class='nameBook'>${product.name}</p>
            </div>
            <div class='containerPrice'>
                <p class='price'>${product.price} руб</p>
            </div>
            <button class='btn'>В корзину</button>
        </div>
        `;
        container.insertAdjacentHTML('beforeend', productHTML);
    });
}
