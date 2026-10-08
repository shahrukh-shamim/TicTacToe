var Localization = (function() {
    var languages = ['de', 'en', 'ar', 'fa', 'fr', 'es', 'pt'];
    var rightToLeft = ['ar', 'fa'];
    var initialLanguage = Preferences.get().language;
    var currentLanguage = initialLanguage;
    var messages = {};
    var cache = {};
    var requestNumber = 0;

    document.documentElement.lang = currentLanguage;
    document.documentElement.dir = rightToLeft.includes(currentLanguage) ? 'rtl' : 'ltr';

    function load(language) {
        if (!cache[language]) {
            cache[language] = fetch('locales/' + language + '.json')
                .then(function(response) {
                    if (!response.ok) throw Error('Unable to load locale ' + language + ': HTTP ' + response.status);
                    return response.json();
                });
        }
        return cache[language];
    }

    function value(path) {
        return path.split('.').reduce(function(object, key) {
            return object && object[key];
        }, messages);
    }

    function translateDocument() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', translateDocument, { once: true });
            return;
        }
        document.documentElement.lang = currentLanguage;
        document.documentElement.dir = rightToLeft.includes(currentLanguage) ? 'rtl' : 'ltr';
        document.querySelectorAll('[data-i18n]').forEach(function(element) {
            var translation = value(element.dataset.i18n);
            if (typeof translation === 'string') element.textContent = translation;
        });
        document.querySelectorAll('[data-i18n-aria-label]').forEach(function(element) {
            var translation = value(element.dataset.i18nAriaLabel);
            if (typeof translation === 'string') element.setAttribute('aria-label', translation);
        });
    }

    function setLanguage(language) {
        if (!languages.includes(language)) return Promise.reject(Error('Unsupported language: ' + language));
        var request = ++requestNumber;
        return load(language).then(function(translations) {
            if (request !== requestNumber) return;
            messages = translations;
            currentLanguage = language;
            translateDocument();
        });
    }

    var initialRequest = requestNumber + 1;
    var ready = setLanguage(initialLanguage).catch(function(error) {
        console.error(error);
        if (requestNumber !== initialRequest || initialLanguage === 'en') return;
        return setLanguage('en').then(function() {
            Preferences.update('language', 'en');
        }).catch(function(fallbackError) {
            console.error(fallbackError);
        });
    });

    return {
        languages: languages.slice(),
        ready: ready,
        t: function(path) {
            return value(path) || path;
        },
        setLanguage: setLanguage
    };
})();
