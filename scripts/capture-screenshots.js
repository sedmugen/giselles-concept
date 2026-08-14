const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function captureAll() {
  const outDir = path.join(__dirname, '..', 'assets', 'images', 'screenshots');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const browser = await chromium.launch({ channel: 'msedge', headless: true });

  // 1. Desktop Context
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2
  });

  const indexUrl = 'file:///' + path.resolve(__dirname, '../index.html').replace(/\\/g, '/');
  const productUrl = 'file:///' + path.resolve(__dirname, '../product.html').replace(/\\/g, '/');

  // 1A. Storefront Hero View
  console.log('Capturing Storefront Hero...');
  const page1 = await desktopContext.newPage();
  await page1.goto(indexUrl);
  await page1.waitForTimeout(500);
  await page1.screenshot({ path: path.join(outDir, 'storefront-hero.png') });
  await page1.screenshot({ path: path.join(outDir, 'storefront-full.png'), fullPage: true });

  // 1B. Storefront Ingredients Section
  console.log('Capturing Ingredients Ledger...');
  const item2 = await page1.$('.ingredient-item[data-index="1"]');
  if (item2) {
    await item2.click();
    await page1.waitForTimeout(400);
  }
  const ingredientsSection = await page1.$('#ingredients');
  if (ingredientsSection) {
    await ingredientsSection.scrollIntoViewIfNeeded();
    await page1.waitForTimeout(400);
    await page1.screenshot({ path: path.join(outDir, 'storefront-ingredients.png') });
  }

  // 2. Product Detail Page
  console.log('Capturing Product Detail Page...');
  const page2 = await desktopContext.newPage();
  await page2.goto(productUrl);
  await page2.waitForTimeout(500);
  await page2.screenshot({ path: path.join(outDir, 'product-detail.png') });
  await page2.screenshot({ path: path.join(outDir, 'product-full.png'), fullPage: true });

  // 3. Cart Drawer Overlay
  console.log('Capturing Cart Drawer with active items...');
  await page2.click('#btnAddToBag');
  await page2.waitForTimeout(1600);
  await page2.screenshot({ path: path.join(outDir, 'cart-drawer.png') });

  // 4. Product Lightbox Modal
  console.log('Capturing Product Lightbox Modal...');
  const page3 = await desktopContext.newPage();
  await page3.goto(productUrl);
  await page3.waitForTimeout(500);
  await page3.click('.product-gallery-item:first-child');
  await page3.waitForTimeout(600);
  await page3.screenshot({ path: path.join(outDir, 'product-lightbox.png') });

  // 5. Mobile Responsive Viewports
  console.log('Capturing Mobile Viewports...');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true
  });
  const mobilePage1 = await mobileContext.newPage();
  await mobilePage1.goto(indexUrl);
  await mobilePage1.waitForTimeout(500);
  await mobilePage1.screenshot({ path: path.join(outDir, 'mobile-storefront.png') });

  const mobilePage2 = await mobileContext.newPage();
  await mobilePage2.goto(productUrl);
  await mobilePage2.waitForTimeout(500);
  await mobilePage2.screenshot({ path: path.join(outDir, 'mobile-product.png') });

  await browser.close();
  console.log('All real application screenshots successfully updated!');
}

captureAll().catch(err => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
