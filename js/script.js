
let userInfo = document.querySelector("#user_info")
let userD = document.querySelector("#user")
let links = document.querySelector("#links")

if (localStorage.getItem("username")) {
    links.remove()
    userInfo.style.display = "flex"
    userD.innerHTML = localStorage.getItem("username")

}

let logOutBtn = document.querySelector("#logout")
logOutBtn.addEventListener("click", function () {
    localStorage.clear();
    setTimeout(() => {
        window.location = "login.html";
    }, 1500)
})


let allProducts = document.querySelector(".products");

let products = [
    { id: 1, title: "Chanel No 5", Price: "120$", Category: "Florall", imageUrl: "Image/1.jpeg" },
    { id: 2, title: "Dior Sauvage", Price: "95$", Category: "Woody", imageUrl: "Image/2.jpeg" },
    { id: 3, title: "Gucci Bloom", Price: "110$", Category: "Floral", imageUrl: "Image/3.jpeg" },
    { id: 4, title: "YSL Libre", Price: "130$", Category: "Oriental", imageUrl: "Image/8.jpeg" },

    { id: 5, title: "Creed Aventus", Price: "350$", Category: "Fruity", imageUrl: "Image/7.jpeg" },
    { id: 6, title: "Le Labo Santal 33", Price: "220$", Category: "Woody", imageUrl: "Image/12.png" },
    { id: 7, title: "Jo Malone Peony &amp; Blush Suede", Price: "150$", Category: "Floral", imageUrl: "./Image/13.webp" },
    { id: 8, title: "Byredo Gypsy Water", Price: "200$", Category: "Woody", imageUrl: "Image/20.jpg" },
    { id: 9, title: "Maison Margiela Jazz Club", Price: "140$", Category: "Warm Spicy", imageUrl: "Image/17.jpg" },
    
];

let favorites = localStorage.getItem("FavoritesInCart") ? JSON.parse(localStorage.getItem("FavoritesInCart")) : [];

let addedItem = localStorage.getItem("ProductsInCart") ? JSON.parse(localStorage.getItem("ProductsInCart")) : [];

let currentProducts = [...products];

let searchInput = document.querySelector('.main-select input[type="search"]');
let searchButton = document.querySelector('.main-select input[type="button"]');
let searchType = document.getElementById('main-selectproduct');

function drawItems(itemsToDraw) {
    currentProducts = itemsToDraw;

    favorites = JSON.parse(localStorage.getItem("FavoritesInCart")) || [];
    addedItem = JSON.parse(localStorage.getItem("ProductsInCart")) || [];

    let y = currentProducts.map((item) => {
        let isFav = favorites.some(fav => fav.id === item.id);
        let heartClass = isFav ? "fas fa-heart fav-active" : "far fa-heart fav";

        let isInCart = addedItem.some(cartItem => cartItem.id === item.id);
        let buttonText = isInCart ? "Remove from Cart" : "Add To Cart";
       
        let buttonClass = isInCart ? "add_to_cart remove-btn" : "add_to_cart";

        return `
            <div class="product_item">
                <img class="product_item_img" src="${item.imageUrl}">
                <div class="product_item_desc">
                    <h2>${item.title}</h2>
                    <p>Price: ${item.Price}</p>
                    <span>Category: ${item.Category}</span> 
                </div>
                <div class="product_item_action">
                    <button class="${buttonClass}" onClick="toggleCart(${item.id})">${buttonText}</button>
                    <i class="${heartClass}" onClick="toggleFav(${item.id})" id="fav-${item.id}"></i>
                </div>
            </div>
        `;
    }).join('');

    if (y === '') {
        allProducts.innerHTML = '<p style="text-align:center; color:#8a4b8a; font-size:1.5rem; margin:50px;">No products found</p>';
    } else {
        allProducts.innerHTML = y;
    }
}

drawItems(products);

function performSearch() {
    let keyword = searchInput.value.trim().toLowerCase();
    let type = searchType.value;

    if (keyword === '') {
        drawItems(products);
    } else {
        let filtered;
        if (type.includes('name')) {
            filtered = products.filter(product =>
                product.title.toLowerCase().includes(keyword)
            );
        } else if (type.includes('category')) {
            filtered = products.filter(product =>
                product.Category.toLowerCase().includes(keyword)
            );
        } else {
            filtered = products.filter(product =>
                product.title.toLowerCase().includes(keyword)
            );
        }
        drawItems(filtered);
    }
}

if (searchButton) searchButton.addEventListener('click', performSearch);
if (searchInput) {
    searchInput.addEventListener('keypress', (e) => e.key === 'Enter' && performSearch());
    searchInput.addEventListener('input', performSearch); 
}

let cartProductDiv = document.querySelector(".carts_products div");
let badge = document.querySelector(".badge");
let shoppingCartIcon = document.querySelector(".shopping_cart");
let cartsProducts = document.querySelector(".carts_products");

function saveCart() {
    localStorage.setItem("ProductsInCart", JSON.stringify(addedItem));
    updateBadge();
}

function updateBadge() {
    let totalQuantity = addedItem.reduce((acc, item) => acc + (item.quantity || 1), 0);
    if (badge) {
        if (totalQuantity > 0) {
            badge.style.display = "flex";
            badge.innerHTML = totalQuantity;
        } else {
            badge.style.display = "none";
        }
    }
}

function renderCart() {
    if (addedItem.length === 0) {
        cartProductDiv.innerHTML = "<p style='padding:10px; text-align:center; color:#8a4b8a;'>Your cart is empty</p>";
        updateBadge();
        return;
    }
    let itemsHtml = '';
    let totalCart = 0;
    addedItem.forEach(item => {
        let priceNum = parseFloat(item.Price.replace('$', ''));
        let qty = item.quantity || 1;
        let itemTotal = priceNum * qty;
        totalCart += itemTotal;
        itemsHtml += `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-header">
                    <span class="cart-item-title">${item.title}</span>
                    <span class="cart-item-price"> price uint : ${priceNum}$</span>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-wrapper">
                        <button class="quantity-btn decrease" data-id="${item.id}">−</button>
                        <span class="quantity-number">${qty}</span>
                        <button class="quantity-btn increase" data-id="${item.id}">+</button>
                    </div>
                    <span class="item-total">Total: ${itemTotal.toFixed(2)}$</span>
                </div>
            </div>
        `;
    });
    itemsHtml += `<div class="cart-total">Total Price: ${totalCart.toFixed(2)}$</div>`;
    cartProductDiv.innerHTML = itemsHtml;
}


cartProductDiv.addEventListener('click', (e) => {
    let target = e.target;
    if (target.classList.contains('increase') || target.classList.contains('decrease')) {
        let id = Number(target.dataset.id);
        let delta = target.classList.contains('increase') ? 1 : -1;
        let item = addedItem.find(item => item.id === id);
        if (item) {
            let newQty = (item.quantity || 1) + delta;
            if (newQty <= 0) {
                addedItem = addedItem.filter(item => item.id !== id);
            } else {
                item.quantity = newQty;
            }
            saveCart();
            renderCart();
            drawItems(currentProducts);  
        }
        e.stopPropagation();
    }
});

window.toggleCart = function (id) {
    if (!localStorage.getItem("username")) {
        window.location = "login.html";
        return;
    }
    let product = products.find(item => item.id === id);
    if (!product) return;

    let existingIndex = addedItem.findIndex(item => item.id === id);

    if (existingIndex !== -1) {
        addedItem.splice(existingIndex, 1);
    } else {
        addedItem.push({ ...product, quantity: 1 });
    }
    saveCart();
    renderCart();        
    drawItems(currentProducts); 
};

function saveFavorites() {
    localStorage.setItem("FavoritesInCart", JSON.stringify(favorites));
}

window.toggleFav = function (id) {
    if (!localStorage.getItem("username")) {
        window.location = "login.html";
        return;
    }
    let product = products.find(item => item.id === id);
    if (!product) return;

    let existingIndex = favorites.findIndex(item => item.id === id);
    if (existingIndex !== -1) {
        favorites.splice(existingIndex, 1);
    } else {
        favorites.push({ ...product });
    }
    saveFavorites();
    drawItems(currentProducts);
};

shoppingCartIcon.addEventListener("click", (e) => {
    e.stopPropagation();
    if (cartsProducts.style.display === "block") {
        cartsProducts.style.display = "none";
    } else {
        cartsProducts.style.display = "block";
        renderCart();
    }
});

document.addEventListener("click", (e) => {
    if (!shoppingCartIcon.contains(e.target) && !cartsProducts.contains(e.target)) {
        cartsProducts.style.display = "none";
    }
});







