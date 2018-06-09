// canvas stuff
var board = $('#canvas')[0];
var ctx = board.getContext('2d');
board.width = 300;
board.height = 650;

var gemColors = ['salmon', 'rebeccapurple', 'lightblue'];
var stackArray = [];
var match = false;
var stackCount = 0;
var thisStack;
var currColumn = 3;
var currRow = 14;
var matchCount = 0;
var player1Score = 0;
var player2Score = 0;
var player1Turn = true;
var dropInterval, timerInterval, hangersInterval;	
var speed = 400;
var max = 0;
var timer = 0;

// ************************ //
// ******* Main grid ****** //

var horizArray = [];
var vertArray = [];
var xH = 0;
var yH = 0;
var xV = 0;
var yV = 0;
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
// horizontal grid line object
var Horizontal = function(x, y, dx, dy) {
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	this.draw = function() {
		ctx.beginPath();
		ctx.moveTo(this.x, this.y);
		ctx.lineTo(this.dx, this.dy);
		ctx.stroke();
	};
};
//vertical grid line object
var Vertical = function(x, y, dx, dy) {
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	this.draw = function() {
		ctx.beginPath();
		ctx.moveTo(this.x, this.y);
		ctx.lineTo(this.dx, this.dy);
		ctx.stroke();
	};
};

var drawGrid = function() {
	// draw grid
	horizArray.forEach(function(line) {line.draw();});
	vertArray.forEach(function(line) {line.draw();});
}
// push lines into array
for(let i = 0; i < 14; i++) {
	horizArray.push(new Horizontal(xH, yH, xH + (50 * 6), yH));
	yH += 50;
}
for(let i = 0; i < 7; i++) {
	vertArray.push(new Vertical(xV, yV, xV, yV + (50 * 13)));
	xV += 50;
}

var Gem = function(x, y, radius, color) {
	thisGem = this;
	this.x = x;
	this.y = y;
	this.radius = radius;
	this.color = color;
	this.falling = true;
	this.draw = function() {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		ctx.fillStyle = this.color;
		ctx.fill();
	}
};

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
		ctx.clearRect(0, 0, innerWidth, innerHeight);
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

var scoreKeeper = function(matchArr, matchCount) {
	let total = 0;
	if(matchCount === 1) {
		if(matchArr.length === 3) total += 10;
		else if(matchArr.length === 4) total += 15;
		else if(matchArr.length >= 5) total += 20;
	} 
	else if(matchCount === 2) total += 20;
	else if(matchCount >= 3) total += 30;
	player1Turn ? player1Score += total : player2Score += total;
};

// let intervalsArr = [];
// var dropHangers = function(hangingGems) {
	
// 	let hangingStacks = [];
// 	hangingGems.forEach(function(gem1, i) {
// 		let colGems = [gem1];
// 		let x = 1;
// 		while( gridColumns[gem1.column].rows[gem1.row + x] ) {
// 			colGems.push(gridColumns[gem1.column].rows[gem1.row + x]);
// 			x++;}
// 		colGems.forEach((gem2) => {
// 			gem2.dropDistance = (gridColumns[gem1.column].bottom - (gem1.y + 25)) + (50 * colGems.length);
// 		});
// 		hangingStacks.push(colGems);
// 	});

// 	let allHangers = hangingStacks.reduce((acc, curr) => {return acc.concat(curr)}, []);

// 	allHangers.forEach((gem, i) => {
// 		gridColumns[gem.column].rows[gem.row] = null;

// 		let counter = 0;
// 		intervalsArr.push(setInterval(function() {

// 			if(counter < (gem.dropDistance / 5)) {
// 				gem.y += 5;
// 				counter++;
// 			}
// 			else {
// 				clearInterval(intervalsArr[i]);
// 				gem.row = rowChecker(gem.y + 25);
// 				gridColumns[gem.column].rows[gem.row] = gem;
// 				checkMatches(allHangers);
// 				allHangers.length = 0;
// 			}

// 			ctx.clearRect(0, 0, innerWidth, innerHeight);
// 			drawGrid();
// 			gem.draw();
// 			thisStack.drawStack();
// 		}));
// 	});

	// hangersInterval = setInterval(function() {
	// 	allHangers.forEach(function(gem) {
	// 		let counter = 0;
	// 		if(counter < gem.dropDistance / 5) {
	// 			gem.y += 5;
	// 			counter++;
	// 			console.log(gem.y, counter, gem.dropDistance / 5)
	// 		}
	// 	});

	// 	ctx.clearRect(0, 0, innerWidth, innerHeight);
	// 	drawGrid();
	// 	allHangers.forEach(function(gem) {gem.draw();});
	// 	thisStack.drawStack();
	// }, 50);


	// let intervals = [];
	// hangingStacks.forEach(function(stack) {
	// 	for(let i = 0; i < stack.length; i++) {
	// 		gridColumns[stack[i].column].rows[stack[i].row] = null;

	// 		intervals.push(setInterval(function() {
	// 			if(stack[0].y + 25 < gridColumns[stack[0].column].bottom + (50 * stack.length)) {
	// 				stack.forEach(function(gem) {
	// 					gem.y += 5;
	// 				});
	// 			}
	// 			else {
	// 				clearInterval(intervals[i]);
	// 				stack[i].row = rowChecker(stack[i].y + 25);
	// 				gridColumns[stack[i].column].rows[stack[i].row] = stack[i];
	// 				console.log(gridColumns);
	// 				checkMatches(stack); 
	// 			}
	// 			ctx.clearRect(0, 0, innerWidth, innerHeight);
	// 			drawGrid();
	// 			stack.forEach(function(gem) {gem.draw();});
	// 			thisStack.drawStack();
	// 		}, 50));
	// 	}
	// });
// };

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
			ctx.clearRect(0, 0, innerWidth, innerHeight);
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

	if(hangingGems.length) {
		clearInterval(dropInterval);
		dropHangers(hangingGems, spaceObj);
	};
}

// var removeGems = function(matchesArr) {
// 	let hangingGems = []; 
// 	matchesArr.forEach(function(gem) {	
// 		gridColumns[gem.column].rows[gem.row] = null;
// 		console.log(gridColumns[gem.column].rows[gem.row]);
// 		gridColumns[gem.column].bottom += 50;
// 		delete stackArray[gem.stackId][gem.gemId];
// 		if( gridColumns[gem.column].rows[gem.row + 1] ) {
// 			hangingGems.push(gridColumns[gem.column].rows[gem.row + 1]);
// 		}
// 		gem = null;
// 	});
// 	console.log('second matchArr: ', matchesArr);
// 	if(hangingGems.length){
// 		clearInterval(dropInterval);
// 		dropHangers(hangingGems);
// 	} 
// };

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
	if(matches.length) removeGems(matches);
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

var init = function() {
	drawGrid();
	createStack();
	dropInterval = setInterval(function() {
		thisStack.drop();
	}, speed);
}

$(document).ready(function() {
	init();
	$(document).on('keydown', function(e) {
		thisStack.moveStack(e, e.keyCode);
	});
});