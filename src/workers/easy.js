// Use Hard's minimax scores from the computer's perspective:
// -1 = player can win, 0 = draw, 1 = computer can win.
importScripts('hard.js');
self.onmessage = function(event) {
    var board = event.data;
    if (isWin(board) || isLoss(board) || isDraw(board)) { self.postMessage(null); return; }
    var states = getStates(board, 2);

    // Skip the full search when the computer opens on an empty board.
    if (states.length === 9) {
        self.postMessage(states[Math.floor(Math.random() * states.length)]);
        return;
    }

    var scores = states.map(function(state) { return Max(state); });
    // Prefer -1; if unavailable, prefer a draw over a computer win.
    var worstScore = Math.min.apply(null, scores);
    var choices = states.filter(function(state, index) { return scores[index] === worstScore; });
    self.postMessage(choices[Math.floor(Math.random() * choices.length)]);
};
