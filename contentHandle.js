window.onload = function()
{
	//console.log(1234567);
	var body = document.getElementById('body');
	var svg  = document.getElementById('mySVG');
	var width = body.offsetWidth = screen.width;
	//var mar = (width-600)/2;
	var mar = width/3.4285714285714284;
	svg.style.marginLeft = mar;
	//console.log(screen.width + "  " + typeof(mar) + "	" + screen.width/mar + "	" + typeof(width));
}

/*
	For

	screen.width 1440
	svg width 600 
	mar 420
	ratio of screen.width/mar = 3.4285714285714284
*/