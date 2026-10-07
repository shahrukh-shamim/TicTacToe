const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const vm = require('node:vm');
const source = readFileSync(path.join(__dirname, '..', 'preferences.js'), 'utf8');
function load(store = new Map(), unavailable = false) {
    const context = vm.createContext({
        document: { cookie: 'user=false', documentElement: { style: { setProperty() {} } } },
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
test('Play and replay navigate directly without creating a chooser', () => {
    const handlers = {};
    const context = vm.createContext({
        window: { location: { href: '' } },
        document: { getElementById(id) { return { addEventListener(event, handler) { handlers[id] = handler; } }; } }
    });
    vm.runInContext(readFileSync(path.join(__dirname, '..', 'menu.js'), 'utf8'), context);
    handlers.play();
    assert.equal(context.window.location.href, 'game.html');
    let closed = false;
    context.document.getElementById = id => id === 'game-result'
        ? { addEventListener() {}, close() { closed = true; } }
        : { addEventListener(event, handler) { handlers[id] = handler; } };
    vm.runInContext(readFileSync(path.join(__dirname, '..', 'result.js'), 'utf8'), context);
    context.window.location.href = '';
    handlers['play-again']();
    assert.equal(closed, true);
    assert.equal(context.window.location.href, 'game.html');
});
