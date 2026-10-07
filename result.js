var resultDialog = document.getElementById('game-result');
var resultContent = {
    win: { title: 'You win! 🎉', icon: 'trophy', message: 'Three in a row. This round is yours!' },
    loss: { title: 'Computer wins 😎', icon: 'robot', message: 'The computer takes this round. Ready for a rematch?' },
    draw: { title: 'It’s a draw! 🤝', icon: 'sparkle', message: 'Every square filled. An evenly matched finish!' },
    resign: { title: 'Computer wins 😎', icon: 'robot', message: 'You resigned this round. A fresh board awaits.' }
};

function endGame(outcome) {
    if (!game) return;
    game = false;
    user = false;
    controller.terminate();
    document.getElementById('resign').disabled = true;
    var confirmation = document.getElementById('resign-confirmation');
    if (confirmation.open) confirmation.close();
    var content = resultContent[outcome];
    resultDialog.dataset.outcome = outcome;
    document.getElementById('result-title').textContent = content.title;
    document.getElementById('result-icon').innerHTML = '<svg class="icon" aria-hidden="true"><use href="assets/icons.svg#' + content.icon + '"/></svg>';
    document.getElementById('result-message').textContent = content.message;
    resultDialog.showModal();
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
