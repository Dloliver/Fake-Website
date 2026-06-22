# Demo Shop — GitHub Pages Manual Data Layer Test Site

A simple static fake storefront for testing GitHub Pages deployments and manually-added data layer events.

This version does **not** push any `window.dataLayer` events by default. It gives you clean storefront interactions so you or a coworker can add custom data layer events manually.

## Files

- `index.html` — Storefront markup. Includes a commented area near the top where you can add manual data layer or tag manager code.
- `styles.css` — Basic responsive styling.
- `script.js` — Product, cart, and fake checkout behavior. No automatic data layer pushes.

## Manual data layer example

You can add this near the top of `index.html` if you want to start testing manually:

```html
<script>
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "page_view",
    page_type: "storefront_home",
    page_title: document.title,
    page_path: window.location.pathname
  });
</script>
```

You can also add events inside `script.js`, for example inside `addToCart(product)`:

```js
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: "add_to_cart",
  ecommerce: {
    currency: "USD",
    value: product.price,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        item_category: product.category,
        price: product.price,
        quantity: 1
      }
    ]
  }
});
```

## Helpful DevTools commands

```js
window.dataLayer
```

```js
window.demoStore.cart
```

```js
window.demoStore.getCartItemsForTesting()
```

## Deploy to GitHub Pages

1. Create a new GitHub repository.
2. Upload these files to the repo root.
3. Go to **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and `/root` folder.
6. Save.
7. Open the GitHub Pages URL after the deployment completes.
