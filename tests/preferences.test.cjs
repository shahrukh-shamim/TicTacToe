const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const vm = require('node:vm');
const source = readFileSync(path.join(__dirname, '..', 'src', 'js', 'preferences.js'), 'utf8');
function load(store = new Map(), unavailable = false, deviceLanguage) {
    const context = vm.createContext({
        document: { cookie: 'user=false', documentElement: { style: { setProperty() {} } } },
        navigator: deviceLanguage ? { languages: [deviceLanguage], language: deviceLanguage } : undefined,
        localStorage: {
            getItem(key) { if (unavailable) throw Error('storage disabled'); return store.get(key) || null; },
            setItem(key, value) { if (unavailable) throw Error('storage disabled'); store.set(key, value); }
        }
    });
    vm.runInContext(source, context);
    return context.Preferences;
}
test('fixed starters come from settings even with an old starter cookie', () => {
    const store = new Map();
    const prefs = load(store);
    assert.equal(prefs.beginGame(), true);
    for (const [setting, expected] of [['computer', false], ['you', true]]) {
        assert.equal(prefs.update('firstTurn', setting), true);
        for (let game = 0; game < 3; game++) assert.equal(load(store).beginGame(), expected);
    }
});
test('alternate persists across games and menu/settings visits do not consume a turn', () => {
    const store = new Map();
    assert.equal(load(store).update('firstTurn', 'alternate'), true);
    for (const expected of [true, false, true, false, true]) {
        load(store).get(); // Visiting the menu/settings leaves the next starter alone.
        const prefs = load(store);
        assert.equal(prefs.get().firstTurn, 'alternate');
        assert.equal(prefs.beginGame(), expected);
    }
});
test('selecting alternate again after a fixed starter resets to player first', () => {
    const prefs = load();
    prefs.update('firstTurn', 'alternate');
    assert.equal(prefs.beginGame(), true);
    prefs.update('firstTurn', 'computer');
    prefs.update('firstTurn', 'alternate');
    assert.equal(prefs.beginGame(), true);
    assert.equal(prefs.beginGame(), false);
});
test('storage failures still allow play and in-memory alternation', () => {
    const prefs = load(new Map(), true);
    assert.equal(prefs.beginGame(), true);
    prefs.update('firstTurn', 'alternate');
    assert.equal(prefs.beginGame(), true);
    assert.equal(prefs.beginGame(), false);
});
test('language preference accepts supported locales and persists across visits', () => {
    const store = new Map();
    const prefs = load(store);
    assert.equal(prefs.update('language', 'fa'), true);
    assert.equal(load(store).get().language, 'fa');
    assert.equal(prefs.update('language', 'xx'), false);
    assert.equal(load(store).get().language, 'fa');
});
test('first visit follows a supported device language and falls back to English', () => {
    assert.equal(load(new Map(), false, 'fa-IR').get().language, 'fa');
    assert.equal(load(new Map(), false, 'it-IT').get().language, 'en');
});
test('Play and replay navigate directly without creating a chooser', () => {
    const handlers = {};
    const context = vm.createContext({
        window: { location: { href: '' } },
        document: { getElementById(id) { return { addEventListener(event, handler) { handlers[id] = handler; } }; } }
    });
    vm.runInContext(readFileSync(path.join(__dirname, '..', 'src', 'js', 'menu.js'), 'utf8'), context);
    handlers.play();
    assert.equal(context.window.location.href, 'game.html');
    let closed = false;
    context.document.getElementById = id => id === 'game-result'
        ? { addEventListener() {}, close() { closed = true; } }
        : { addEventListener(event, handler) { handlers[id] = handler; } };
    vm.runInContext(readFileSync(path.join(__dirname, '..', 'src', 'js', 'result.js'), 'utf8'), context);
    context.window.location.href = '';
    handlers['play-again']();
    assert.equal(closed, true);
    assert.equal(context.window.location.href, 'game.html');
});

test('local starter persists independently of single-player alternation', () => {
    const store = new Map();
    const prefs = load(store);
    assert.equal(prefs.get().twoPlayerFirst, '1');
    assert.equal(prefs.update('twoPlayerFirst', '2'), true);
    assert.equal(load(store).get().twoPlayerFirst, '2');
    assert.equal(prefs.update('twoPlayerFirst', 'computer'), false);
    prefs.update('firstTurn', 'alternate');
    assert.equal(prefs.beginGame(), true);
    prefs.update('twoPlayerFirst', '1');
    assert.equal(load(store).beginGame(), false);
});
