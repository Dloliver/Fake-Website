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

// Auth UI DOM Elements
const signUpButton = document.querySelector("#signUpButton");
const loginButton = document.querySelector("#loginButton");
const logoutButton = document.querySelector("#logoutButton");
const userStatus = document.querySelector("#userStatus");

// Global Auth State
let currentUser = undefined; // Set to "guest-user-123" when logged in, or undefined when logged out

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

// Map cart items with custom brand and compliance structure for ecommerce items schema
function getCartItemsForDataLayer() {
  return cart.map((item) => ({
    item_brand: "DemoBrand",
    item_category: item.category,
    item_id: item.id,
    item_name: item.name,
    price: item.price,
    quantity: item.quantity || 1
  }));
}

// Core helper to push dataLayer events and correctly set reset/clear objects
function pushDataLayerEvent(payload, resetKey) {
  window.dataLayer = window.dataLayer || [];
  if (resetKey) {
    window.dataLayer.push({ [resetKey]: undefined });
  }
  window.dataLayer.push(payload);
  if (resetKey) {
    window.dataLayer.push({ [resetKey]: null });
  }
}

// Data Layer Event Triggers

function triggerPageView() {
  pushDataLayerEvent({
    "event": "page_view",
    "event_name": "page_view",
    "event_type": "page",
    "event_data": {
      "detailed_event": "Page View"
    },
    "page_data": {
      "page_language": document.documentElement.lang || "en",
      "page_location": window.location.href,
      "page_name": "Home",
      "page_referrer": document.referrer || undefined,
      "page_section": "Shop",
      "page_sub_section": "Products",
      "page_title": document.title
    },
    "user_data": {
      "user_id": currentUser
    }
  }, "page_data");
}

function triggerViewItemList() {
  pushDataLayerEvent({
    "event": "view_item_list",
    "event_name": "view_item_list",
    "event_type": "ecommerce",
    "event_data": {
      "detailed_event": "View Item List",
      "item_list_id": "main_grid",
      "item_list_name": "Main Product Grid"
    },
    "user_data": {
      "user_id": currentUser
    },
    "ecommerce": {
      "items": products.map((product, index) => ({
        "index": index,
        "item_brand": "DemoBrand",
        "item_category": product.category,
        "item_id": product.id,
        "item_list_id": "main_grid",
        "item_list_name": "Main Product Grid",
        "item_name": product.name,
        "price": product.price,
        "quantity": 1
      }))
    }
  }, "event_data");
}

function triggerSelectItem(product) {
  const index = products.findIndex((p) => p.id === product.id);
  pushDataLayerEvent({
    "event": "select_item",
    "event_name": "select_item",
    "event_type": "ecommerce",
    "event_data": {
      "detailed_event": "Select Item",
      "item_list_id": "main_grid",
      "item_list_name": "Main Product Grid"
    },
    "user_data": {
      "user_id": currentUser
    },
    "ecommerce": {
      "items": [
        {
          "index": index !== -1 ? index : undefined,
          "item_brand": "DemoBrand",
          "item_category": product.category,
          "item_id": product.id,
          "item_name": product.name,
          "price": product.price,
          "quantity": 1
        }
      ]
    }
  }, "event_data");
}

function triggerViewItem(product) {
  pushDataLayerEvent({
    "event": "view_item",
    "event_name": "view_item",
    "event_type": "ecommerce",
    "event_data": {
      "detailed_event": "View Item"
    },
    "user_data": {
      "user_id": currentUser
    },
    "ecommerce": {
      "items": [
        {
          "item_brand": "DemoBrand",
          "item_category": product.category,
          "item_id": product.id,
          "item_name": product.name,
          "price": product.price,
          "quantity": 1
        }
      ]
    }
  }, "event_data");
}

function triggerAddToCart(product) {
  pushDataLayerEvent({
    "event": "add_to_cart",
    "event_name": "add_to_cart",
    "event_type": "ecommerce",
    "event_data": {
      "detailed_event": "Add To Cart",
      "currency": "USD",
      "value": product.price
    },
    "user_data": {
      "user_id": currentUser
    },
    "ecommerce": {
      "items": [
        {
          "coupon": undefined,
          "item_brand": "DemoBrand",
          "item_category": product.category,
          "item_id": product.id,
          "item_name": product.name,
          "price": product.price,
          "quantity": 1
        }
      ]
    }
  }, "event_data");
}

function triggerViewCart() {
  pushDataLayerEvent({
    "event": "view_cart",
    "event_name": "view_cart",
    "event_type": "ecommerce",
    "event_data": {
      "detailed_event": "View Cart",
      "currency": "USD",
      "value": getCartTotal()
    },
    "user_data": {
      "user_id": currentUser
    },
    "ecommerce": {
      "items": getCartItemsForDataLayer()
    }
  }, "event_data");
}

function triggerBeginCheckout() {
  pushDataLayerEvent({
    "event": "begin_checkout",
    "event_name": "begin_checkout",
    "event_type": "ecommerce",
    "event_data": {
      "detailed_event": "Begin Checkout",
      "coupon": undefined,
      "currency": "USD",
      "value": getCartTotal()
    },
    "user_data": {
      "user_id": currentUser
    },
    "ecommerce": {
      "items": getCartItemsForDataLayer()
    }
  }, "ecommerce");
}

function triggerPurchase(orderSummary) {
  pushDataLayerEvent({
    "event": "purchase",
    "event_name": "purchase",
    "event_type": "ecommerce",
    "event_data": {
      "detailed_event": "Purchase",
      "affiliation": "Demo Store",
      "coupon": undefined,
      "currency": "USD",
      "shipping": orderSummary.shipping,
      "tax": orderSummary.tax,
      "transaction_id": orderSummary.transaction_id,
      "value": orderSummary.value
    },
    "user_data": {
      "user_id": currentUser
    },
    "ecommerce": {
      "items": cart.map((item) => ({
        "affiliation": "Demo Store",
        "coupon": undefined,
        "discount": undefined,
        "item_brand": "DemoBrand",
        "item_category": item.category,
        "item_id": item.id,
        "item_name": item.name,
        "item_variant": undefined,
        "price": item.price,
        "quantity": item.quantity || 1
      }))
    }
  }, "ecommerce");
}

function triggerLogin() {
  pushDataLayerEvent({
    "event": "login",
    "event_data": {
      "detailed_event": "Login"
    },
    "user_data": {
      "method": "Email",
      "user_id": currentUser,
      "user_type": "Member"
    }
  }, "event_data");
}

function triggerLogout() {
  pushDataLayerEvent({
    "event": "logout",
    "event_data": {
      "detailed_event": "Logout"
    },
    "user_data": {
      "method": "Email",
      "user_id": "guest-user-123", // Track the ID of the user logging out before clear
      "user_type": "Member"
    }
  }, "event_data");
}

function triggerSignUp() {
  pushDataLayerEvent({
    "event": "sign_up",
    "event_data": {
      "detailed_event": "Sign Up"
    },
    "user_data": {
      "method": "Email",
      "user_id": currentUser,
      "user_type": "Member"
    }
  }, "event_data");
}

// Render logic with dynamic lists

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

  // Trigger view_item_list event once catalog is rendered
  triggerViewItemList();
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
  triggerSelectItem(product);
  triggerViewItem(product);
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
  triggerAddToCart(product);
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

  // Trigger begin_checkout and purchase events back to back
  triggerBeginCheckout();
  triggerPurchase(orderSummary);

  console.log("Fake purchase complete:", orderSummary);
  alert(`Fake purchase complete. Order ID: ${orderId}`);

  cart.length = 0;
  renderCart();
}

// Authentication Interactive Logic

function updateAuthUI() {
  if (currentUser) {
    signUpButton.hidden = true;
    loginButton.hidden = true;
    logoutButton.hidden = false;
    userStatus.textContent = `Logged in as ${currentUser}`;
    userStatus.hidden = false;
  } else {
    signUpButton.hidden = false;
    loginButton.hidden = false;
    logoutButton.hidden = true;
    userStatus.hidden = true;
  }
}

signUpButton.addEventListener("click", () => {
  currentUser = "guest-user-123";
  updateAuthUI();
  triggerSignUp();
  triggerLogin();
});

loginButton.addEventListener("click", () => {
  currentUser = "guest-user-123";
  updateAuthUI();
  triggerLogin();
});

logoutButton.addEventListener("click", () => {
  triggerLogout();
  currentUser = undefined;
  updateAuthUI();
});

// Event Listeners

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
  triggerViewCart();
});

closeCartButton.addEventListener("click", () => {
  cartPanel.hidden = true;
});

checkoutButton.addEventListener("click", completeFakeCheckout);

debugButton.addEventListener("click", () => {
  console.table(window.dataLayer || []);
});

// Initialize on load
renderProducts();
renderCart();
triggerPageView();

// Expose simple helpers for manual testing in DevTools.
window.demoStore = {
  products,
  cart,
  getCartTotal,
  getCartItemsForTesting,
  currentUser
};
