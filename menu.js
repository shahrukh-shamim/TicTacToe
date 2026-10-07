// Both Play and Play another game use the starter configured in Settings.
function startGame() {
    window.location.href = 'game.html';
}

var playButton = document.getElementById('play');
if (playButton) playButton.addEventListener('click', startGame);

var onlineButton = document.getElementById('play-online');
if (onlineButton) onlineButton.addEventListener('click', function() {
    document.getElementById('online-coming-soon').showModal();
});
