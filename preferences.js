// Shared settings store. Apply mark colors before the page is painted.
var Preferences = (function() {
    var storageKey = 'tic-tac-toe.settings.v1';
    var defaults = { symbol: 'x', color: 'cyan', difficulty: 'hard', firstTurn: 'you' };
    var choices = {
        symbol: ['o', 'x'], color: ['cyan', 'coral'],
        difficulty: ['easy', 'medium', 'hard'], firstTurn: ['computer', 'you']
    };
    var current = Object.assign({}, defaults);
    try {
        var saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
        Object.keys(defaults).forEach(function(key) {
            if (saved && choices[key].includes(saved[key])) current[key] = saved[key];
        });
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
    if (!document.cookie.split(';').some(function(part) { return part.trim().startsWith('user='); })) {
        cookie('user', current.firstTurn === 'you');
    }

    return {
        get: function() { return Object.assign({}, current); },
        update: function(key, value) {
            if (!choices[key] || !choices[key].includes(value)) return false;
            current[key] = value;
            apply();
            if (key === 'firstTurn') cookie('user', value === 'you');
            try {
                localStorage.setItem(storageKey, JSON.stringify(current));
                return true;
            } catch (error) { return false; }
        }
    };
})();
