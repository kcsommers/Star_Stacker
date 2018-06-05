// canvas stuff
var board = $('#canvas')[0];
var ctx = board.getContext('2d');
board.width = 300;
board.height = 650;


// Column variables
var gemColors = ['salmon', 'rebeccapurple', 'lightblue'];
var columnsArray = [];
var columnCounter = 0;
var animateInterval, thisColumn, currentGridCol, currentGridRow;

// ************************ //
// ******* Main grid ****** //

var gridColumns = [{
	id: 0,
	leftY: 0,
	bottomX: 650,
	squares: {0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 
	7: null, 8: null, 9: null, 10: null, 11: null, 12: null} 
},
{
	id: 1,
	leftY: 50,
	bottomX: 650,
	squares: {0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 
	7: null, 8: null, 9: null, 10: null, 11: null, 12: null}
},
{
	id: 2,
	leftY: 100,
	bottomX: 650,
	squares: {0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 
	7: null, 8: null, 9: null, 10: null, 11: null, 12: null}
}, 
{
	id: 3,
	leftY: 150,
	bottomX: 650,
	squares: {0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 
	7: null, 8: null, 9: null, 10: null, 11: null, 12: null}
}, 
{
	id: 4,
	leftY: 200,
	bottomX: 650,
	squares: {0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 
	7: null, 8: null, 9: null, 10: null, 11: null, 12: null}
}, 
{
	id: 5,
	leftY: 250,
	bottomX: 650,
	squares: {0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 
	7: null, 8: null, 9: null, 10: null, 11: null, 12: null}
}];

var gridRows = [{
	id: 0,
	bottomX: 650,
	squares: {0: null, 1: null, 2: null, 3: null, 4: null, 5: null}  
},
{
	id: 1,
	bottomX: 600,
	squares: {0: null, 1: null, 2: null, 3: null, 4: null, 5: null}
},
{
	id: 2,
	bottomX: 550 ,
	squares: {0: null, 1: null, 2: null, 3: null, 4: null, 5: null}
}, 
{
	id: 3,
	bottomX: 500,
	squares: {0: null, 1: null, 2: null, 3: null, 4: null, 5: null}
}, 
{
	id: 4,
	bottomX: 450,
	squares: {0: null, 1: null, 2: null, 3: null, 4: null, 5: null}
}, 
{
	id: 5,
	bottomX: 400,
	squares: {0: null, 1: null, 2: null, 3: null, 4: null, 5: null}
},
{
	id: 6,
	bottomX: 350,
	squares: {0: null, 1: null, 2: null, 3: null, 4: null, 5: null}
},
{
	id: 7,
	bottomX: 300,
	squares: {0: null, 1: null, 2: null, 3: null, 4: null, 5: null}
},
{
	id: 8,
	bottomX: 250 ,
	squares: {0: null, 1: null, 2: null, 3: null, 4: null, 5: null}
}, 
{
	id: 9,
	bottomX: 200,
	squares: {0: null, 1: null, 2: null, 3: null, 4: null, 5: null}
}, 
{
	id: 10,
	bottomX: 150,
	squares: {0: null, 1: null, 2: null, 3: null, 4: null, 5: null}
}, 
{
	id: 11,
	bottomX: 100,
	squares: {0: null, 1: null, 2: null, 3: null, 4: null, 5: null}
},
{
	id: 12,
	bottomX: 100,
	squares: {0: null, 1: null, 2: null, 3: null, 4: null, 5: null}
}];
var horizArray = [];
var vertArray = [];
var xH = 0;
var yH = 0;
var xV = 0;
var yV = 0;

// horizontal line object
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

//vertical line object
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


// ***************************** //
// ******* Create Columns ****** //

// gem object
var Gem = function(x, y, radius, color) {
	this.x = x;
	this.y = y;
	this.radius = radius;
	this.color = color;
	this.draw = function() {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		ctx.fillStyle = this.color;
		ctx.fill();
	};
};

// column object
var Column = function(x, y) {
	thisColumn = this;
	this.x = x;
	this.y = y;
	this.gem1 = new Gem(this.x, this.y, 25, gemColors[Math.floor(Math.random() * gemColors.length)]);
	this.gem2 = new Gem(this.x, this.y + 50, 25, gemColors[Math.floor(Math.random() * gemColors.length)]);
	this.gem3 = new Gem(this.x, this.y + 100, 25, gemColors[Math.floor(Math.random() * gemColors.length)]);
	this.top = this.gem1.y - 25;
	this.bottom = this.gem3.y + 25;
	this.left = this.x - 25;

	this.drawColumns = function() {
		ctx.clearRect(0, 0, innerWidth, innerHeight);
		drawGrid();
		for(let i = 0; i < columnsArray.length; i++) {
			columnsArray[i].gem1.draw();
			columnsArray[i].gem2.draw();
			columnsArray[i].gem3.draw();
		}
		gridRowsChecker(thisColumn);
		gridColumnChecker(thisColumn);
	};

	this.drop = function() {
		// current column drops if its bottom is less than current gridColumn bottom
		if(this.bottom < gridColumns[currentGridCol].bottomX) {
			this.y += 25;
			this.bottom += 25;
			this.top += 25;
			this.gem1.y += 25;
			this.gem2.y += 25;
			this.gem3.y += 25;
			this.drawColumns();
		}
		else { // this is all the info that needs to be collected 
				// when column is done falling
			gridColumns[currentGridCol].bottomX -= 150;
			this.gem1.column = currentGridCol;
			this.gem2.column = currentGridCol;
			this.gem3.column = currentGridCol;

			// if gem1 is on top
			if(this.y === this.gem1.y) {
				gridColumns[currentGridCol].squares[currentGridRow] = this.gem3;
				gridColumns[currentGridCol].squares[currentGridRow + 1] = this.gem2;
				gridColumns[currentGridCol].squares[currentGridRow + 2] = this.gem1;

				gridRows[currentGridRow].squares[currentGridCol] = this.gem3;
				gridRows[currentGridRow + 1].squares[currentGridCol] = this.gem2;
				gridRows[currentGridRow + 2].squares[currentGridCol] = this.gem1;

				this.gem3.row = currentGridRow;
				this.gem2.row = currentGridRow + 1;
				this.gem1.row = currentGridRow + 2;

			} // if gem3 is on top
			else if(this.y === this.gem3.y) {
				gridColumns[currentGridCol].squares[currentGridRow] = this.gem2;
				gridColumns[currentGridCol].squares[currentGridRow + 1] = this.gem1;
				gridColumns[currentGridCol].squares[currentGridRow + 2] = this.gem3;

				gridRows[currentGridRow].squares[currentGridCol] = this.gem2;
				gridRows[currentGridRow + 1].squares[currentGridCol] = this.gem1;
				gridRows[currentGridRow + 2].squares[currentGridCol] = this.gem3;

				this.gem2.row = currentGridRow;
				this.gem1.row = currentGridRow + 1;
				this.gem3.row = currentGridRow + 2;
			}
			else { // if gem2 is  on top
				gridColumns[currentGridCol].squares[currentGridRow] = this.gem1;
				gridColumns[currentGridCol].squares[currentGridRow + 1] = this.gem3;
				gridColumns[currentGridCol].squares[currentGridRow + 2] = this.gem2;

				gridRows[currentGridRow].squares[currentGridCol] = this.gem1;
				gridRows[currentGridRow + 1].squares[currentGridCol] = this.gem3;
				gridRows[currentGridRow + 2].squares[currentGridCol] = this.gem2;

				this.gem1.row = currentGridRow;
				this.gem3.row = currentGridRow + 1;
				this.gem2.row = currentGridRow + 2;
			}
			console.log(thisColumn);
			checkMatches(thisColumn);	
			// create new column
			columnCounter += 1;
			createColumn();
		}
	};

	this.move = function(e) {
		switch(e.keyCode) {
			case 38:
				this.changeOrder();
				break;
			case 39: // if its not in the last column
				if(currentGridCol < 5) {
					// if the squares in the next column are empty
					if(!gridColumns[currentGridCol + 1].squares[currentGridRow]) {
						this.x += 50;
						this.gem1.x += 50;
						this.gem2.x += 50;
						this.gem3.x += 50;
						this.left += 50;
						this.drawColumns();
					}
				}
				break;
			case 37: // if its not in the first column
				if(currentGridCol > 0) {
					// if the squares in the previous column are empty
					if(!gridColumns[currentGridCol - 1].squares[currentGridRow]) {
						this.x -= 50;
						this.gem1.x -= 50;
						this.gem2.x -= 50;
						this.gem3.x -= 50;
						this.left -= 50;
						this.drawColumns();
					}
				}
				break;
			case 40:
				this.drop();
				break;
		}
	};

	this.changeOrder = function() {	
		if(this.y === this.gem1.y) {
			this.gem1.y += 50;
			this.gem2.y += 50;
			this.gem3.y -= 100;
		}
		else if(this.y === this.gem3.y) {
			this.gem1.y += 50;
			this.gem2.y -= 100;
			this.gem3.y += 50;
		}
		else {
			this.gem1.y -= 100;
			this.gem2.y += 50;
			this.gem3.y += 50;
		}
		this.drawColumns();
	};
};

// determine which gridColumn the current Column object is in
// so that the appropriate gridColumn object's bottom can be updated
var gridColumnChecker = function(col) {
	if(col.left === 0) currentGridCol = 0;
	else if(col.left === 50) currentGridCol = 1;
	else if(col.left === 100) currentGridCol = 2;
	else if(col.left === 150) currentGridCol = 3;
	else if(col.left === 200) currentGridCol = 4;
	else if(col.left === 250) currentGridCol = 5;
};

var gridRowsChecker = function(col) {
	if(col.bottom === 650) currentGridRow = 0;
	else if(col.bottom === 600) currentGridRow = 1;
	else if(col.bottom === 550) currentGridRow = 2;
	else if(col.bottom === 500) currentGridRow = 3;
	else if(col.bottom === 450) currentGridRow = 4;
	else if(col.bottom === 400) currentGridRow = 5;
	else if(col.bottom === 350) currentGridRow = 6;
	else if(col.bottom === 300) currentGridRow = 7;
	else if(col.bottom === 250) currentGridRow = 8;
	else if(col.bottom === 200) currentGridRow = 9;
	else if(col.bottom === 150) currentGridRow = 10;
	else if(col.bottom === 100) currentGridRow = 11;
};

var createColumn = function() {
	columnsArray.push(new Column(175, -125));
	columnsArray[columnCounter].drawColumns();
};

// ******************************* //

var checkMatches = function(col) {

};

var init = function() {
	// draw grid
	drawGrid();
	// create column
	createColumn();
	// start drop interval;
	animateInterval = setInterval(function() {
		thisColumn.drop();
	}, 500);
};

$(document).ready(function() {
	init();
	// add arrow key event listener to document
	$(document).on('keydown', function(e) {
		thisColumn.move(e);
	});
});

