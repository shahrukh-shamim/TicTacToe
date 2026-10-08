
/*A function to retrieve cookie by name*/

function getCookie(cname)
{
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie); // getting all cookies in string format
	var ca = decodedCookie.split(';');
	for(var i = 0; i <ca.length; i++)
	{
		var c = ca[i];
		while (c.charAt(0) == ' ')
		{
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}
/*	-------	*/


/*Functions to determine if you have win or loss*/

function isWin() // for computer lose
{

	if( (board[0][0] === board[1][1]) && (board[1][1] === board[2][2]) && (board[2][2] === 1) )
	{
		var line = document.getElementById('012');
		line.x2.baseVal.value += 300;
		line.y2.baseVal.value += 300;
		return true;
	}

	else if( (board[0][2] === board[1][1]) && (board[1][1] === board[2][0]) && (board[2][0] === 1) )
	{
		var line = document.getElementById('210');
		line.x2.baseVal.value -= 300;
		line.y2.baseVal.value += 300;
		return true;
	}

	for (var i = 0; i < 3; i++)
	{
		if ( (board[i][0] === board[i][1]) && (board[i][1] === board[i][2]) && (board[i][2] === 1) )
		{
			var line = document.getElementById(i+'012');
			line.x2.baseVal.value += 300;
			return true;;
		}

		else if( (board[0][i] === board[1][i]) && (board[1][i] === board[2][i]) && (board[1][i] === 1) )
		{
			var line = document.getElementById('012'+i);
			line.y2.baseVal.value += 300;
			return true;;
		}

	}

	return false;
}

function isLoss() // For computer wins
{

	if( (board[0][0] === board[1][1]) && (board[1][1] === board[2][2]) && (board[2][2] === 2) )
	{
		var line = document.getElementById('012');
		line.x2.baseVal.value += 300;
		line.y2.baseVal.value += 300;
		return true;
	}

	else if( (board[0][2] === board[1][1]) && (board[1][1] === board[2][0]) && (board[2][0] === 2) )
	{
		var line = document.getElementById('210');
		line.x2.baseVal.value = 150;
		line.y2.baseVal.value = 450;
		return true;
	}

	for (var i = 0; i < 3; i++)
	{
		if ( (board[i][0] === board[i][1]) && (board[i][1] === board[i][2]) && (board[i][2] === 2) )
		{
			var line = document.getElementById(i+'012');
			line.x2.baseVal.value += 300;
			return true;;
		}

		else if( (board[0][i] === board[1][i]) && (board[1][i] === board[2][i]) && (board[1][i] === 2) )
		{
			var line = document.getElementById('012'+i);
			line.y2.baseVal.value += 300;
			return true;;
		}

	}

	return false;
}
/*	-------	*/

/*The board matrix*/

/*
	l for user
	2 for computer
*/
board =
[
	[0,0,0],
	[0,0,0],
	[0,0,0]
];
/*	-------	*/

/*
	Setting color, level, symbols (marks) and whose turn is it first (using user variable)
				according to player defined settings stored in cookies
*/

var colors = getCookie('colors');
var level  = getCookie('level');
var marks  = getCookie('marks');
var user   = Preferences.beginGame();
var game   = true;
/*	-------	*/

/*These symbols are configured below*/

var userMark; // Symbol for user
var controller; // The difficulty that is to be maintain during the game
/*	-------	*/

/*Configuring symbols*/

if (marks === '01') // the string is in format 'computerUser', 0 => circle and 1 => cross
{
	userMark = 1;
}

else
{
	userMark = 0;
}
/*	-------	*/

// Keep the legend in sync with the configured symbols.
var yourSymbol = document.getElementById('your-symbol');
var computerSymbol = document.getElementById('computer-symbol');
yourSymbol.textContent = userMark === 1 ? '×' : '○';
yourSymbol.className = userMark === 1 ? 'mark-x' : 'mark-o';
computerSymbol.textContent = userMark === 1 ? '○' : '×';
computerSymbol.className = userMark === 1 ? 'mark-o' : 'mark-x';

/*A recursive function to mark a move animately (for both computer and user)*/

function marking(symbol, symbolObject, onComplete, width)
{
    width = (width || 0) + 1;
    var parts = symbol === 0 ? [symbolObject] : Array.from(symbolObject);
    parts.forEach(function(part) { part.style.strokeWidth = String(width); });
    if (width < 10)
        setTimeout(function() { marking(symbol, symbolObject, onComplete, width); }, 50);
    else if (onComplete)
        onComplete();
}
/*	-------	*/

/*A function to mark a circle*/

function markCircle(id, onComplete)
{
	var ci = document.getElementById('c'+id) // circle object
	marking(0, ci, onComplete);
}
/*	-------	*/

function markCross(CrossClass, onComplete)
{
	var cr = document.getElementsByClassName(CrossClass) // cross object
	marking(1, cr, onComplete);
}
/*	-------	*/

/*Assigning a event listener to all rectangles*/

function finishTurn(player)
{
    if (!game) return true;
    if (player === 1 ? isWin() : isLoss())
    {
        endGame(player === 1 ? 'win' : 'loss');
        return true;
    }
    if (board.every(function(row) {
        return row.every(function(cell) { return cell !== 0; });
    }))
    {
        endGame('draw');
        return true;
    }
    return false;
}

var rects = document.getElementsByClassName('rects');
for (var i = 0; i < rects.length; i++)
{
    rects[i].addEventListener('click', function()
    {
        if (!ready || !user || !game || this.dataset.occupied !== 'false') return;
        user = false;
        var id = Number(this.id.slice(4));
        this.dataset.occupied = 'true';
        board[Math.floor((id - 1) / 3)][(id - 1) % 3] = 1;
        var complete = function() {
            if (!finishTurn(1)) controller.postMessage(board);
        };
        if (userMark === 0) markCircle(id, complete);
        else markCross(String(id), complete);
    });
}

switch (level)
{
	case '1':
		controller = new Worker('workers/easy.js');
		break;
	case '2':
		controller = new Worker('workers/normal.js');
		break;
	case '3':
		controller = new Worker('workers/hard.js');
		break;
	default:
		controller = new Worker('workers/hard.js');
		break;
}
/*	-------	*/

controller.onmessage = function(event)
{
    if (!game || !event.data) return;
    var data = event.data;
    for (var i = 0; i < 3; i++)
    {
        for (var j = 0; j < 3; j++)
        {
            if (board[i][j] === 0 && data[i][j] === 2)
            {
                board[i][j] = 2;
                var id = i * 3 + j + 1;
                rect[id - 1].dataset.occupied = 'true';
                var complete = function() { if (!finishTurn(2)) user = true; };
                if (userMark === 0) markCross(String(id), complete);
                else markCircle(id, complete);
                return;
            }
        }
    }
};

if (!user)
{
    if (ready) controller.postMessage(board);
    else document.addEventListener('board-ready', function() {
        if (game) controller.postMessage(board);
    }, { once: true });
}
