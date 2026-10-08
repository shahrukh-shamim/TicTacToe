const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { test } = require('node:test');
const vm = require('node:vm');
const path = require('node:path');

test('each named sound starts at zero and plays only its first 800 ms', async () => {
    const fetched = [];
    const starts = [];
    const context = vm.createContext({
        Preferences: { get: () => ({ vfx: '1' }) },
        window: { AudioContext: class {
            constructor() { this.state = 'running'; }
            decodeAudioData() { return Promise.resolve({ duration: 3 }); }
            createBufferSource() {
                return { connect() {}, disconnect() {}, start(...args) { starts.push(args); } };
            }
        } },
        document: { addEventListener() {} },
        fetch(url) { fetched.push(url); return Promise.resolve({ ok: true, arrayBuffer: async () => new ArrayBuffer(0) }); }
    });
    vm.runInContext(readFileSync(path.join(__dirname, '../src/js/sounds.js'), 'utf8'), context);
    for (const name of ['circle', 'cross', 'line']) context.GameSounds.play(name);
    await new Promise(resolve => setImmediate(resolve));
    assert.deepEqual(fetched, ['assets/circle.wav', 'assets/cross.wav', 'assets/line.wav']);
    assert.deepEqual(starts, [[0, 0, 0.8], [0, 0, 0.8], [0, 0, 0.8]]);
});

test('mute suppresses every sound, including sounds still loading', async () => {
    let vfx = '0';
    let starts = 0;
    const context = vm.createContext({
        Preferences: { get: () => ({ vfx }) },
        window: { AudioContext: class {
            constructor() { this.state = 'running'; }
            decodeAudioData() { return Promise.resolve({ duration: 3 }); }
            createBufferSource() {
                return { connect() {}, disconnect() {}, start() { starts++; } };
            }
        } },
        document: { addEventListener() {} },
        fetch() { return Promise.resolve({ ok: true, arrayBuffer: async () => new ArrayBuffer(0) }); }
    });
    vm.runInContext(readFileSync(path.join(__dirname, '../src/js/sounds.js'), 'utf8'), context);
    for (const name of ['circle', 'cross', 'line']) context.GameSounds.play(name);
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(starts, 0);
    vfx = '1';
    context.GameSounds.play('circle');
    vfx = '0';
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(starts, 0);
    vfx = '1';
    context.GameSounds.play('cross');
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(starts, 1);
});
