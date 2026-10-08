// Shared settings store. Apply mark colors before the page is painted.
var Preferences = (function() {
    var storageKey = 'tic-tac-toe.settings.v1';
    var alternateKey = 'tic-tac-toe.next-starter.v1';
    var nextStarter = 'you';
    var supportedLanguages = ['de', 'en', 'ar', 'fa', 'fr', 'es', 'pt'];
    var defaultLanguage = 'en';
    try {
        var deviceLanguages = navigator.languages && navigator.languages.length
            ? navigator.languages : [navigator.language];
        for (var i = 0; i < deviceLanguages.length; i++) {
            var baseLanguage = deviceLanguages[i].toLowerCase().split('-')[0];
            if (supportedLanguages.includes(baseLanguage)) {
                defaultLanguage = baseLanguage;
                break;
            }
        }
    } catch (error) { /* Use English when the browser language is unavailable. */ }
    var defaults = { symbol: 'x', color: 'cyan', difficulty: 'hard', firstTurn: 'you', twoPlayerFirst: '1', language: defaultLanguage, vfx: '1' };
    var choices = {
        symbol: ['o', 'x'], color: ['cyan', 'coral'],
        difficulty: ['easy', 'medium', 'hard'], firstTurn: ['computer', 'you', 'alternate'],
        twoPlayerFirst: ['1', '2'], language: supportedLanguages,
        vfx: ['0', '1']
    };
    var current = Object.assign({}, defaults);
    try {
        var saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
        Object.keys(defaults).forEach(function(key) {
            if (saved && choices[key].includes(saved[key])) current[key] = saved[key];
        });
        if (localStorage.getItem(alternateKey) === 'computer') nextStarter = 'computer';
    } catch (error) { /* Use defaults if storage is unavailable or invalid. */ }

    function cookie(name, value) {
        document.cookie = name + '=' + value + '; max-age=31536000; SameSite=Lax';
    }

    function apply() {
        var yourColor = current.color === 'cyan' ? '#45D5E8' : '#FF7B82';
        var otherColor = current.color === 'cyan' ? '#FF7B82' : '#45D5E8';
        document.documentElement.style.setProperty('--color-x', current.symbol === 'x' ? yourColor : otherColor);
        document.documentElement.style.setProperty('--color-o', current.symbol === 'o' ? yourColor : otherColor);
        cookie('marks', current.symbol === 'x' ? '01' : '10');
        cookie('level', { easy: '1', medium: '2', hard: '3' }[current.difficulty]);
    }

    apply();
    return {
        get: function() { return Object.assign({}, current); },
        beginGame: function() {
            if (current.firstTurn !== 'alternate') return current.firstTurn === 'you';
            var userFirst = nextStarter === 'you';
            nextStarter = userFirst ? 'computer' : 'you';
            try { localStorage.setItem(alternateKey, nextStarter); } catch (error) { /* Keep the in-memory choice. */ }
            return userFirst;
        },
        update: function(key, value) {
            if (!choices[key] || !choices[key].includes(value)) return false;
            var resetAlternate = key === 'firstTurn' && value === 'alternate' && current.firstTurn !== value;
            current[key] = value;
            apply();
            if (resetAlternate) nextStarter = 'you';
            try {
                if (resetAlternate) localStorage.setItem(alternateKey, nextStarter);
                localStorage.setItem(storageKey, JSON.stringify(current));
                return true;
            } catch (error) { return false; }
        }
    };
})();
