// Cycle through minimax targets on successive computer turns: 1, 1, 0, -1.
importScripts('hard.js');
var moveCounter = 0;
var targetScores = [1, 1, 0, -1];

self.onmessage = function(event) {
    var board = event.data;
    if (isWin(board) || isLoss(board) || isDraw(board)) { self.postMessage(null); return; }
    var states = getStates(board, 2);
    var target = targetScores[moveCounter];
    moveCounter = (moveCounter + 1) % 4;

    // A random opening counts as the first computer turn and skips the search.
    if (states.length === 9) {
        self.postMessage(states[Math.floor(Math.random() * states.length)]);
        return;
    }

    var scores = states.map(function(state) { return Max(state); });
    var distance = Math.min.apply(null, scores.map(function(score) { return Math.abs(score - target); }));
    // If a draw target is equally close to a win and a loss, prefer the win.
    var selectedScore = Math.max.apply(null, scores.filter(function(score) { return Math.abs(score - target) === distance; }));
    var choices = states.filter(function(state, index) { return scores[index] === selectedScore; });
    self.postMessage(choices[Math.floor(Math.random() * choices.length)]);
};
