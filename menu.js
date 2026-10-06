// One chooser shared by the main menu and the end-of-game screen.
var firstTurnDialog = document.createElement('dialog');
firstTurnDialog.id = 'first-turn';
firstTurnDialog.setAttribute('aria-labelledby', 'first-turn-title');
firstTurnDialog.innerHTML = `
    <h2 id="first-turn-title">Who goes first?</h2>
    <div class="turn-options">
        <button type="button" id="you-first" autofocus>You first</button>
        <button type="button" id="computer-first">Computer first</button>
    </div>
    <form method="dialog"><button type="submit" class="cancel">Cancel</button></form>
`;
document.body.appendChild(firstTurnDialog);
var startingGame = false;

function chooseFirstPlayer() {
    startingGame = false;
    firstTurnDialog.showModal();
}

var playButton = document.getElementById('play');
if (playButton) playButton.addEventListener('click', chooseFirstPlayer);

function startGame(userFirst) {
    startingGame = true;
    document.cookie = 'user=' + userFirst + '; SameSite=Lax';
    window.location.href = 'game.html';
}

document.getElementById('you-first').addEventListener('click', function() {
    startGame(true);
});

firstTurnDialog.addEventListener('close', function() {
    var previousResult = document.getElementById('game-result');
    if (!startingGame && previousResult && !previousResult.open) previousResult.showModal();
});

document.getElementById('computer-first').addEventListener('click', function() {
    startGame(false);
});
