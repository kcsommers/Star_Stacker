//******************
// Global Variables
//******************
var gemColors = ['#e73854', '#537bff', '#fff855'];
var stackArray = [];
var gameOverBool = false;
var player1Turn = true;
var player1Score = 0;
var player2Score = 0;
var stackCount = 0;
var currColumn = 3;
var currRow = 13;
var matchCount = 0;	
var dropSpeed = 300;
var speedCount = 1;
var timer = 0;
var wall, thisStack, dropInterval, timerInterval, hangersInterval;	

//***** background-canvas
var bgCanvas = $('#bg-canvas')[0];
var bgCtx = bgCanvas.getContext('2d');
var starsArray = [];
var colors = ['#f3f086', '#e0e9f3', '#f3ddd9', 
'#f3a19b', '#96d6f3', '#909292', '#aaacac', 
'#e0e3e3', '#edefef', '#ffffff', '#ffffff', 
'#ffffff', '#ffffff', '#ffffff', '#bf81f2', '#ffffff'];
var animateStars, animationFrame;

//***** board-canvas
var boardCanvas = $('#board-canvas')[0];
var boardCtx = boardCanvas.getContext('2d');
boardCanvas.width = 300;
boardCanvas.height = 650;
var horizArray = [];
var vertArray = [];
var xH = 0;
var yH = 0;
var xV = 0;
var yV = 0;

// board columns
var gridColumns = [{
	id: 0,
	left: 0,
	bottom: 650,
	rows: {0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 
	7: null, 8: null, 9: null, 10: null, 11: null, 12: null}
},
{
	id: 1,
	left: 50,
	bottom: 650,
	rows: {0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 
	7: null, 8: null, 9: null, 10: null, 11: null, 12: null}
},
{
	id: 2,
	left: 100,
	bottom: 650,
	rows: {0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 
	7: null, 8: null, 9: null, 10: null, 11: null, 12: null}
},
{
	id: 3,
	left: 150,
	bottom: 650,
	rows: {0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 
	7: null, 8: null, 9: null, 10: null, 11: null, 12: null}
},
{
	id: 4,
	left: 200,
	bottom: 650,
	rows: {0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 
	7: null, 8: null, 9: null, 10: null, 11: null, 12: null}
},
{
	id: 5,
	left: 250,
	bottom: 650,
	rows: {0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 
	7: null, 8: null, 9: null, 10: null, 11: null, 12: null}
}];
// board/grid rows
var gridRows = [
{id: 0, bottom: 650},
{id: 1, bottom: 600},
{id: 2, bottom: 550},
{id: 3, bottom: 500},
{id: 4, bottom: 450},
{id: 5, bottom: 400},
{id: 6, bottom: 350},
{id: 7, bottom: 300},
{id: 8, bottom: 250},
{id: 9, bottom: 200},
{id: 10, bottom: 150},
{id: 11, bottom: 100},
{id: 12, bottom: 50}
];


//******************
// Objects
//******************

// background-canvas Star object
var Star = function(x, y, radius, color) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.color = color;
  this.drawStar = function() {
  	bgCtx.beginPath();
    bgCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    bgCtx.fillStyle = this.color;
    bgCtx.fill();
  };
  
  this.glow = function() {
  	// shrink while radius is more than 1.5
  	if(this.radius > 1.5) this.radius -= 0.01;
  	else this.radius += 1; // creates twinkle effect
    this.drawStar();
  };
};

// horizontal grid line object
var Horizontal = function(x, y, dx, dy) {
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	this.draw = function() {
		boardCtx.beginPath();
		boardCtx.moveTo(this.x, this.y);
		boardCtx.lineTo(this.dx, this.dy);
		boardCtx.strokeStyle = 'white';
		boardCtx.lineWidth = 3;
		boardCtx.stroke();
		boardCtx.shadowOffsetX = 4;
		boardCtx.shadowOffsetY = 8;
		boardCtx.shadowBlur = 7;
		boardCtx.shadowColor = '#000000';
	};
};

// vertical grid line object
var Vertical = function(x, y, dx, dy) {
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	this.draw = function() {
		boardCtx.beginPath();
		boardCtx.moveTo(this.x, this.y);
		boardCtx.lineTo(this.dx, this.dy);
		boardCtx.strokeStyle = 'white';
		boardCtx.lineWidth = 3;
		boardCtx.stroke();
		boardCtx.shadowOffsetX = 4;
		boardCtx.shadowOffsetY = 8;
		boardCtx.shadowBlur = 7;
		boardCtx.shadowColor = '#000000';
	};
};
// push gridlines into arrays
for(let i = 0; i < 14; i++) {
	horizArray.push(new Horizontal(xH, yH, xH + (50 * 6), yH));
	yH += 50;
}
for(let i = 0; i < 7; i++) {
	vertArray.push(new Vertical(xV, yV, xV, yV + (50 * 13)));
	xV += 50;
}

// Gem object
var Gem = function(x, y, radius, color) {
	thisGem = this;
	this.x = x;
	this.y = y;
	this.radius = radius;
	this.color = color;
	this.draw = function() {
		boardCtx.beginPath();
		boardCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		boardCtx.fillStyle = this.color;
		boardCtx.fill();
		boardCtx.shadowOffsetX = 4;
		boardCtx.shadowOffsetY = 8;
		boardCtx.shadowBlur = 7;
		boardCtx.shadowColor = '#000000';
	}
};

// Stack object (made of three Gems)
var Stack = function(x, y, id) {
	thisStack = this; // assigns the newest stack to the global thisStack var
	this.x = x;
	this.y = y;
	this.id = stackCount;
	this.gem1 = new Gem(this.x, this.y, 25, gemColors[Math.floor(Math.random() * gemColors.length)]);
	this.gem2 = new Gem(this.x, this.y + 50, 25, gemColors[Math.floor(Math.random() * gemColors.length)]);
	this.gem3 = new Gem(this.x, this.y + 100, 25, gemColors[Math.floor(Math.random() * gemColors.length)]);
	this.gem1.gemId = 'gem1';
	this.gem2.gemId = 'gem2';
	this.gem3.gemId = 'gem3';
	this.gem1.stackId = stackCount;
	this.gem2.stackId = stackCount;
	this.gem3.stackId = stackCount;
	this.bottom = this.y + 125;
	this.left = this.x - 25;
	this.drawStack = function() {
		boardCtx.clearRect(0, 0, innerWidth, innerHeight);
		drawGrid(); 

		// draw every gem in every stack in stack array...
		stackArray.forEach((stack) => {
			// ... if the gem still exists
			if( stack.hasOwnProperty('gem1') ) stack.gem1.draw();
			if( stack.hasOwnProperty('gem2') ) stack.gem2.draw();
			if( stack.hasOwnProperty('gem3') ) stack.gem3.draw();
		});
	};
	this.drop = function() {
		// drop stack if it hasn't reached the bottom of its current column
		if(this.bottom < gridColumns[currColumn].bottom) {
			this.y += 25;
			this.bottom += 25;
			this.gem1.y += 25;
			this.gem2.y += 25;
			this.gem3.y += 25;
			// check its row when it is between horiz grid lines
			// info needed to prevent overlapping on right/left keypress
			if(this.bottom % 2 !== 0) currRow = rowChecker(this.bottom);
			this.drawStack();
		}
		else {
			// when it reaches the bottom, decrease the currColumn bottom 
			// and set each gems column property to the current column
			gridColumns[currColumn].bottom -= 150;
			this.gem1.column = currColumn;
			this.gem2.column = currColumn;
			this.gem3.column = currColumn;

			// set each gems row property
			// and mark its place in the grid
			// depending on which gem is on top
			if(this.y === this.gem1.y) { // if gem1 is on top
				gridColumns[currColumn].rows[currRow + 2] = this.gem1;
				gridColumns[currColumn].rows[currRow + 1] = this.gem2;
				gridColumns[currColumn].rows[currRow] = this.gem3;

				this.gem1.row = currRow + 2;
				this.gem2.row = currRow + 1;
				this.gem3.row = currRow;
			}
			else if(this.y === this.gem2.y) { // if gem two is on top
				gridColumns[currColumn].rows[currRow] = this.gem1;
				gridColumns[currColumn].rows[currRow + 2] = this.gem2;
				gridColumns[currColumn].rows[currRow + 1] = this.gem3;

				this.gem1.row = currRow;
				this.gem2.row = currRow + 2;
				this.gem3.row = currRow + 1;
			}
			else if(this.y === this.gem3.y){ // if gem3 is on top
				gridColumns[currColumn].rows[currRow + 1] = this.gem1;
				gridColumns[currColumn].rows[currRow] = this.gem2;
				gridColumns[currColumn].rows[currRow + 2] = this.gem3;

				this.gem1.row = currRow + 1;
				this.gem2.row = currRow;
				this.gem3.row = currRow + 2;
			}

			// pass array with each gem to checkMatches function
			checkMatches([this.gem1, this.gem2, this.gem3]);

			// increase the stackCount and create a new one
			stackCount++;
			createStack();
		}
	};
	this.moveStack = function(e, keyCode) {
		switch(keyCode) {
			case 37: // if its not in the first column and the space to the left isn't taken
				if( (currColumn > 0) && (!gridColumns[currColumn - 1].rows[currRow]) )  {
					this.gem1.x -= 50;
					this.gem2.x -= 50;
					this.gem3.x -= 50;
					this.left -= 50;
					currColumn = columnChecker(this.left);
					this.drawStack();
				}
				break;
			case 38: // up
				e.preventDefault(); // prevents page from scrolling
				let gem1Temp = this.gem1.y //
				this.gem1.y = this.gem2.y; //  
				this.gem2.y = this.gem3.y; // swap y values
				this.gem3.y = gem1Temp;	   //
				this.drawStack();
				break;	
			case 39: // if its not in the last column and the space to the right isn't taken
				if( (currColumn < 5) && (!gridColumns[currColumn + 1].rows[currRow]) ) {
					this.gem1.x += 50;
					this.gem2.x += 50;
					this.gem3.x += 50;
					this.left += 50;
					currColumn = columnChecker(this.left);
					this.drawStack();
				} 
				break;
			case 40: // down
				e.preventDefault(); 
				this.drop();
		}
	};
};

// game over Wall object
var Wall = function() {
	this.x = 0;
	this.y = 0;
	this.width = 310;
	this.height = 0;
	this.draw = function() {
		boardCtx.fillStyle = '#19151d';
		boardCtx.fillRect(this.x, this.y, this.width, this.height);
	}
}


//*****************************
// Functions and Game Logic
//*****************************

var drawGrid = function() {
	horizArray.forEach(function(line) {line.draw();});
	vertArray.forEach(function(line) {line.draw();});
	if(gameOverBool) wall.draw(); // if game is over drop the wall over the grid
}

// scorekeeping
var scoreKeeper = function(matchArr, matchCount) {
	let pointsTotal = 0;
	let i = 0;
	let scoreDisplay = player1Turn ? $('.player1-score .display') : $('.player2-score .display');
	
	// if only 1 consecutive match has occurred, player scores 10 
	if(matchCount === 1) {
		if(matchArr.length === 3) pointsTotal += 10;
		// player scores more if more than 3 gems in a row
		else if(matchArr.length === 4) pointsTotal += 15;
		else if(matchArr.length >= 5) pointsTotal += 20;
	} // otherwise player scores more points
	else if(matchCount === 2) pointsTotal += 20;
	else if(matchCount >= 3) pointsTotal += 30;

	let scoreInterval = setInterval(function() {
		// increment total player score if counter is less than the amount just scored 
		// this allows the score display to run up whenever a match occurs
		if(i < pointsTotal) {
			if(player1Turn) { // if its player1's turn
				player1Score += 1;
				scoreDisplay.html((player1Score < 10) ? '0' + player1Score : player1Score);
			}
			else {
				player2Score += 1;
				scoreDisplay.html((player2Score < 10) ? '0' + player2Score : player2Score);
			}
			i++;	
		}
		else {
			clearInterval(scoreInterval);
		}
	}, 10);
};

// this function increases the speed of the falling stack
var speedUp = function() {
	speedCount += 1; 
	$('.speed-container .display').html(speedCount);

	if(speedCount < 5) { // speed can only increase 4 times
		if(speedCount > 3) { // increase by 50ms if its the fourth time
			dropSpeed -= 50;
		} 
		else { //otherwise increase speed by 100ms
			dropSpeed -= 100;
		}

		// clear the interval and reset it with the new dropSpeed
		clearInterval(dropInterval);
		dropInterval = setInterval(function() {
			thisStack.drop();
		}, dropSpeed); 
	}
}

var dropHangers = function(hangersArr, spaceObj) {
	console.log('Hangers:', hangersArr);
	let intervalsArr = [];
	hangersArr.forEach((gem, i) => { // for each hanging gem

		gridColumns[gem.column].rows[gem.row] = null; // set their current position to null
		
		let yCount = 0; 
		intervalsArr.push(setInterval(function() {
			if( yCount < (spaceObj[gem.column] / 5) ) {
				gem.y += 5;
				yCount++;
			} 
			else {	
				clearInterval(intervalsArr[i]);
				gem.row = rowChecker(gem.y);
				gridColumns[gem.column].rows[gem.row] = gem;
				checkMatches([gem]);
			}
			boardCtx.clearRect(0, 0, innerWidth, innerHeight);
			drawGrid();
			gem.draw();
			thisStack.drawStack();
		}));
	});
};

var removeGems = function(matchesArr) {
	let hangingGems = [];
	let spaceObj = {0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0}; // holds the distance each gem should travel in its column
	
	// set each matching gems place in the grid to null BEFORE checking for hangers 
	// (this was causing a bug on multiple matches)
	matchesArr.forEach((gem) => {
		gem.row = rowChecker(gem.y); // make sure it has the right row
		gridColumns[gem.column].rows[gem.row] = null;
		gridColumns[gem.column].bottom += 50;  // add to its column's bottom
		delete stackArray[gem.stackId][gem.gemId]; // delete it from its stack
	});

	// check for hangers
	matchesArr.forEach((gem) => {
		// if there is a gem in the row above it, push it into the hangingGems array
		if(gridColumns[gem.column].rows[gem.row + 1]) {
			hangingGems.push(gridColumns[gem.column].rows[gem.row + 1]);
		}
		gem = null; // garbage collection?
	});

	hangingGems.forEach((gem) => { // for each hanging gem...
		// without checking below the first row,
		// while there is space below the first hanger, add 50 to its column in spaceObj
		let j = 1;
		while( gridColumns[gem.column].rows[gem.row - j] >= 0
			&& !gridColumns[gem.column].rows[gem.row - j] ) {
			spaceObj[gem.column] += 50;
			j++;
		}

		// while there are gems in the rows above each hanger
		// push them all into hanginGems array
		let i = 1;
		while( gridColumns[gem.column].rows[gem.row + i] ) {
			hangingGems.push(gridColumns[gem.column].rows[gem.row + i]);
			i++;
		} 
	});

	// if there are hanging gems, pass them to dropHangers function
	if(hangingGems.length) dropHangers(hangingGems, spaceObj);
};

var columnChecker = function(num) {
	if(num === 0) return 0;
	else if(num === 50) return 1;
	else if(num === 100) return 2;
	else if(num === 150) return 3;
	else if(num === 200) return 4;
	else if(num === 250) return 5;
}

var rowChecker = function(num) {
	if(num === 625) return 0;
	else if(num === 575) return 1;
	else if(num === 525) return 2;
	else if(num === 475) return 3;
	else if(num === 425) return 4;
	else if(num === 375) return 5;
	else if(num === 325) return 6;
	else if(num === 275) return 7;
	else if(num === 225) return 8;
	else if(num === 175) return 9;
	else if(num === 125) return 10;
	else if(num === 75) return 11;
	else if(num === 25) return 12;
};

// I am hoping to add more logic to this function to allow it to check for matches longer than three
// previously I used while loops, but they were causing all kinds of trouble
var checkMatches = function(stack) {
	let matches = [];
	// for each gem in the stack...
	stack.forEach((gem, i) => {
		let gemColumn = gem.column;
		let gemRow = gem.row;
		let color = gem.color;
		let column = gridColumns[gemColumn];
		let rows = column.rows;

		// ... search its neighboring squares in every direction
		// depending on whether it lands in the middle, to the right, or to the left
		// and push every gem into the matches array if there are 3

		// row middle
		if(gridColumns[gemColumn - 1] && gridColumns[gemColumn - 1].rows[gemRow] 
			&& gridColumns[gemColumn + 1] && gridColumns[gemColumn + 1].rows[gemRow]
			&& color === gridColumns[gemColumn - 1].rows[gemRow].color
			&& color === gridColumns[gemColumn + 1].rows[gemRow].color) {
			matches.push(gem, gridColumns[gemColumn - 1].rows[gemRow], gridColumns[gemColumn + 1].rows[gemRow]);
		}

		// row left
		if(gridColumns[gemColumn - 1] && gridColumns[gemColumn - 1].rows[gemRow] 
			&& gridColumns[gemColumn - 2] && gridColumns[gemColumn - 2].rows[gemRow]
			&& color === gridColumns[gemColumn - 1].rows[gemRow].color
			&& color === gridColumns[gemColumn - 2].rows[gemRow].color) {
			matches.push(gem, gridColumns[gemColumn - 1].rows[gemRow], gridColumns[gemColumn - 2].rows[gemRow]);
		}

		// row right
		if(gridColumns[gemColumn + 1] && gridColumns[gemColumn + 1].rows[gemRow] 
			&& gridColumns[gemColumn + 2] && gridColumns[gemColumn + 2].rows[gemRow]
			&& color === gridColumns[gemColumn + 1].rows[gemRow].color
			&& color === gridColumns[gemColumn + 2].rows[gemRow].color) {
			matches.push(gem, gridColumns[gemColumn + 1].rows[gemRow], gridColumns[gemColumn + 2].rows[gemRow]);
		}

		// column middle
		if(rows[gemRow + 1] && rows[gemRow - 1]
			&& color === rows[gemRow + 1].color
			&& color === rows[gemRow - 1].color) {
			matches.push(gem, rows[gemRow + 1], rows[gemRow - 1]);
		}

		// column top/bottom (searching down)
		if(rows[gemRow - 1] && rows[gemRow - 2]
			&& color === rows[gemRow - 1].color
			&& color === rows[gemRow - 2].color) {
			matches.push(gem, rows[gemRow - 1], rows[gemRow - 2]);
		}

		// diag1 middle
		if(gridColumns[gemColumn - 1] && gridColumns[gemColumn - 1].rows[gemRow + 1] 
			&& gridColumns[gemColumn + 1] && gridColumns[gemColumn + 1].rows[gemRow - 1]
			&& color === gridColumns[gemColumn - 1].rows[gemRow + 1].color
			&& color === gridColumns[gemColumn + 1].rows[gemRow - 1].color) {
			matches.push(gem, gridColumns[gemColumn - 1].rows[gemRow + 1], gridColumns[gemColumn + 1].rows[gemRow - 1]);
		}

		// diag1 left
		if(gridColumns[gemColumn - 1] && gridColumns[gemColumn - 1].rows[gemRow - 1] 
			&& gridColumns[gemColumn - 2] && gridColumns[gemColumn - 2].rows[gemRow - 2]
			&& color === gridColumns[gemColumn - 1].rows[gemRow - 1].color
			&& color === gridColumns[gemColumn - 2].rows[gemRow - 2].color) {
			matches.push(gem, gridColumns[gemColumn - 1].rows[gemRow - 1], gridColumns[gemColumn - 2].rows[gemRow - 2]);
		}

		// diag1 right
		if(gridColumns[gemColumn + 1] && gridColumns[gemColumn + 1].rows[gemRow + 1] 
			&& gridColumns[gemColumn + 2] && gridColumns[gemColumn + 2].rows[gemRow + 2]
			&& color === gridColumns[gemColumn + 1].rows[gemRow + 1].color
			&& color === gridColumns[gemColumn + 2].rows[gemRow + 2].color) {
			matches.push(gem, gridColumns[gemColumn + 1].rows[gemRow + 1], gridColumns[gemColumn + 2].rows[gemRow + 2]);
		}

		// diag2 middle
		if(gridColumns[gemColumn - 1] && gridColumns[gemColumn - 1].rows[gemRow - 1] 
			&& gridColumns[gemColumn + 1] && gridColumns[gemColumn + 1].rows[gemRow + 1]
			&& color === gridColumns[gemColumn - 1].rows[gemRow - 1].color
			&& color === gridColumns[gemColumn + 1].rows[gemRow + 1].color) {
			matches.push(gem, gridColumns[gemColumn - 1].rows[gemRow - 1], gridColumns[gemColumn + 1].rows[gemRow + 1]);
		}

		// diag2 left
		if(gridColumns[gemColumn - 1] && gridColumns[gemColumn - 1].rows[gemRow + 1] 
			&& gridColumns[gemColumn - 2] && gridColumns[gemColumn - 2].rows[gemRow + 2]
			&& color === gridColumns[gemColumn - 1].rows[gemRow + 1].color
			&& color === gridColumns[gemColumn - 2].rows[gemRow + 2].color) {
			matches.push(gem, gridColumns[gemColumn - 1].rows[gemRow + 1], gridColumns[gemColumn - 2].rows[gemRow + 2]);
		}

		// diag2 right
		if(gridColumns[gemColumn + 1] && gridColumns[gemColumn + 1].rows[gemRow - 1] 
			&& gridColumns[gemColumn + 2] && gridColumns[gemColumn + 2].rows[gemRow - 2]
			&& color === gridColumns[gemColumn + 1].rows[gemRow - 1].color
			&& color === gridColumns[gemColumn + 2].rows[gemRow - 2].color) {
			matches.push(gem, gridColumns[gemColumn + 1].rows[gemRow - 1], gridColumns[gemColumn + 2].rows[gemRow - 2]);
		}
	
		// filter out any duplicates in the matches array
		matches = matches.filter((item, index, arr) => {return arr.indexOf(item) === index;});
	});
	// if there are matches, pass the array to the removeGems function
	// increase the matchCount (for scoring)
	// pass each into scoreKeeper function
	if(matches.length) {
		$('#match-sound')[0].play();
		removeGems(matches);
		matchCount++;
		scoreKeeper(matches, matchCount);
	}
};

var declareWinner = function() {
	player1Turn = !player1Turn;
	gameOverBool = false;

	// set every stack object to null - I think this allows garbage collection?
	stackArray.forEach((stack) => {stack = null;});
	stackArray.length = 0; // empty stack array

	if(player1Score > player2Score) {
		$('#ready-container h3').html('Player 1,<br /> you\'re a <span style="color: white;">S</span><span style="color: #e73854;">T</span><span style="color: #537bff;">A</span>R<span style="color: white;">!</span>');
	} 
	else {
		$('#ready-container h3').html('Player 2,<br /> you\'re a <span style="color: white;">S</span><span style="color: #e73854;">T</span><span style="color: #537bff;">A</span>R<span style="color: white;">!</span>');
	}

	// reset scores
	player1Score = 0;
	player2Score = 0;
	
	// hide board, show ready-container
	$('#board-canvas').hide();	
	$('#begin-btn').html('Play Again?')
	$('#ready-container').fadeIn(1000);
}

var switchTurns = function() {
	player1Turn = !player1Turn; // swap boolean
	gameOverBool = false;


	// set every stack object to null - I think this allows garbage collection?
	stackArray.forEach((stack) => {stack = null;});
	stackArray.length = 0; // empty stack array

	// hide board, show ready container
	$('#board-canvas').hide();
	$('#begin-btn').html('Begin');	
	$('#ready-container h3').html('Ready Player 2?');
	$('#ready-container').fadeIn(1000);
}

var gameOver = function() {
	gameOverBool = true;

	// clear intervals
	clearInterval(dropInterval);
	clearInterval(timerInterval);
	clearInterval(hangersInterval);

	// remove keydown event handler
	$(document).off('keydown');

	// reset globals
	stackCount = 0;
	currColumn = 3;
	currRow = 14;
	matchCount = 0;	
	dropSpeed = 300;
	maxSpeed = 0;
	timer = 0;
	speedCount = 1;

	// clear the board, reset column bottom
	gridColumns.forEach(function(col) {
		col.bottom = 650;
		for(let square in col.rows) {
			col.rows[square] = null;
		}
	});

	// drop wall 
	wall = new Wall(); // global wall variable
	let wallInterval = setInterval(function() {
		if(wall.height < 650) { // drop until its height is 650...
			wall.height += 50;
			thisStack.drawStack();
			drawGrid();
		}
		else { // ... then clear the interval and switch turns or declare winner
			clearInterval(wallInterval);
			if(player1Turn) switchTurns();
			else declareWinner();
		}
	}, 130);
};


var createStack = function() {
	if(gridColumns[3].rows[12] === null) {
		//otherwise create the stack
		currColumn = 3;
		currRow = 12;
		matchCount = 0;
		stackArray.push(new Stack(175, -125, stackCount));
		stackArray[stackCount].drawStack();
	}
	else { // game is over if row 12 col 3 is taken
		gameOver();
	}
};

// stars animation
var animateStars = function() {
  animationFrame = requestAnimationFrame(animateStars);
  bgCtx.clearRect(0, 0, innerWidth, innerHeight);
  for(var i = 0; i < starsArray.length; i++){
    starsArray[i].glow(); // call glow method on every star
  }
}

// init bg-canvas stars
var bgInit = function(){
	// set heights of intro page (accounting for body margin)
	$('.game-intro-container').innerHeight(innerHeight - 10);
	bgCanvas.width = innerWidth - 10;
	bgCanvas.height = innerHeight - 10;

	starsArray = []; // fill stars array
	for(var i = 0; i <= 1500; i++){
		var radius = Math.random() * 2 + 1;
		var color = colors[Math.floor(Math.random() * colors.length)];
		var x = Math.random() * (innerWidth - radius * 2) + radius;
		var y = Math.random() * (innerHeight - radius * 2) + radius;
		starsArray.push(new Star(x, y, radius, color));
	}
	animateStars();
}

// init main board
var mainInit = function() {
	createStack();
	drawGrid();

	//add keydown event to current falling stack
	$(document).on('keydown', function(e) { 
		thisStack.moveStack(e, e.keyCode);
	});

	// start the drop interval
	dropInterval = setInterval(function() {
		thisStack.drop();
	}, dropSpeed);

	// reset score/speed displays
	$('.player1-score .display').html((player1Score < 10) ? '0' + player1Score : player1Score);
	$('.player2-score .display').html((player2Score < 10) ? '0' + player2Score : player1Score);
	$('.speed-container .display').html(speedCount);

	// interval to update time on page
	// calls speedUp function every 30 seconds
	let minutes = 0;
	timerInterval = setInterval(function() {
		timer++;
		if(timer === 30 || timer === 60) {
			speedUp();
		}
		if(timer === 60) {
			minutes++;
			timer = 0;
		}
		$('.timer-container .display').html(minutes + ':' + ((timer < 10) ? '0' + timer : timer));
	}, 1000);
}

$(document).ready(function() {
	bgInit(); // init the bg-canvas stars

	$('.game-intro').hide().show('puff', 1200, function(){
		// add click events to intro btns after intro fades in
		$('#instructions-btn').click(function() {
			$('.game-intro').hide();
			$('.instructions-container').fadeIn(500);
		});

		$('#start-btn').click(function() {
			$('#game-entrance-sound')[0].play();
			$('.game-intro').hide('puff', 900);
			$('.game-intro-container').hide('clip', 900, function() {
				$('.game-page-container').show('scale', 1000, function() {
					$('#ambience')[0].play();
					// fade in ready-container after rest of game page appears
					$('#ready-container').fadeIn(500);
				});
			});
		});
	});

	// add click to begin game button in ready-container
	$('#begin-btn').click(function() {
		$('#ready-container').fadeOut();
		$('#board-canvas').show('scale', 1000, function() {
			// initiate game once board canvas appears
			mainInit();
		});
	});

	// instructions back btn
	$('#back-btn').click(function() {
		$('.instructions-container').hide();
		$('.game-intro').fadeIn(500);
	});

	// resize bg-canvas and redraw stars when window size changes
	$(window).resize(function() {
		bgInit();
	});
});