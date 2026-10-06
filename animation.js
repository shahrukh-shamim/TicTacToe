var rect = new Array();
var ready = false; // the user cannot make a move until the game is fully loaded
rect = [
			document.getElementById('rect1'),
            document.getElementById('rect2'),
            document.getElementById('rect3'),
            document.getElementById('rect4'),
            document.getElementById('rect5'),
            document.getElementById('rect6'),
            document.getElementById('rect7'),
            document.getElementById('rect8'),
            document.getElementById('rect9')
        ];

function increament()
{
    var complete = true;
    for (var i = 0; i < rect.length; i++)
    {
        var targetX = 150 + (i % 3) * 100;
        var targetY = 150 + Math.floor(i / 3) * 100;
        rect[i].x.baseVal.value = Math.min(targetX, rect[i].x.baseVal.value + 1);
        rect[i].y.baseVal.value = Math.min(targetY, rect[i].y.baseVal.value + 1);
        if (rect[i].x.baseVal.value !== targetX || rect[i].y.baseVal.value !== targetY)
            complete = false;
    }
    ready = complete;
    if (!complete) setTimeout(increament, 1);
    else document.dispatchEvent(new Event('board-ready'));
}

function createTicTacToe()
{
	increament();
}

//console.dir(rect);
