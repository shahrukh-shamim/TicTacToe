var settingsForm = document.getElementById('settings-form');
var saveStatus = document.getElementById('save-status');
var savedSettings = Preferences.get();

settingsForm.querySelectorAll('input[type="radio"]').forEach(function(input) {
    if (Object.prototype.hasOwnProperty.call(savedSettings, input.name)) {
        input.checked = savedSettings[input.name] === input.value;
    }
});

settingsForm.addEventListener('submit', function(event) { event.preventDefault(); });
settingsForm.addEventListener('change', function(event) {
    var input = event.target;
    if (!input.matches('input[type="radio"]') || !input.checked) return;
    var saved = Preferences.update(input.name, input.value);
    saveStatus.textContent = saved ? 'Changes saved automatically' : 'Changes could not be saved. Check your browser storage.';
});
