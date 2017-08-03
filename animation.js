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
	for (var i = 0; i < 9; i++)
	{
		rect[i]['x'].baseVal.value += 1;
		rect[i]['y'].baseVal.value += 1;
	}
	
	if ((rect[8]['x'].baseVal.value < 350) && (rect[8]['y'].baseVal.value < 350))
	{
		setTimeout(increament, 1);
	}

	else
		ready = true; // The game is fully loaded, now the game can proceed
}

function createTicTacToe()
{
	increament();
}

//console.dir(rect);