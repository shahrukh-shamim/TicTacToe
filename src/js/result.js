var resultDialog = document.getElementById('game-result');
var resultContent = {
    playerOneWin: { title: 'results.playerOneWin', icon: 'trophy', message: 'results.localWinMessage' },
    playerTwoWin: { title: 'results.playerTwoWin', icon: 'trophy', message: 'results.localWinMessage' },
    win: { title: 'results.winTitle', icon: 'trophy', message: 'results.winMessage' },
    loss: { title: 'results.lossTitle', icon: 'robot', message: 'results.lossMessage' },
    draw: { title: 'results.drawTitle', icon: 'sparkle', message: 'results.drawMessage' },
    resign: { title: 'results.resignTitle', icon: 'robot', message: 'results.resignMessage' }
};

function endGame(outcome) {
    if (!game) return;
    game = false;
    user = false;
    if (controller) controller.terminate();
    updateTurnStatus();
    document.getElementById('resign').disabled = true;
    var confirmation = document.getElementById('resign-confirmation');
    if (confirmation.open) confirmation.close();
    var content = resultContent[outcome];
    resultDialog.dataset.outcome = outcome;
    document.getElementById('result-icon').innerHTML = '<svg class="icon" aria-hidden="true"><use href="assets/icons.svg#' + content.icon + '"/></svg>';
    Localization.ready.then(function() {
        document.getElementById('result-title').textContent = Localization.t(content.title);
        document.getElementById('result-message').textContent = Localization.t(content.message);
        resultDialog.showModal();
    });
}

resultDialog.addEventListener('cancel', function(event) {
    event.preventDefault();
});

document.getElementById('return-menu').addEventListener('click', function() {
    window.location.href = 'index.html';
});

document.getElementById('play-again').addEventListener('click', function() {
    resultDialog.close();
    startGame();
});
