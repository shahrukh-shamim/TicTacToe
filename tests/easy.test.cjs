const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
function worker(random = 0, forbidSearch = false) {
    let reply;
    const context = vm.createContext({
        self: { postMessage(value) { reply = value === null ? null : JSON.parse(JSON.stringify(value)); } },
        Math: Object.assign(Object.create(Math), { random: () => random })
    });
    context.importScripts = file => vm.runInContext(readFileSync(path.join(root, file), 'utf8'), context);
    vm.runInContext(readFileSync(path.join(root, 'easy.js'), 'utf8'), context);
    if (forbidSearch) context.Max = () => assert.fail('an empty-board opening must skip minimax');
    return board => {
        reply = undefined;
        context.self.onmessage({ data: board });
        assert.notEqual(reply, undefined, 'worker must respond');
        return reply;
    };
}

// Independent flat-board reference solver; no production helpers are reused.
const lines = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
function outcome(board) {
    for (const [a, b, c] of lines) {
        if (board[a] && board[a] === board[b] && board[b] === board[c]) return board[a] === 2 ? 1 : -1;
    }
    return board.includes(0) ? undefined : 0;
}
function moves(board, turn) {
    return board.flatMap((cell, index) => {
        if (cell) return [];
        const next = board.slice();
        next[index] = turn;
        return [next];
    });
}
const scores = new Map();
function score(board, turn) {
    const result = outcome(board);
    if (result !== undefined) return result;
    const key = board.join('') + turn;
    if (!scores.has(key)) {
        const values = moves(board, turn).map(next => score(next, 3 - turn));
        scores.set(key, turn === 2 ? Math.max(...values) : Math.min(...values));
    }
    return scores.get(key);
}
const matrix = board => [board.slice(0, 3), board.slice(3, 6), board.slice(6, 9)];

test('random computer openings can select all nine cells without searching minimax', () => {
    for (let cell = 0; cell < 9; cell++) {
        const reply = worker((cell + 0.5) / 9, true)(matrix(Array(9).fill(0))).flat();
        assert.equal(reply[cell], 2);
        assert.equal(reply.filter(value => value === 2).length, 1);
    }
});

test('every reachable non-opening computer turn chooses the lowest minimax score', () => {
    const play = worker();
    const visited = new Set();
    const counts = { '-1': 0, '0': 0, '1': 0 };
    function visit(board, turn) {
        const key = board.join('') + turn;
        if (visited.has(key)) return;
        visited.add(key);
        if (outcome(board) !== undefined) {
            assert.equal(play(matrix(board)), null);
            return;
        }
        const options = moves(board, turn);
        if (turn === 2 && options.length < 9) {
            const input = matrix(board);
            const original = JSON.stringify(input);
            const reply = play(input).flat();
            assert.equal(JSON.stringify(input), original, 'search must not mutate the current board');
            assert(options.some(next => next.every((cell, i) => cell === reply[i])), 'reply must be one legal computer move');
            const expected = Math.min(...options.map(next => score(next, 1)));
            assert.equal(score(reply, 1), expected, `wrong choice for ${board.join('')}`);
            counts[expected]++;
        }
        for (const next of options) visit(next, 3 - turn);
    }
    visit(Array(9).fill(0), 1);
    visit(Array(9).fill(0), 2);
    for (const count of Object.values(counts)) assert(count > 0, 'cover losing, drawing, and forced-win fallback positions');
});
