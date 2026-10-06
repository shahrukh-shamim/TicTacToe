// Medium takes an immediate win, blocks an immediate loss, then explores randomly.
importScripts('hard.js');
self.onmessage = function(event) {
    var board = event.data;
    if (isWin(board) || isLoss(board) || isDraw(board)) { self.postMessage(null); return; }
    var states = getStates(board, 2);
    var winning = states.find(isWin);
    if (winning) { self.postMessage(winning); return; }
    var threat = getStates(board, 1).find(isLoss);
    if (threat) {
        for (var row = 0; row < 3; row++) {
            for (var col = 0; col < 3; col++) {
                if (board[row][col] === 0 && threat[row][col] === 1) {
                    var blocked = board.map(function(cells) { return cells.slice(); });
                    blocked[row][col] = 2;
                    self.postMessage(blocked);
                    return;
                }
            }
        }
    }
    self.postMessage(states[Math.floor(Math.random() * states.length)]);
};
