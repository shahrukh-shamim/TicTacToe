const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const vm = require('node:vm');

function load(starter = '1', symbol = 'x') {
    const elements = new Map();
    const timers = [];
    function element(id) {
        if (!elements.has(id)) elements.set(id, {
            id, dataset: { occupied: 'false' }, style: {},
            x2: { baseVal: { value: 150 } }, y2: { baseVal: { value: 150 } },
            addEventListener(type, handler) { this[type] = handler; }
        });
        return elements.get(id);
    }
    const rects = Array.from({ length: 9 }, (_, i) => element('rect' + (i + 1)));
    const context = vm.createContext({
        document: {
            cookie: 'marks=' + (symbol === 'x' ? '01' : '10'),
            getElementById: element,
            getElementsByClassName: name => name === 'rects' ? rects : [element('a' + name), element('b' + name)]
        },
        window: { location: { search: '?mode=two-player' } },
        Preferences: { get: () => ({ twoPlayerFirst: starter }), beginGame() { assert.fail('local mode must not consume single-player alternation'); } },
        Localization: { ready: Promise.resolve(), t: key => key },
        Worker() { assert.fail('local mode must not create an AI worker'); },
        ready: true,
        setTimeout(callback) { timers.push(callback); },
        endGame(outcome) { context.outcome = outcome; context.game = false; }
    });
    vm.runInContext(readFileSync(path.join(__dirname, '../src/js/game.js'), 'utf8'), context);
    return {
        context, element,
        click(cell) { rects[cell - 1].click(); },
        flush() { while (timers.length) timers.shift()(); }
    };
}

test('local turns reject rapid taps and occupied cells, and stop at a Player 1 win', () => {
    const game = load();
    game.click(1);
    game.click(2);
    assert.deepEqual(Array.from(game.context.board[0]), [1, 0, 0]);
    game.flush();
    game.click(1);
    assert.equal(game.context.currentPlayer, 2);
    for (const cell of [4, 2, 5, 3]) { game.click(cell); game.flush(); }
    assert.equal(game.context.outcome, 'playerOneWin');
    game.click(9);
    assert.equal(game.context.board[2][2], 0);
});

test('Player 2 can start, gets the opposite saved mark, and wins', () => {
    const game = load('2', 'o');
    for (const cell of [1, 4, 2, 5, 3]) { game.click(cell); game.flush(); }
    assert.equal(game.context.outcome, 'playerTwoWin');
    assert.equal(game.element('a1').style.strokeWidth, '10');
    assert.equal(game.element('c4').style.strokeWidth, '10');
});

test('a full local board ends in a draw', () => {
    const game = load();
    for (const cell of [1, 2, 3, 5, 4, 6, 8, 7, 9]) { game.click(cell); game.flush(); }
    assert.equal(game.context.outcome, 'draw');
});

test('replay preserves local mode and Play opens single player from the menu', () => {
    for (const search of ['?mode=two-player', '']) {
        const context = vm.createContext({ window: { location: { search } }, document: { getElementById: () => null } });
        vm.runInContext(readFileSync(path.join(__dirname, '../src/js/menu.js'), 'utf8'), context);
        context.startGame();
        assert.equal(context.window.location.href, 'game.html' + search);
    }
});

test('resigning awards the round to the other local player', () => {
    for (const currentPlayer of [1, 2]) {
        const elements = new Map();
        const element = id => {
            if (!elements.has(id)) elements.set(id, { addEventListener(type, handler) { this[type] = handler; }, close() {}, showModal() {} });
            return elements.get(id);
        };
        let outcome;
        const context = vm.createContext({
            document: { getElementById: element }, game: true, twoPlayer: true, currentPlayer,
            endGame(value) { outcome = value; }
        });
        vm.runInContext(readFileSync(path.join(__dirname, '../src/js/resign.js'), 'utf8'), context);
        element('confirm-resign').click();
        assert.equal(outcome, currentPlayer === 1 ? 'playerTwoWin' : 'playerOneWin');
    }
});
