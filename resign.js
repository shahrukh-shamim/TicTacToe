var resignButton = document.getElementById('resign');
var resignConfirmation = document.getElementById('resign-confirmation');
var resignResult = document.getElementById('resign-result');

resignButton.addEventListener('click', function() {
    if (game) resignConfirmation.showModal();
});

document.getElementById('cancel-resign').addEventListener('click', function() {
    resignConfirmation.close();
});

document.getElementById('confirm-resign').addEventListener('click', function() {
    resignConfirmation.close();
    if (!game) return;
    game = false;
    user = false;
    controller.terminate();
    resignButton.disabled = true;
    resignResult.showModal();
});

resignResult.addEventListener('cancel', function(event) {
    event.preventDefault();
});

document.getElementById('return-menu').addEventListener('click', function() {
    window.location.href = 'index.html';
});
