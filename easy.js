// Reuse the existing board helpers, but choose a random legal move.
importScripts('hard.js');
self.onmessage = function(event) {
    var board = event.data;
    if (isWin(board) || isLoss(board) || isDraw(board)) { self.postMessage(null); return; }
    var states = getStates(board, 2);
    self.postMessage(states[Math.floor(Math.random() * states.length)]);
};
