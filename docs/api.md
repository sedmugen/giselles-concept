# Client Component & State API Reference

This document describes the client-side module contracts, data schemas, and event actions for **Giselle's Concept**.

---

## 1. Product Registry Schema

The `PRODUCT_REGISTRY` constant in `script.js` defines the catalog schema:

```javascript
/**
 * @typedef {Object} ProductItem
 * @property {number} id - Unique numeric product identifier
 * @property {string} name - Official product display name
 * @property {number} price - Base unit price (in PKR cents/units)
 * @property {number} [subscriptionPrice] - Optional discounted recurring price
 * @property {string} img - Relative path to product image asset
 * @property {string} description - Brief culinary and ingredient summary
 */
```

### Current Registry Entries
| ID | Product Name | Base Price | Sub. Price | Asset Path |
| :--- | :--- | :--- | :--- | :--- |
| `1` | Vanilla Rose Cake | Rs. 25,000 | N/A | `assets/images/products/vanilla-rose-cake.png` |
| `2` | Tahini Cacao Cookie | Rs. 10,500 | N/A | `assets/images/products/tahini-cacao-cookie.png` |
| `3` | Almond Fudge Brownie | Rs. 14,000 | N/A | `assets/images/products/almond-fudge-brownie.png` |
| `4` | Peanut Butter Bar Dozen | Rs. 28,100 | Rs. 23,885 | `assets/images/products/protein-bar-peanut-butter.png` |
| `5` | Matcha Coconut Bar Dozen | Rs. 28,100 | N/A | `assets/images/products/protein-bar-matcha.png` |

---

## 2. Cart Item Schema (`localStorage`)

Stored in `localStorage` under key `giselles_cart`:

```json
[
  {
    "id": "4-subscription",
    "productId": 4,
    "name": "PROTEIN BARS - CHOCOLATE PEANUT BUTTER - DOZEN (Monthly Subscription)",
    "price": 23885,
    "img": "assets/images/products/protein-bar-peanut-butter.png",
    "quantity": 1
  }
]
```

---

## 3. UI Action Contract (`data-action`)

Elements declare user actions via `data-action` attributes:

| Action Identifier | Additional Attributes | Expected Behavior |
| :--- | :--- | :--- |
| `quick-add` | `data-product-id="<id>"` | Appends 1 unit of product to bag and opens drawer |
| `add-main-product` | N/A | Reads selected quantity & subscription radio state, runs button animation, adds to bag |
| `open-cart` | N/A | Opens sliding cart drawer and applies background scrim |
| `close-cart` | N/A | Closes sliding cart drawer and restores body scroll |
| `remove-from-cart` | `data-item-id="<id>"` | Removes item from cart and re-calculates subtotal |
| `preview-notice` | `data-feature="<Name>"` | Triggers luxury toast notification for preview features |
| `checkout-notice` | N/A | Verifies cart contents and launches checkout toast |

---

## 4. Toast Notification API

```javascript
/**
 * Triggers a non-blocking floating toast notification
 * @param {string} title - Headline text
 * @param {string} message - Informative body text
 * @param {('gold'|'info'|'success')} [type='gold'] - Visual accent variant
 */
GisellesApp.showToast(title, message, type);
```
