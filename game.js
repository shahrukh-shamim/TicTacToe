
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

	/* Checking for first diagonal */
	if( (board[0][0] === board[1][1]) && (board[1][1] === board[2][2]) && (board[2][2] === 2) )
	{
		let line = document.getElementById('012');
		line.x2.baseVal.value += 300;
		line.y2.baseVal.value += 300;
		return true;
	}
	/* Checking for second diagonal */
	else if( (board[0][2] === board[1][1]) && (board[1][1] === board[2][0]) && (board[2][0] === 2) )
	{
		let line = document.getElementById('210');
		line.x2.baseVal.value -= 300;
		line.y2.baseVal.value += 300;
		return true;
	}

	for (let i = 0; i < 3; i++)
	{

		if ( (board[i][0] === board[i][1]) && (board[i][1] === board[i][2]) && (board[i][2] === 2) )
		{
			let line = document.getElementById(i+'012');
			line.x2.baseVal.value += 300;
			return true;
		}

		else if( (board[0][i] === board[1][i]) && (board[1][i] === board[2][i]) && (board[1][i] === 2) )
		{
			let line = document.getElementById('012'+i);
			line.y2.baseVal.value += 300;
			return true;
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
var user   = (getCookie('user') === 'true');
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

/*A recursive function to mark a move animately (for both computer and user)*/

function marking(symbol, symbolObject)
{

	if (symbol === 0)
	{
		symbolObject.style.strokeWidth++;
	}
	else
	{
		symbolObject[0].style.strokeWidth++;
		symbolObject[1].style.strokeWidth++;
	}

	if ((symbol === 0) && (symbolObject.style.strokeWidth != 10))
	{
		setTimeout(function(){	marking(symbol, symbolObject);	} , 50);
	}

	else if ((symbol === 1) && (symbolObject[0].style.strokeWidth != 10))
	{
		setTimeout(function(){	marking(symbol, symbolObject);	} , 50);
	}

	else
	{
		user = !user; // Switch The Turn
	}
}
/*	-------	*/

/*A function to mark a circle*/

function markCircle(id)
{
	var ci = document.getElementById('c'+id) // circle object
	marking(0, ci);
}
/*	-------	*/

function markCross(CrossClass)
{
	var cr = document.getElementsByClassName(CrossClass) // cross object
	marking(1, cr);  
}
/*	-------	*/

/*Assigning a event listener to all rectangles*/

var rects = document.getElementsByClassName('rects');
for (var i = 0; i < rects.length; i++)
{
	rects[i].addEventListener('click', function()
	{
		/*
		'this.dataset.occupied' is actually a custom attribute 'occupied'
		attached to each rectangle and it indicates if a rect is filled or
		not. Variable "ready" is declared in animation.js and used at line 2 and 30
		*/

		if((ready) && (this.dataset.occupied === 'false') && (user === true) && (game))
		{
			this.dataset.occupied = true;
			switch (this.id.substr(4,1))
			{
				case '1':
					(userMark === 0) ? markCircle(this.id.substr(4,1)) : markCross(this.id.substr(4,1));
					board[0][0] = 1;
					if (!isWin())
						controller.postMessage(board);
					break;
				case '2':
					(userMark === 0) ? markCircle(this.id.substr(4,1)) : markCross(this.id.substr(4,1));
					board[0][1] = 1;
					if (!isWin())
						controller.postMessage(board);
					break;
				case '3':
					(userMark === 0) ? markCircle(this.id.substr(4,1)) : markCross(this.id.substr(4,1));
					board[0][2] = 1;
					if (!isWin())
						controller.postMessage(board);
					break;
				case '4':
					(userMark === 0) ? markCircle(this.id.substr(4,1)) : markCross(this.id.substr(4,1));
					board[1][0] = 1;
					if (!isWin())
						controller.postMessage(board);
					break;
				case '5':
					(userMark === 0) ? markCircle(this.id.substr(4,1)) : markCross(this.id.substr(4,1));
					board[1][1] = 1;
					if (!isWin())
						controller.postMessage(board);
					break;
				case '6':
					(userMark === 0) ? markCircle(this.id.substr(4,1)) : markCross(this.id.substr(4,1));
					board[1][2] = 1;
					if (!isWin())
						controller.postMessage(board);
					break;
				case '7':
					(userMark === 0) ? markCircle(this.id.substr(4,1)) : markCross(this.id.substr(4,1));
					board[2][0] = 1;
					if (!isWin())
						controller.postMessage(board);
					break;
				case '8':
					(userMark === 0) ? markCircle(this.id.substr(4,1)) : markCross(this.id.substr(4,1));
					board[2][1] = 1;
					if (!isWin())
						controller.postMessage(board);
					break;
				case '9':
					(userMark === 0) ? markCircle(this.id.substr(4,1)) : markCross(this.id.substr(4,1));
					board[2][2] = 1;
					if (!isWin())
						controller.postMessage(board);
					break;
				default:
					break;
			}
		}
	}
	);
}
/*	-------	*/

switch (level)
{
	case '1':
		controller = new Worker('easy.js');
		break;
	case '2':
		controller = new Worker('normal.js');
		break;
	case '3':
		controller = new Worker('hard.js');
		break;
	default:
		controller = new Worker('hard.js');
		break;
}
/*	-------	*/

if (user === true)
{
	//
}

else
{
	//while(!ready);
	controller.postMessage(board);
}

controller.onmessage = function(event)
{
	var data = event.data;
	loop1:
	for (var i = 0, rectangle = 1; i < 3; i++)
	{
		for (var j = 0; j < 3; j++)
		{
			if (board[i][j] !== data[i][j])
			{
				board[i][j] = 2;

				//var rectTemp = document.getElementById('rect'+rectangle);
				var rectTemp = rect[rectangle-1]; // rect array exist in animation.js. It contains all rectangle objects

				rectTemp.dataset.occupied = true;
				(userMark === 0) ? markCross(rectangle) :  markCircle(rectangle) ;
				if (isLoss())
						game = false;
				break loop1;
			}
			rectangle++;
		}
	}
}