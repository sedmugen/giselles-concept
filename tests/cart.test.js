/**
 * Giselle's Concept - Cart & Business Logic Smoke Tests
 * Validates product registry integrity, cart computations, and discount rules.
 */

const assert = require('assert');

// 1. Mock Product Catalog Registry
const PRODUCT_REGISTRY = {
  1: { id: 1, name: 'Vanilla Rose Cake', price: 25000 },
  2: { id: 2, name: 'Tahini Cacao Cookie', price: 10500 },
  3: { id: 3, name: 'Almond Fudge Brownie', price: 14000 },
  4: { id: 4, name: 'PROTEIN BARS - CHOCOLATE PEANUT BUTTER - DOZEN', price: 28100, subscriptionPrice: 23885 },
  5: { id: 5, name: 'Matcha Coconut Bar - Dozen', price: 28100 }
};

// 2. Pure Cart Functions for Testing
function createCart() {
  let items = [];

  return {
    getItems: () => [...items],
    addItem: (productId, quantity = 1, isSubscription = false) => {
      const product = PRODUCT_REGISTRY[productId];
      if (!product) throw new Error(`Product ${productId} not found`);

      let id = String(productId);
      let price = product.price;

      if (isSubscription && product.subscriptionPrice) {
        id = `${productId}-subscription`;
        price = product.subscriptionPrice;
      }

      const existing = items.find(i => i.id === id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        items.push({ id, productId, name: product.name, price, quantity });
      }
    },
    removeItem: (id) => {
      items = items.filter(i => i.id !== id);
    },
    getSubtotal: () => {
      return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },
    getItemCount: () => {
      return items.reduce((sum, item) => sum + item.quantity, 0);
    }
  };
}

// 3. Test Suite Execution
console.log('--- Running Giselle\'s Concept Logic Tests ---');

// Test 1: Product Registry Integrity
console.log('Test 1: Validating Product Registry...');
assert.strictEqual(Object.keys(PRODUCT_REGISTRY).length, 5, 'Registry must contain 5 signature products');
assert.strictEqual(PRODUCT_REGISTRY[4].subscriptionPrice, 23885, 'Peanut Butter Bar must offer 15% subscription discount');
console.log('✔ Product Registry verified');

// Test 2: Standard Cart Item Addition & Subtotal
console.log('Test 2: Testing Cart Addition & Subtotal...');
const cart = createCart();
cart.addItem(1, 2); // 2x Vanilla Rose Cake @ 25,000 = 50,000
cart.addItem(2, 1); // 1x Tahini Cacao Cookie @ 10,500 = 10,500

assert.strictEqual(cart.getItemCount(), 3, 'Cart should have 3 items total');
assert.strictEqual(cart.getSubtotal(), 60500, 'Subtotal should equal Rs. 60,500');
console.log('✔ Cart additions and subtotal calculation verified');

// Test 3: Subscription Discount Application
console.log('Test 3: Testing Subscription Pricing...');
const subCart = createCart();
subCart.addItem(4, 1, true); // 1x Subscription Peanut Butter Bar @ 23,885

assert.strictEqual(subCart.getSubtotal(), 23885, 'Subscription price must be applied');
assert.strictEqual(subCart.getItems()[0].id, '4-subscription', 'Item ID should flag subscription');
console.log('✔ Subscription pricing verified');

// Test 4: Item Removal
console.log('Test 4: Testing Item Removal...');
cart.removeItem('2');
assert.strictEqual(cart.getItemCount(), 2, 'Item count should decrease after removal');
assert.strictEqual(cart.getSubtotal(), 50000, 'Subtotal should update after removal');
console.log('✔ Item removal verified');

console.log('--- All 4 Test Suites Passed Successfully ---');
