var firstTurnDialog = document.getElementById('first-turn');

document.getElementById('play').addEventListener('click', function() {
    firstTurnDialog.showModal();
});

function startGame(userFirst) {
    document.cookie = 'user=' + userFirst + '; SameSite=Lax';
    window.location.href = 'game.html';
}

document.getElementById('you-first').addEventListener('click', function() {
    startGame(true);
});

document.getElementById('computer-first').addEventListener('click', function() {
    startGame(false);
});
