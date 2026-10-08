var resignButton = document.getElementById('resign');
var resignConfirmation = document.getElementById('resign-confirmation');

resignButton.addEventListener('click', function() {
    if (game) resignConfirmation.showModal();
});

document.getElementById('cancel-resign').addEventListener('click', function() {
    resignConfirmation.close();
});

document.getElementById('confirm-resign').addEventListener('click', function() {
    resignConfirmation.close();
    if (!game) return;
    endGame(twoPlayer ? (currentPlayer === 1 ? 'playerTwoWin' : 'playerOneWin') : 'resign');
});
