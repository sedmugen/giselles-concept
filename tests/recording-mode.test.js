/**
 * Giselle's Concept - Showcase Recording Mode Unit Tests
 * Validates recording mode defaults, persistence, URL overrides, and section indexing.
 */

const assert = require('assert');

// Mock Browser Environment for Unit Testing
class MockLocalStorage {
  constructor() {
    this.store = {};
  }
  getItem(key) {
    return Object.prototype.hasOwnProperty.call(this.store, key) ? this.store[key] : null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
  clear() {
    this.store = {};
  }
}

global.localStorage = new MockLocalStorage();
global.window = {
  location: { search: '' },
  scrollY: 0,
  innerHeight: 900,
  scrollTo: () => {},
  addEventListener: () => {}
};
global.document = {
  body: {
    classList: { contains: (cls) => cls === 'home-page' },
    appendChild: () => {}
  },
  documentElement: { scrollHeight: 3000 },
  getElementById: () => null,
  querySelector: () => ({ getBoundingClientRect: () => ({ top: 100 }), querySelectorAll: () => [] }),
  querySelectorAll: () => [],
  addEventListener: () => {},
  activeElement: null
};

const { ShowcaseRecorder } = require('../script.js');

console.log('--- Running Showcase Recording Mode Logic Tests ---');

// Test 1: Default State (ON by default, HUD OFF)
console.log('Test 1: Validating Default Mode & HUD States...');
global.localStorage.clear();
global.window.location.search = '';
ShowcaseRecorder.loadState();
let state = ShowcaseRecorder.getState();
assert.strictEqual(state.isRecordingMode, true, 'Recording Mode must be ON by default');
assert.strictEqual(state.isHudVisible, false, 'Recording HUD must be OFF by default');
console.log('✔ Defaults verified (Recording: ON, HUD: OFF)');

// Test 2: Persistence in localStorage
console.log('Test 2: Testing localStorage Persistence...');
ShowcaseRecorder.toggleRecordingMode(); // Toggles to false
assert.strictEqual(global.localStorage.getItem('giselles_recording_mode'), 'false');
ShowcaseRecorder.loadState();
assert.strictEqual(ShowcaseRecorder.getState().isRecordingMode, false, 'Persisted OFF state must be loaded');

ShowcaseRecorder.toggleRecordingMode(); // Toggles back to true
assert.strictEqual(global.localStorage.getItem('giselles_recording_mode'), 'true');
ShowcaseRecorder.loadState();
assert.strictEqual(ShowcaseRecorder.getState().isRecordingMode, true, 'Persisted ON state must be loaded');

ShowcaseRecorder.toggleHud(); // Toggles HUD to true
assert.strictEqual(global.localStorage.getItem('giselles_recording_hud'), 'true');
ShowcaseRecorder.loadState();
assert.strictEqual(ShowcaseRecorder.getState().isHudVisible, true, 'Persisted HUD ON state must be loaded');
console.log('✔ LocalStorage persistence verified');

// Test 3: URL Parameter Overrides (without modifying saved storage)
console.log('Test 3: Testing URL Parameter Overrides...');
global.localStorage.setItem('giselles_recording_mode', 'true');
global.localStorage.setItem('giselles_recording_hud', 'false');

// URL ?record=0 -> should override mode to false
global.window.location.search = '?record=0';
ShowcaseRecorder.loadState();
assert.strictEqual(ShowcaseRecorder.getState().isRecordingMode, false, '?record=0 must force mode OFF');
assert.strictEqual(global.localStorage.getItem('giselles_recording_mode'), 'true', 'URL override must not alter localStorage');

// URL ?record=1 -> should override mode to true
global.window.location.search = '?record=1';
ShowcaseRecorder.loadState();
assert.strictEqual(ShowcaseRecorder.getState().isRecordingMode, true, '?record=1 must force mode ON');

// URL ?hud=1 -> should override HUD to true
global.window.location.search = '?hud=1';
ShowcaseRecorder.loadState();
assert.strictEqual(ShowcaseRecorder.getState().isHudVisible, true, '?hud=1 must force HUD ON');

// URL ?hud=0 -> should override HUD to false
global.localStorage.setItem('giselles_recording_hud', 'true');
global.window.location.search = '?hud=0';
ShowcaseRecorder.loadState();
assert.strictEqual(ShowcaseRecorder.getState().isHudVisible, false, '?hud=0 must force HUD OFF');
console.log('✔ URL parameter overrides verified');

// Test 4: Section Scanning
console.log('Test 4: Testing Dynamic Section Scanning...');
ShowcaseRecorder.scanSections();
assert(Array.isArray(ShowcaseRecorder.getSections()), 'Sections must be an array');
console.log('✔ Section scan structure verified');

console.log('--- All Showcase Recording Mode Tests Passed Successfully ---');
