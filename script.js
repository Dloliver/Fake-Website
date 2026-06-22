const products = [
  {
    id: "sku-demo-hoodie",
    name: "Demo Hoodie",
    category: "Apparel",
    price: 48,
    emoji: "🧥",
    description: "A cozy fake hoodie for storefront testing."
  },
  {
    id: "sku-test-mug",
    name: "Test Mug",
    category: "Home",
    price: 16,
    emoji: "☕",
    description: "A pretend mug that helps you test product clicks."
  },
  {
    id: "sku-sample-pack",
    name: "Sample Pack",
    category: "Bundle",
    price: 29,
    emoji: "📦",
    description: "A simple bundle item for cart and checkout tests."
  }
];

const cart = [];
const productGrid = document.querySelector("#productGrid");
const cartCount = document.querySelector("#cartCount");
const cartPanel = document.querySelector("#cartPanel");
const cartItems = document.querySelector("#cartItems");
const cartTotal = document.querySelector("#cartTotal");
const viewCartButton = document.querySelector("#viewCartButton");
const closeCartButton = document.querySelector("#closeCartButton");
const checkoutButton = document.querySelector("#checkoutButton");
const debugButton = document.querySelector("#debugButton");

function money(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(value);
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function getCartItemsForTesting() {
  return cart.map((item) => ({
    item_id: item.id,
    item_name: item.name,
    item_category: item.category,
    price: item.price,
    quantity: item.quantity || 1
  }));
}

function renderProducts() {
  productGrid.innerHTML = products
    .map(
      (product) => `
        <article class="product-card" data-product-id="${product.id}">
          <div class="product-image" aria-hidden="true">${product.emoji}</div>
          <div class="product-content">
            <p class="eyebrow">${product.category}</p>
            <h2>${product.name}</h2>
            <p>${product.description}</p>
            <div class="product-meta">
              <span class="price">${money(product.price)}</span>
              <span class="category">${product.id}</span>
            </div>
            <div class="card-actions">
              <button type="button" data-action="view" data-product-id="${product.id}" class="secondary-button">View Item</button>
              <button type="button" data-action="add" data-product-id="${product.id}">Add to Cart</button>
            </div>
          </div>
        </article>
      `
    )
    .join("");
}

function renderCart() {
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalQuantity;
  cartTotal.textContent = money(getCartTotal());

  if (!cart.length) {
    cartItems.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  cartItems.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-line" data-product-id="${item.id}">
          <div>
            <strong>${item.name}</strong><br />
            <span>${item.quantity} × ${money(item.price)}</span>
          </div>
          <strong>${money(item.price * item.quantity)}</strong>
        </div>
      `
    )
    .join("");
}

function viewProduct(product) {
  console.log("Viewed product:", product);
}

function addToCart(product) {
  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  renderCart();
  console.log("Added to cart:", product);
}

function completeFakeCheckout() {
  if (!cart.length) {
    alert("Add an item before completing the fake checkout.");
    return;
  }

  const orderId = `TEST-${Date.now()}`;
  const orderSummary = {
    transaction_id: orderId,
    currency: "USD",
    value: getCartTotal(),
    tax: 0,
    shipping: 0,
    items: getCartItemsForTesting()
  };

  console.log("Fake purchase complete:", orderSummary);
  alert(`Fake purchase complete. Order ID: ${orderId}`);

  cart.length = 0;
  renderCart();
}

productGrid.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-product-id]");
  if (!button) return;

  const product = products.find((item) => item.id === button.dataset.productId);
  if (!product) return;

  if (button.dataset.action === "view") {
    viewProduct(product);
  }

  if (button.dataset.action === "add") {
    addToCart(product);
  }
});

viewCartButton.addEventListener("click", () => {
  cartPanel.hidden = false;
  console.log("Viewed cart:", {
    currency: "USD",
    value: getCartTotal(),
    items: getCartItemsForTesting()
  });
});

closeCartButton.addEventListener("click", () => {
  cartPanel.hidden = true;
});

checkoutButton.addEventListener("click", completeFakeCheckout);

debugButton.addEventListener("click", () => {
  console.table(window.dataLayer || []);
});

renderProducts();
renderCart();

// Expose simple helpers for manual testing in DevTools.
window.demoStore = {
  products,
  cart,
  getCartTotal,
  getCartItemsForTesting
};
