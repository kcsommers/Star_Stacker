//***** background-canvas
var bgCanvas = $('#bg-canvas')[0];
var bgCtx = bgCanvas.getContext('2d');
var starsArray = [];
var colors = ['#f3f086', '#e0e9f3', '#f3ddd9', 
'#f3a19b', '#96d6f3', '#909292', '#aaacac', 
'#e0e3e3', '#edefef', '#ffffff', '#ffffff', 
'#ffffff', '#ffffff', '#ffffff', '#bf81f2', '#ffffff'];
var animateStars, animationFrame;

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
  	if(this.radius > 1.5) this.radius -= 0.01;
  	else this.radius += 1;
    this.drawStar();
  };
};

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
		boardCtx.shadowColor = 'black';
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

var drawGrid = function() {
	horizArray.forEach(function(line) {line.draw();});
	vertArray.forEach(function(line) {line.draw();});
}


//***** Global variables
var gemColors = ['#e73854', '#537bff', '#fff855'];
var stackArray = [];
var match = false;
var player1Turn = true;
var player1Score = 0;
var player2Score = 0;
var stackCount = 0;
var currColumn = 3;
var currRow = 14;
var matchCount = 0;	
var dropSpeed = 300;
var speedCount = 1;
var timer = 0;
var thisStack, dropInterval, timerInterval, hangersInterval;	

// board/grid columns
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

// Gem object
var Gem = function(x, y, radius, color) {
	thisGem = this;
	this.x = x;
	this.y = y;
	this.radius = radius;
	this.color = color;
	this.falling = true;
	this.draw = function() {
		boardCtx.beginPath();
		boardCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		boardCtx.fillStyle = this.color;
		boardCtx.fill();
		boardCtx.shadowOffsetX = 4;
		boardCtx.shadowOffsetY = 8;
		boardCtx.shadowBlur = 7;
		boardCtx.shadowColor = 'black';
	}
};

// Stack object (made of three Gems)
var Stack = function(x, y, id) {
	thisStack = this;
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
		stackArray.forEach((stack) => {
			if( stack.hasOwnProperty('gem1') ) stack.gem1.draw();
			if( stack.hasOwnProperty('gem2') ) stack.gem2.draw();
			if( stack.hasOwnProperty('gem3') ) stack.gem3.draw();
		});
	};
	this.drop = function() {
		if(this.bottom < gridColumns[currColumn].bottom) {
			this.y += 25;
			this.bottom += 25;
			this.gem1.y += 25;
			this.gem2.y += 25;
			this.gem3.y += 25;
			this.drawStack();
		}
		else {
			currRow = rowChecker(this.bottom);
			gridColumns[currColumn].bottom -= 150;
			this.gem1.column = currColumn;
			this.gem2.column = currColumn;
			this.gem3.column = currColumn;
			if(this.y === this.gem1.y) {
				gridColumns[currColumn].rows[currRow + 2] = this.gem1;
				gridColumns[currColumn].rows[currRow + 1] = this.gem2;
				gridColumns[currColumn].rows[currRow] = this.gem3;

				this.gem1.row = currRow + 2;
				this.gem2.row = currRow + 1;
				this.gem3.row = currRow;
			}
			else if(this.y === this.gem2.y) {
				gridColumns[currColumn].rows[currRow] = this.gem1;
				gridColumns[currColumn].rows[currRow + 2] = this.gem2;
				gridColumns[currColumn].rows[currRow + 1] = this.gem3;

				this.gem1.row = currRow;
				this.gem2.row = currRow + 2;
				this.gem3.row = currRow + 1;
			}
			else {
				gridColumns[currColumn].rows[currRow + 1] = this.gem1;
				gridColumns[currColumn].rows[currRow] = this.gem2;
				gridColumns[currColumn].rows[currRow + 2] = this.gem3;

				this.gem1.row = currRow + 1;
				this.gem2.row = currRow;
				this.gem3.row = currRow + 2;
			}
			checkMatches([this.gem1, this.gem2, this.gem3]);
			stackCount++;
			createStack();
		}
	};
	this.moveStack = function(e, keyCode) {
		switch(keyCode) {
			case 37:
				if(currColumn > 0) {
					this.gem1.x -= 50;
					this.gem2.x -= 50;
					this.gem3.x -= 50;
					this.left -= 50;
					currColumn = columnChecker(this.left);
					this.drawStack();
				}
				break;
			case 38:
				e.preventDefault();
				let gem1Temp = this.gem1.y
				this.gem1.y = this.gem2.y;
				this.gem2.y = this.gem3.y;
				this.gem3.y = gem1Temp;
				this.drawStack();
				break;	
			case 39:
				if(currColumn < 5) {
					this.gem1.x += 50;
					this.gem2.x += 50;
					this.gem3.x += 50;
					this.left += 50;
					currColumn = columnChecker(this.left);
					this.drawStack();
				} 
				break;
			case 40:
				e.preventDefault();
				this.drop();
		}
	};
};


//***** Functions

// scorekeeping
var scoreKeeper = function(matchArr, matchCount) {
	let pointsTotal = 0;
	let i = 0;
	let scoreDisplay = player1Turn ? $('.player1-score .display') : $('.player2-score .display');
	if(matchCount === 1) {
		if(matchArr.length === 3) pointsTotal += 10;
		else if(matchArr.length === 4) pointsTotal += 15;
		else if(matchArr.length >= 5) pointsTotal += 20;
	} 
	else if(matchCount === 2) pointsTotal += 20;
	else if(matchCount >= 3) pointsTotal += 30;
	let scoreInterval = setInterval(function() {
		if(i < pointsTotal) {
			if(player1Turn) {
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

// game logic
var switchTurns = function() {
	player1Turn = !player1Turn;
	// empty stack array
	stackArray.forEach((stack) => {stack = null;});
	stackArray.length = 0;

	stackCount = 0;
	currColumn = 3;
	currRow = 14;
	matchCount = 0;	
	dropSpeed = 300;
	maxSpeed = 0;
	timer = 0;

	// clear the board, reset column bottom
	gridColumns.forEach(function(col) {
		col.bottom = 650;
		for(let square in col.rows) {
			square = null;
		}
	});


}


var dropHangers = function(hangersArr, spaceObj) {
	let intervalsArr = [];
	hangersArr.forEach((gem, i) => {

		gridColumns[gem.column].rows[gem.row] = null;
		let yCount = 0;
		intervalsArr.push(setInterval(function() {
			if( yCount < (spaceObj[gem.column] / 5) ) {
				console.log('tick');
				gem.y += 5;
				yCount++;
			} 
			else {	
				clearInterval(intervalsArr[i]);
				gem.row = rowChecker(gem.y + 25);
				gridColumns[gem.column].rows[gem.row] = gem;
				console.log('clear');
			}
			boardCtx.clearRect(0, 0, innerWidth, innerHeight);
			drawGrid();
			gem.draw();
			thisStack.drawStack();
		}, 10));
	});
};

var removeGems = function(matchesArr) {
	let hangingGems = [];
	let allHangers = [];
	let spaceObj = {0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0};
	matchesArr.forEach(function(gem) {
		gridColumns[gem.column].rows[gem.row] = null;
		gridColumns[gem.column].bottom += 50;
		delete stackArray[gem.stackId][gem.gemId];
		if(gridColumns[gem.column].rows[gem.row + 1]) {
			hangingGems.push(gridColumns[gem.column].rows[gem.row + 1]);
		}
		gem = null;
	});
	hangingGems.forEach((gem) => {
		let j = 1;
		while( gridColumns[gem.column].rows[gem.row - j] >= 0
			&& !gridColumns[gem.column].rows[gem.row - j] ) {
			spaceObj[gem.column] += 50;
			j++;
		}

		let i = 1;
		while( gridColumns[gem.column].rows[gem.row + i] ) {
			hangingGems.push(gridColumns[gem.column].rows[gem.row + i]);
			i++;
		} 
	});

	if(hangingGems.length) dropHangers(hangingGems, spaceObj);
};

var checkMatches = function(stack) {
	let matches = [];
	stack.forEach((gem, i) => {
		let gemColumn = gem.column;
		let gemRow = gem.row;
		let color = gem.color;
		let column = gridColumns[gemColumn];
		let rows = column.rows;

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

		// column bottom (searching down)
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

		matches = matches.filter((item, index, arr) => {return arr.indexOf(item) === index;});
	});
	if(matches.length) {
		removeGems(matches);
		matchCount++;
		scoreKeeper(matches, matchCount);
	}
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
	if(num === 650) return 0;
	else if(num === 600) return 1;
	else if(num === 550) return 2;
	else if(num === 500) return 3;
	else if(num === 450) return 4;
	else if(num === 400) return 5;
	else if(num === 350) return 6;
	else if(num === 300) return 7;
	else if(num === 250) return 8;
	else if(num === 200) return 9;
	else if(num === 150) return 10;
	else if(num === 100) return 11;
};


var createStack = function() {
	currColumn = 3;
	currRow = 12;
	match = false;
	matchCount = 0;
	stackArray.push(new Stack(175, -125, stackCount));
	stackArray[stackCount].drawStack();
};

// stars animation
var animateStars = function() {
  animationFrame = requestAnimationFrame(animateStars);
  bgCtx.clearRect(0, 0, innerWidth, innerHeight);
  
  for(var i = 0; i < starsArray.length; i++){
    starsArray[i].glow();
  }
}

var speedUp = function() {
	speedCount += 1;
	$('.speed-container .display').html(speedCount);
	if(speedCount < 5) {

		if(speedCount > 3) {
			dropSpeed -= 50;
		} 
		else {
			dropSpeed -= 100;
		}

		clearInterval(dropInterval);
		dropInterval = setInterval(function() {
			thisStack.drop();
		}, dropSpeed); 
	}
}

// initialize bg-canvas stars
var bgInit = function(){
	$('.game-intro-container').innerHeight(innerHeight - 10);
	bgCanvas.width = innerWidth - 10;
	bgCanvas.height = innerHeight - 10;
	starsArray = [];
	for(var i = 0; i <= 1500; i++){
		var radius = Math.random() * 2 + 1;
		var color = colors[Math.floor(Math.random() * colors.length)];
		var x = Math.random() * (innerWidth - radius * 2) + radius;
		var y = Math.random() * (innerHeight - radius * 2) + radius;
		starsArray.push(new Star(x, y, radius, color));
	}
	animateStars();
}

// initialize main board
var mainInit = function() {
	createStack();
	dropInterval = setInterval(function() {
		thisStack.drop();
	}, dropSpeed);
	drawGrid();

	$('.speed-container .display').html(speedCount);
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
	bgInit();

	$('.game-intro').hide().show('puff', 1200, function(){
		$('#instructions-btn').click(function() {
			$('.game-intro').hide();
			$('.instructions-container').fadeIn(500);
		});

		$('#start-btn').click(function() {
			$('.game-intro').hide('puff', 1000);
			$('.game-intro-container').hide('clip', 1000, function() {
				$('.game-page-container').show('scale', 1000, function() {
					$('#ready-container').fadeIn(500);
					$(document).on('keydown', function(e) {
						thisStack.moveStack(e, e.keyCode);
					});
				});
			});
		});
	});

	$('#begin-btn').click(function() {
		$('#ready-container').fadeOut();
		$('#board-canvas').show('scale', 1000, function() {
			mainInit();
		});
	});

	$('#back-btn').click(function() {
		$('.instructions-container').hide();
		$('.game-intro').fadeIn(500);
	});

	$(window).resize(function() {
		bgInit();
	});
});