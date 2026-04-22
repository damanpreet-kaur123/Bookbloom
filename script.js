function toggleMenu() {
    document.getElementById("navLinks").classList.toggle("active");
}

document.querySelectorAll("#navLinks a").forEach(link => {
    link.addEventListener("click", () => {
        document.getElementById("navLinks").classList.remove("active");
    });
});


document.addEventListener("click", function(event) {
    const nav = document.getElementById("navLinks");
    const toggle = document.querySelector(".menu-toggle");

    if (!nav.contains(event.target) && !toggle.contains(event.target)) {
        nav.classList.remove("active");
    }
});

const user = JSON.parse(localStorage.getItem("loggedInUser"));

if (!user) {
    window.location.href = "login.html";
}


const cartKey = "cart_" + user.email;


let cart = JSON.parse(localStorage.getItem(cartKey)) || [];


function saveCart() {
    localStorage.setItem(cartKey, JSON.stringify(cart));
}


function addToCart(name, price, image) {

    let existing = cart.find(item => item.name === name);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            name,
            price,
            image,
            quantity: 1
        });
    }

    saveCart();
    updateCartCount();
    alert("Added to cart!");
}


function updateCartCount() {
    let count = 0;

    cart.forEach(item => {
        count += item.quantity;
    });

    let el = document.getElementById("cart-count");
    if (el) el.innerText = count;
}


function displayCart() {

    let cartItems = document.getElementById("cart-items");
    let totalEl = document.getElementById("cart-total");

    if (!cartItems) return;

    cartItems.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
        cartItems.innerHTML = `
        <tr>
            <td colspan="6">Your cart is empty</td>
        </tr>`;
        if (totalEl) totalEl.innerText = 0;
        return;
    }

    cart.forEach((item, index) => {

        let itemTotal = item.price * item.quantity;
        total += itemTotal;

        cartItems.innerHTML += `
        <tr>
            <td><img src="${item.image}" width="60"></td>
            <td>${item.name}</td>
            <td>₹${item.price}</td>
            <td>
                <button onclick="changeQty(${index}, -1)">➖</button>
                ${item.quantity}
                <button onclick="changeQty(${index}, 1)">➕</button>
            </td>
            <td>₹${itemTotal}</td>
            <td><button onclick="removeItem(${index})">X</button></td>
        </tr>
        `;
    });

    if (totalEl) totalEl.innerText = total;
}


function changeQty(index, change) {

    cart[index].quantity += change;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    saveCart();
    displayCart();
    updateCartCount();
}


function removeItem(index) {
    cart.splice(index, 1);
    saveCart();
    displayCart();
    updateCartCount();
}


function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "login.html";
}


document.addEventListener("DOMContentLoaded", function () {
    updateCartCount();
    displayCart();

    let userName = document.getElementById("userName");
    if (userName) {
        userName.innerText = "👤 " + user.username;
    }
});


function showPayment(){

    let selected = document.querySelector('input[name="payment"]:checked');

    let upi = document.getElementById("upi-section");
    let card = document.getElementById("card-section");

    if(!selected) return;

    // hide both first
    if(upi) upi.style.display = "none";
    if(card) card.style.display = "none";

    if(selected.value === "upi"){
        upi.style.display = "block";
    }

    if(selected.value === "card"){
        card.style.display = "block";
    }
}


function placeOrder(){

    const user = JSON.parse(localStorage.getItem("loggedInUser"));

    if(!user){
        alert("Please login first");
        window.location.href = "login.html";
        return;
    }

    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let phone = document.getElementById("phone").value;
    let address = document.getElementById("address").value;

    let paymentEl = document.querySelector('input[name="payment"]:checked');

    
    if(!name || !email || !phone || !address){
        alert("Fill all details");
        return;
    }

    if(email !== user.email){
        alert("Email must match login email");
        return;
    }

    if(!paymentEl){
        alert("Select payment method");
        return;
    }

    let payment = paymentEl.value;

    
    if(payment === "upi"){
        let txn = document.getElementById("upi-txn").value;
        if(!txn){
            alert("Enter UPI transaction ID");
            return;
        }
        alert("UPI Payment Successful");
    }

    if(payment === "card"){
        let card = document.getElementById("card-number").value;
        let cvv = document.getElementById("cvv").value;

        if(!card || !cvv){
            alert("Enter card details");
            return;
        }
        alert("Card Payment Successful");
    }

    if(payment === "cod"){
        alert("Order placed with Cash on Delivery");
    }

    
    let cartKey = "cart_" + user.email;
    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

    let order = {
        name,
        email,
        phone,
        address,
        payment,
        items: cart,
        date: new Date().toLocaleString()
    };

    localStorage.setItem("orderData", JSON.stringify(order));

    
    localStorage.removeItem(cartKey);

    alert("Order placed successfully!");

    window.location.href = "orders.html";
}
