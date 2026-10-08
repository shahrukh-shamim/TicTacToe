const assert = require('node:assert/strict');
const { readFileSync, readdirSync } = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const localeDir = path.join(root, 'locales');
const localeFiles = readdirSync(localeDir).filter(file => file.endsWith('.json'));
const locales = Object.fromEntries(localeFiles.map(file => [
    path.basename(file, '.json'),
    JSON.parse(readFileSync(path.join(localeDir, file), 'utf8'))
]));

function paths(object, prefix = '') {
    return Object.entries(object).flatMap(([key, value]) => {
        const current = prefix ? prefix + '.' + key : key;
        return value && typeof value === 'object' ? paths(value, current) : [current];
    }).sort();
}

function get(object, key) {
    return key.split('.').reduce((value, part) => value && value[part], object);
}

test('all locale files provide the same non-empty translation keys', () => {
    const englishKeys = paths(locales.en);
    for (const [code, locale] of Object.entries(locales)) {
        assert.deepEqual(paths(locale), englishKeys, code + ' locale key structure');
        for (const key of englishKeys) {
            assert.equal(typeof get(locale, key), 'string', code + ': ' + key);
            assert.ok(get(locale, key).trim(), code + ': empty ' + key);
        }
    }
});

test('all UI translation attributes resolve in every locale', () => {
    const pageFiles = ['index.html', 'settings.html', 'about.html', 'game.html'];
    const keys = new Set();
    for (const file of pageFiles) {
        const html = readFileSync(path.join(root, file), 'utf8');
        for (const match of html.matchAll(/data-i18n(?:-aria-label)?="([^"]+)"/g)) keys.add(match[1]);
    }
    for (const [code, locale] of Object.entries(locales)) {
        for (const key of keys) assert.equal(typeof get(locale, key), 'string', code + ': ' + key);
    }
});

test('settings expose the supported locales with localized native names and flags', () => {
    const html = readFileSync(path.join(root, 'settings.html'), 'utf8');
    for (const [code, flag, name] of [
        ['de', '🇩🇪', 'Deutsch'], ['en', '🇬🇧', 'English'], ['ar', '🇸🇦', 'العربية'],
        ['fa', '🇮🇷', 'فارسی'], ['fr', '🇫🇷', 'Français'], ['es', '🇪🇸', 'Español'],
        ['pt', '🇵🇹', 'Português']
    ]) {
        assert.match(html, new RegExp('<option value="' + code + '">' + flag + ' ' + name + '</option>'));
        assert.ok(locales[code], code + ' locale file exists');
    }
});

test('language changes translate page text and set right-to-left direction where needed', async () => {
    const textElement = { dataset: { i18n: 'menu.play' }, textContent: 'Play' };
    const ariaElement = {
        dataset: { i18nAriaLabel: 'menu.navigationLabel' },
        setAttribute(name, value) { this[name] = value; }
    };
    const document = {
        readyState: 'complete',
        documentElement: {},
        querySelectorAll(selector) {
            return selector === '[data-i18n]' ? [textElement] : [ariaElement];
        }
    };
    const context = vm.createContext({
        document,
        fetch(url) {
            const code = path.basename(url, '.json');
            return Promise.resolve({ ok: true, json: () => Promise.resolve(locales[code]) });
        },
        Preferences: { get: () => ({ language: 'en' }), update: () => true },
        console: { error() {} }
    });
    vm.runInContext(readFileSync(path.join(root, 'localization.js'), 'utf8'), context);
    assert.equal(document.documentElement.lang, 'en');
    assert.equal(document.documentElement.dir, 'ltr');
    await context.Localization.ready;
    assert.equal(textElement.textContent, 'Play');
    await context.Localization.setLanguage('fa');
    assert.equal(textElement.textContent, 'بازی');
    assert.equal(ariaElement['aria-label'], 'منوی اصلی');
    assert.equal(document.documentElement.lang, 'fa');
    assert.equal(document.documentElement.dir, 'rtl');
    await context.Localization.setLanguage('fr');
    assert.equal(textElement.textContent, 'Jouer');
    assert.equal(document.documentElement.dir, 'ltr');
});

test('saved Arabic and Persian direction is applied before locale files finish loading', () => {
    const document = { documentElement: {} };
    const context = vm.createContext({
        document,
        fetch() { return new Promise(() => {}); },
        Preferences: { get: () => ({ language: 'ar' }), update: () => true },
        console: { error() {} }
    });
    vm.runInContext(readFileSync(path.join(root, 'localization.js'), 'utf8'), context);
    assert.equal(document.documentElement.lang, 'ar');
    assert.equal(document.documentElement.dir, 'rtl');
});
