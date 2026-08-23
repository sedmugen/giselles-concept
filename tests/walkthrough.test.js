/**
 * Giselle's Concept - End-to-End Walkthrough & Recording Mode Browser Test
 * Simulates complete user walkthrough across index.html and product.html using Playwright.
 */

const { chromium } = require('playwright');
const path = require('path');
const assert = require('assert');

async function runWalkthrough() {
  console.log('--- Starting Showcase Recording Mode Browser E2E Walkthrough ---');
  
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  const indexUrl = 'file:///' + path.resolve(__dirname, '../index.html').replace(/\\/g, '/');
  const productUrl = 'file:///' + path.resolve(__dirname, '../product.html').replace(/\\/g, '/');

  // ==========================================
  // Part 1: Homepage (index.html) Walkthrough
  // ==========================================
  console.log('\n[1] Testing index.html Showcase Walkthrough...');
  const page = await context.newPage();
  await page.goto(indexUrl);
  await page.waitForTimeout(500);

  // Check 1: Recording Mode ON by default & HUD present
  const initialState = await page.evaluate(() => GisellesApp.recorder.getState());
  assert.strictEqual(initialState.isRecordingMode, true, 'Recording mode must be ON by default');
  assert.strictEqual(initialState.isHudVisible, false, 'HUD must be hidden by default');
  console.log('✔ Initial state verified: Recording Mode ON, HUD hidden');

  // Check 2: Toggle HUD ON with 'H'
  await page.keyboard.press('h');
  await page.waitForTimeout(200);
  const hudVisibleState = await page.evaluate(() => GisellesApp.recorder.getState().isHudVisible);
  assert.strictEqual(hudVisibleState, true, 'HUD should become visible on pressing H');
  const hudClass = await page.$eval('#recordingHud', el => el.className);
  assert(hudClass.includes('active'), 'HUD element must have .active class');
  console.log('✔ HUD toggle with H verified (visible and active)');

  // Check 3: Walk down through all 8 sections with ArrowDown
  const totalSections = initialState.sectionsCount;
  console.log(`Step-navigating forward through all ${totalSections} sections...`);
  
  for (let s = 1; s < totalSections; s++) {
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(750); // wait for smooth scroll & unlock
    const currentIdx = await page.evaluate(() => GisellesApp.recorder.getState().activeSectionIndex);
    const hudTitle = await page.$eval('#hudTitle', el => el.textContent);
    console.log(`  -> Section ${currentIdx + 1}/${totalSections}: "${hudTitle}"`);
    assert.strictEqual(currentIdx, s, `Must navigate to section index ${s}`);
  }
  console.log('✔ Full forward walkthrough to Footer completed');

  // Check 4: Test horizontal sub-step navigation on Ingredients (#ingredients is section index 4)
  console.log('Testing horizontal step cycling on Ingredients section...');
  await page.evaluate(() => GisellesApp.recorder.scrollToSection(4));
  await page.waitForTimeout(700);
  
  // Right arrow -> should activate ingredient item 1 (Sprouted Almonds)
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(200);
  let activeIngredient = await page.$eval('.ingredients-list .ingredient-item.active .ingredient-name', el => el.textContent.trim());
  assert.strictEqual(activeIngredient, 'Sprouted Almonds', 'Sprouted almonds should be active');
  console.log(`  -> Active ingredient sub-step: "${activeIngredient}"`);

  // Right arrow again -> item 2 (Coconut Blossom Nectar)
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(200);
  activeIngredient = await page.$eval('.ingredients-list .ingredient-item.active .ingredient-name', el => el.textContent.trim());
  assert.strictEqual(activeIngredient, 'Coconut Blossom Nectar');
  console.log(`  -> Active ingredient sub-step: "${activeIngredient}"`);

  // Check 5: Test horizontal step cycling on Reviews section (#reviews is section index 5)
  console.log('Testing horizontal step cycling on Reviews section...');
  await page.evaluate(() => GisellesApp.recorder.scrollToSection(5));
  await page.waitForTimeout(700);
  
  const beforeSlideId = await page.$eval('.review-slide.active', el => el.id);
  const beforeIdx = parseInt(beforeSlideId.replace('slide-', ''), 10);
  const expectedNextId = `slide-${(beforeIdx + 1) % 3}`;
  
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(200);
  let activeSlideId = await page.$eval('.review-slide.active', el => el.id);
  assert.strictEqual(activeSlideId, expectedNextId, `Slide ${expectedNextId} should be active`);
  console.log(`  -> Active review slide transitioned: "${beforeSlideId}" -> "${activeSlideId}"`);

  // Check 6: Walk back up to Hero with ArrowUp
  console.log('Step-navigating backward to Hero section...');
  for (let s = 4; s >= 0; s--) {
    await page.keyboard.press('ArrowUp');
    await page.waitForTimeout(750);
    const currentIdx = await page.evaluate(() => GisellesApp.recorder.getState().activeSectionIndex);
    assert.strictEqual(currentIdx, s, `Must navigate back to section index ${s}`);
  }
  console.log('✔ Full reverse walkthrough back to Hero completed');

  // Check 7: Toggle Recording Mode OFF and then back ON with 'R'
  console.log('Testing Recording Mode toggle with R...');
  await page.keyboard.press('r');
  await page.waitForTimeout(200);
  let recState = await page.evaluate(() => GisellesApp.recorder.getState().isRecordingMode);
  assert.strictEqual(recState, false, 'Recording Mode should be toggled OFF');
  let badgeClass = await page.$eval('#hudBadge', el => el.className);
  assert(badgeClass.includes('is-off'), 'Badge should show standby when OFF');
  console.log('✔ Recording Mode toggled OFF and status reflected in HUD');

  await page.keyboard.press('r');
  await page.waitForTimeout(200);
  recState = await page.evaluate(() => GisellesApp.recorder.getState().isRecordingMode);
  assert.strictEqual(recState, true, 'Recording Mode should be toggled back ON');
  badgeClass = await page.$eval('#hudBadge', el => el.className);
  assert(badgeClass.includes('is-rec'), 'Badge should show REC when ON');
  console.log('✔ Recording Mode toggled back ON with R');

  // ==========================================
  // Part 2: Product Page Walkthrough
  // ==========================================
  console.log('\n[2] Testing product.html Showcase Walkthrough...');
  const productPage = await context.newPage();
  await productPage.goto(productUrl + '?hud=1&record=1'); // URL overrides
  await productPage.waitForTimeout(500);

  const prodState = await productPage.evaluate(() => GisellesApp.recorder.getState());
  assert.strictEqual(prodState.isHudVisible, true, 'HUD should be active via ?hud=1 URL override');
  assert.strictEqual(prodState.isRecordingMode, true, 'Recording Mode should be active via ?record=1');
  console.log(`✔ Product page loaded with ${prodState.sectionsCount} sections detected`);

  // Step through product page sections
  for (let s = 1; s < prodState.sectionsCount; s++) {
    await productPage.keyboard.press('ArrowDown');
    await productPage.waitForTimeout(750);
    const currentIdx = await productPage.evaluate(() => GisellesApp.recorder.getState().activeSectionIndex);
    const hudTitle = await productPage.$eval('#hudTitle', el => el.textContent);
    console.log(`  -> Product Section ${currentIdx + 1}/${prodState.sectionsCount}: "${hudTitle}"`);
    assert.strictEqual(currentIdx, s, `Product section index should equal ${s}`);
  }
  console.log('✔ Product page full walkthrough verified');

  await browser.close();
  console.log('\n--- All Browser E2E Walkthrough Tests Passed Successfully! ---');
}

runWalkthrough().catch(err => {
  console.error('Walkthrough Test Failed:', err);
  process.exit(1);
});
