function makeClone(tempArray, Original_Array)
{
	for (var i = 0; i < 3; i++)
	{
		for (var j = 0; j < 3; j++)
		{
			tempArray[i][j] = Original_Array[i][j];
		}
	}
	return tempArray;
}

function selectionSort(arr)
{
	for (var i = 0; i < arr.length; i++)
	{
		var min = i;
		for(j = i+1; j < arr.length; j++)
		{
			if (arr[j] < arr[min])
			{
				min = j;
			}
		}

		if (i !== min)
		{
			var temp = arr[min];
			arr[min] = arr[i];
			arr[i] = temp;
		}
	}
	return arr;
}

function isLoss(state)
{
	for (var i = 0; i < 3; i++)
	{
		if ( (state[i][0] === state[i][1]) && (state[i][1] === state[i][2]) && (state[i][2] === 1 ) ) { return true; }
	}

	for (var i = 0; i < 3; i++)
	{
		if ( (state[0][i] === state[1][i] ) && ( state[1][i] === state[2][i]) && (state[i][2] === 1 ) ) { return true; }
	}

	if ( (state[0][0] === state[1][1] ) && ( state[1][1] === state[2][2]) && (state[2][2] === 1 ) ) { return true; }

	else if ( (state[0][2] === state[1][1] ) && ( state[1][1] === state[2][0]) && (state[2][0] === 1 ) ) { return true; }

	return false;
}

function isWin(state)
{
	for (var i = 0; i < 3; i++)
	{
		if ( (state[i][0] === state[i][1]) && (state[i][1] === state[i][2]) && (state[i][2] === 2 ) ) { return true; }
	}

	for (var i = 0; i < 3; i++)
	{
		if ( (state[0][i] === state[1][i] ) && ( state[1][i] === state[2][i]) && (state[i][2] === 2 ) ) { return true; }
	}

	if ( (state[0][0] === state[1][1] ) && ( state[1][1] === state[2][2]) && (state[2][2] === 2 ) ) { return true; }

	else if ( (state[0][2] === state[1][1] ) && ( state[1][1] === state[2][0]) && (state[2][0] === 2 ) ) { return true; }

	return false;
}

function isDraw(state)
{
	for (var i = 0; i < 3; i++)
	{
			if (state[i][0] === 0) {	return false;	} 

		else
			if (state[i][1] === 0) {	return false;	}

		else
			if (state[i][2] === 0) {	return false;	}
	}

	return true;
}

function Min(state)
{
	if 		(isWin(state))	{   return 1;	}

	else if (isDraw(state)) {	return 0;	}

	var states = getStates(state, 2); // min turn

	var choice = [];

	for (var i = 0; i < states.length; i++)
	{
		choice[i] = Max(states[i]);
	}

	choice = selectionSort(choice);

	return choice[choice.length-1];
}

function Max(state)
{	
	if 		(isLoss(state))	{   return -1;	}

	else if (isDraw(state)) {	return 0;	}

	var states = getStates(state, 1); // max turn

	var choice = [];

	for (var i = 0; i < states.length; i++)
	{
		choice[i] = Min(states[i]);
	}

	choice = selectionSort(choice);

	return choice[0];
}

function getStates(state, turn)
{
	var possibleStates = [ ];

	for (var i = 0; i < 3; i++)
	{
		if (Math.min.apply(null, state[i]) !== 0) {}

		else
		{
			for (var j = 0; j < 3; j++)
			{
				temp = [[], [], []];
				temp = makeClone(temp, state);
				if (state[i][j] === 0 )
				{
					if (turn === 1)
					{
						temp[i][j] = 1;
					}

					else
					{
						temp[i][j] = 2;
					}
					possibleStates[possibleStates.length] = temp;
				}
			}
		}
	}
	return possibleStates;
}

self.onmessage = function(e)
{
	var possibleStates = getStates(e.data, 2);
	// console.log(possibleStates);
	var options = []; // it will hold max values 

	for (var i = 0; i < possibleStates.length; i++)
	{
		options[i] = Max(possibleStates[i]);
	}

	var maxChoice = 0;
	for (var i = maxChoice+1; i < options.length; i++)
	{
		if (options[i] > options[maxChoice]) {	maxChoice = i;	}
	}
	var t = possibleStates[maxChoice];

	self.postMessage(possibleStates[maxChoice]);

	//self.postMessage(e.data);
}
