// One chooser shared by the main menu and the end-of-game screen.
var firstTurnDialog = document.createElement('dialog');
firstTurnDialog.id = 'first-turn';
firstTurnDialog.className = 'result-card first-turn-card';
firstTurnDialog.setAttribute('aria-labelledby', 'first-turn-title');
firstTurnDialog.setAttribute('aria-describedby', 'first-turn-message');
firstTurnDialog.innerHTML = `
    <div class="result-sparkles" aria-hidden="true"><span>✦</span><span>●</span><span>✧</span><span>✦</span></div>
    <p class="result-label">LET’S PLAY</p>
    <div class="result-icon" aria-hidden="true">🎮</div>
    <h2 id="first-turn-title">Who goes first?</h2>
    <p id="first-turn-message" class="result-message">Your move or the computer’s? You decide.</p>
    <div class="turn-options">
        <button type="button" id="you-first" autofocus><span aria-hidden="true">🙋</span> You first</button>
        <button type="button" id="computer-first"><span aria-hidden="true">🤖</span> Computer first</button>
    </div>
    <form method="dialog"><button type="submit" class="cancel secondary-action">Cancel</button></form>
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
