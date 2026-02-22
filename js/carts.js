(function addCartStyles() {
    const style = document.createElement('style');
    let home = document.querySelector(".home");
    home.style.width= "75%"

    style.textContent = `
        /* تنسيقات حصرية لصفحة السلة - بدون line-height */
        .products.cart-page {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 20px;
            padding: 20px 0;
            line-height: 30px;
        }

        .cart-item {
            display: flex;

            align-items: center;
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
            border-radius: 25px;
            padding: 18px 15px 15px;
            box-shadow: 0 12px 28px rgba(219, 112, 147, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.7);
            transition: all 0.25s;
            height: fit-content;
        }

        .cart-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 18px 35px rgba(219, 112, 147, 0.3);
        }

        .cart-item-img {
            width: 150px;
            height: 150px;
            border-radius: 20px;
            object-fit: cover;
            margin: 0 auto 12px;
            border: 3px solid white;
            box-shadow: 0 6px 12px rgba(0,0,0,0.08);
        }

        .cart-item-details {
            text-align: center;
            width: 100%;
        }

        .cart-item-title {
            font-family: 'Cormorant Garamond', serif;
            font-size: 1.6rem;
            font-weight: 700;
            color: #5e3a5e;

            letter-spacing: 0.3px;
        }

        .cart-item-category {
            font-size: 0.8rem;
            color: #b2814a;
            background: rgba(255, 200, 220, 0.5);
            display: inline-block;
            padding: 0px 14px;
            border-radius: 40px;
            margin: 10px 0 ;

            text-transform: uppercase;
            font-weight: 500;
        }

        .cart-item-price {
            font-size: 1.2rem;
            font-weight: 600;
            color: #db7093;
  
        }

        .item-total {
            display: block;
            font-size: 1.1rem;
            font-weight: 700;
            color: #c71585;
            background: rgba(255, 230, 240, 0.7);
            padding: 0px 12px;
            border-radius: 40px;

            border: 1px solid rgba(255, 255, 255, 0.5);
        }

        .cart-item-controls {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 12px;

        }

        .quantity-control {
            display: flex;
            align-items: center;
            gap: 12px;
            background: rgba(255, 240, 245, 0.6);
            padding: 0px 16px;
            border-radius: 50px;
            width: fit-content;

        }

        .quantity-btn {
            background: #ff69b4;
            border: none;
            color: white;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            cursor: pointer;
            font-weight: bold;
            font-size: 1.2rem;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s;
            box-shadow: 0 4px 8px rgba(255,105,180,0.3);
        }

        .quantity-btn:hover {
            background: #ff1493;
            transform: scale(1.05);
        }

        .quantity-number {
            min-width: 30px;
            text-align: center;
            font-weight: 700;
            color: #5e3a5e;
            font-size: 1.2rem;
        }

        .remove-btn {
            background: #dc3545;
            border: none;
            color: white;
            font-family: 'Montserrat', sans-serif;
            font-weight: 600;
            font-size: 0.85rem;
            padding: 10px 22px;
            border-radius: 40px;
            cursor: pointer;
            transition: background 0.3s;
            box-shadow: 0 6px 14px rgba(220,53,69,0.25);
            width: 100%;
            max-width: 160px;
            letter-spacing: 0.4px;
        }

        .remove-btn:hover {
            background: #c82333;
        }

        .total-cart {
      
            grid-column: 1 / -1;
            text-align: center;
            margin-top: 20px;
            padding: 15px 25px;
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(8px);
            border-radius: 60px;
            font-weight: bold;
            color: #8a4b8a;
            font-size: 1.6rem;
            border: 1px solid rgba(255, 255, 255, 0.6);
        }
    `;
    document.head.appendChild(style);
})();


let allProductsCart = document.querySelector(".products");
if (allProductsCart) {
    allProductsCart.classList.add('cart-page');
}
let favContainer = document.getElementById("fav-products");
if (favContainer) {
    favContainer.classList.add('cart-page');
}

let badge = document.querySelector(".badge");


let cart = localStorage.getItem("ProductsInCart") ? JSON.parse(localStorage.getItem("ProductsInCart")) : [];
let favorites = localStorage.getItem("FavoritesInCart") ? JSON.parse(localStorage.getItem("FavoritesInCart")) : [];

function updateBadge() {
    let totalQuantity = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
    if (badge) {
        if (totalQuantity > 0) {
            badge.style.display = "flex";
            badge.innerHTML = totalQuantity;
        } else {
            badge.style.display = "none";
        }
    }
}

function saveCart() {
    localStorage.setItem("ProductsInCart", JSON.stringify(cart));
    updateBadge();
}

window.removeFromCart = function (id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    drawCartProducts();
};

function drawCartProducts() {
    if (!allProductsCart) return;
    if (cart.length === 0) {
        allProductsCart.innerHTML = "<p style='text-align:center; color:#8a4b8a; font-size:1.5rem; margin:50px 0;'></p>";
        return;
    }

    let html = '';
    let totalCart = 0;

    cart.forEach(item => {
        let priceNum = parseFloat(item.Price.replace('$', ''));
        let qty = item.quantity || 1;
        let itemTotal = priceNum * qty;
        totalCart += itemTotal;

        html += `
            <div class="cart-item" data-id="${item.id}">
                <img class="cart-item-img" src="${item.imageUrl}" alt="${item.title}">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-category">category: ${item.Category}</div>
                    <div class="cart-item-controls">
                        <div class="quantity-control">
                            <button class="quantity-btn decrease" data-id="${item.id}">−</button>
                            <span class="quantity-number">${qty}</span>
                            <button class="quantity-btn increase" data-id="${item.id}">+</button>
                        </div>
                        <span class="item-total">Price: ${itemTotal.toFixed(2)}$</span>
                        <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
                    </div>
                </div>
            </div>
        `;
    });

    html += `<div class="total-cart">Total Price: ${totalCart.toFixed(2)}$</div>`;
    allProductsCart.innerHTML = html;
}

allProductsCart.addEventListener('click', (e) => {
    let target = e.target;
    if (target.classList.contains('increase') || target.classList.contains('decrease')) {
        let id = Number(target.dataset.id);
        let delta = target.classList.contains('increase') ? 1 : -1;
        let item = cart.find(item => item.id === id);
        if (item) {
            let newQty = (item.quantity || 1) + delta;
            if (newQty <= 0) {
                cart = cart.filter(item => item.id !== id);
            } else {
                item.quantity = newQty;
            }
            saveCart();
            drawCartProducts();
        }
        e.stopPropagation();
    }
});

function saveFavorites() {
    localStorage.setItem("FavoritesInCart", JSON.stringify(favorites));
}

window.removeFromFav = function (id) {
    favorites = favorites.filter(item => item.id !== id);
    saveFavorites();
    drawFavProducts();
};

function drawFavProducts() {
    if (!favContainer) return;
    if (favorites.length === 0) {
        favContainer.innerHTML = "<p style='text-align:center; color:#8a4b8a; font-size:1.5rem; margin:50px 0;'></p>";
        return;
    }

    let html = favorites.map(item => {
        return `
            <div class="cart-item" data-id="${item.id}"> <!-- نستخدم نفس كلاس cart-item -->
                <img class="cart-item-img" src="${item.imageUrl}" alt="${item.title}">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-category">category: ${item.Category}</div>
                    <div class="cart-item-controls">
                        <i class="far fa-heart fav " onclick="removeFromFav(${item.id})"></i>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    favContainer.innerHTML = html;
}

drawCartProducts();
drawFavProducts();
updateBadge();


