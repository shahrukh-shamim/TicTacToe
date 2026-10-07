const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
function worker(random = 0) {
    let reply;
    const context = vm.createContext({
        self: { postMessage(value) { reply = JSON.parse(JSON.stringify(value)); } },
        Math: Object.assign(Object.create(Math), { random: () => random })
    });
    context.importScripts = file => vm.runInContext(readFileSync(path.join(root, file), 'utf8'), context);
    vm.runInContext(readFileSync(path.join(root, 'normal.js'), 'utf8'), context);
    return { context, play(board) { context.self.onmessage({ data: board }); return reply; } };
}
const board = [[0, 0, 0], [0, 2, 1], [1, 2, 1]];
// Independent solver to check the worker's real minimax choices.
const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
function score(cells, turn) {
    for (const [a,b,c] of lines) {
        if (cells[a] && cells[a] === cells[b] && cells[b] === cells[c]) return cells[a] === 2 ? 1 : -1;
    }
    const options = cells.flatMap((cell, index) => {
        if (cell) return [];
        const next = cells.slice(); next[index] = turn;
        return [score(next, 3 - turn)];
    });
    return options.length ? (turn === 2 ? Math.max(...options) : Math.min(...options)) : 0;
}
test('normal selects the requested score for eight turns, using real minimax', () => {
    const { play } = worker();
    const options = board.flat().flatMap((cell, index) => {
        if (cell) return [];
        const next = board.flat(); next[index] = 2;
        return [score(next, 1)];
    });
    assert.deepEqual([...new Set(options)].sort(), [-1, 0, 1]);
    for (const expected of [1,1,0,-1,1,1,0,-1]) {
        const before = JSON.stringify(board);
        const reply = play(board).flat();
        assert.equal(score(reply, 1), expected);
        assert.equal(JSON.stringify(board), before);
        assert.equal(reply.filter((cell, index) => cell !== board.flat()[index]).length, 1);
    }
});
test('fallback chooses the nearest score, preferring a win over a loss on ties', () => {
    for (const available of [[-1,0], [0,1], [-1,1], [-1], [0], [1]]) {
        const { context, play } = worker();
        // Controlled score availability isolates the fallback policy.
        let next = 0;
        context.Max = () => available[next++ % available.length];
        for (const target of [1,1,0,-1]) {
            next = 0;
            const reply = play(board).flat();
            const chosen = reply.findIndex((cell, index) => cell !== board.flat()[index]);
            const choiceIndex = [0,1,2,3].indexOf(chosen);
            const expected = available.slice().sort((a,b) => Math.abs(a-target)-Math.abs(b-target) || b-a)[0];
            assert.equal(available[choiceIndex % available.length], expected);
        }
    }
});
test('random opening skips search, counts as turn one, and new workers reset', () => {
    for (let cell = 0; cell < 9; cell++) {
        const { context, play } = worker((cell + 0.5) / 9);
        context.Max = () => assert.fail('opening must skip minimax');
        assert.equal(play([[0,0,0],[0,0,0],[0,0,0]]).flat()[cell], 2);
        assert.equal(context.moveCounter, 1);
    }
    assert.equal(worker().context.moveCounter, 0);
});
test('terminal positions return null without advancing the cycle', () => {
    const { context, play } = worker();
    for (const terminal of [
        [[1,1,1],[2,2,0],[0,0,0]],
        [[2,2,2],[1,1,0],[0,0,0]],
        [[1,2,1],[1,2,2],[2,1,1]]
    ]) assert.equal(play(terminal), null);
    assert.equal(context.moveCounter, 0);
});
