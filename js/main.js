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
	name: 'col0',
	leftY: 0,
	rightY: 50,
	bottomX: 650,
	squares: {0: '', 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 
	7: '', 8: '', 9: '', 10: '', 11: '', 12: ''} 
},
{
	name: 'col1',
	leftY: 50,
	rightY: 100,
	bottomX: 650,
	squares: {0: '', 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 
	7: '', 8: '', 9: '', 10: '', 11: '', 12: ''}
},
{
	name: 'col2',
	leftY: 100,
	rightY: 150,
	bottomX: 650,
	squares: {0: '', 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 
	7: '', 8: '', 9: '', 10: '', 11: '', 12: ''}
}, 
{
	name: 'col3',
	leftY: 150,
	rightY: 200,
	bottomX: 650,
	squares: {0: '', 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 
	7: '', 8: '', 9: '', 10: '', 11: '', 12: ''}
}, 
{
	name: 'col4',
	leftY: 200,
	rightY: 250,
	bottomX: 650,
	squares: {0: '', 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 
	7: '', 8: '', 9: '', 10: '', 11: '', 12: ''}
}, 
{
	name: 'col5',
	leftY: 250,
	rightY: 300,
	bottomX: 650,
	squares: {0: '', 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 
	7: '', 8: '', 9: '', 10: '', 11: '', 12: ''}
}];

var gridRows = [{
	name: 'row0',
	bottomX: 650,
	topX: 600,
	squares: {0: '', 1: '', 2: '', 3: '', 4: '', 5: ''}  
},
{
	name: 'row1',
	bottomX: 600,
	topX: 550,
	squares: {0: '', 1: '', 2: '', 3: '', 4: '', 5: ''}
},
{
	name: 'row2',
	bottomX: 550 ,
	topX: 500,
	squares: {0: '', 1: '', 2: '', 3: '', 4: '', 5: ''}
}, 
{
	name: 'row3',
	bottomX: 500,
	topX: 450,
	squares: {0: '', 1: '', 2: '', 3: '', 4: '', 5: ''}
}, 
{
	name: 'row4',
	bottomX: 450,
	topX: 400,
	squares: {0: '', 1: '', 2: '', 3: '', 4: '', 5: ''}
}, 
{
	name: 'row5',
	bottomX: 400,
	topX: 350,
	squares: {0: '', 1: '', 2: '', 3: '', 4: '', 5: ''}
},
{
	name: 'row6',
	bottomX: 350,
	topX: 300,
	squares: {0: '', 1: '', 2: '', 3: '', 4: '', 5: ''}
},
{
	name: 'row7',
	bottomX: 300,
	topX: 250,
	squares: {0: '', 1: '', 2: '', 3: '', 4: '', 5: ''}
},
{
	name: 'row8',
	bottomX: 250 ,
	topX: 200,
	squares: {0: '', 1: '', 2: '', 3: '', 4: '', 5: ''}
}, 
{
	name: 'row9',
	bottomX: 200,
	topX: 150,
	squares: {0: '', 1: '', 2: '', 3: '', 4: '', 5: ''}
}, 
{
	name: 'row10',
	bottomX: 150,
	topX: 100,
	squares: {0: '', 1: '', 2: '', 3: '', 4: '', 5: ''}
}, 
{
	name: 'row11',
	bottomX: 100,
	topX: 50,
	squares: {0: '', 1: '', 2: '', 3: '', 4: '', 5: ''}
},
{
	name: 'row12',
	bottomX: 100,
	topX: 50,
	squares: {0: '', 1: '', 2: '', 3: '', 4: '', 5: ''}
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
		// if current column bottom is less than current gridColumn bottom
		if(this.bottom < gridColumns[currentGridCol].bottomX) {
			this.y += 25;
			this.bottom += 25;
			this.top += 25;
			this.gem1.y += 25;
			this.gem2.y += 25;
			this.gem3.y += 25;
			this.drawColumns();
		}
		else {
			// update gridColumn/gridRows when column object lands,
			// figure out order of gems before updating
			gridColumns[currentGridCol].bottomX -= 150;
			if(this.y === this.gem1.y) {
				gridColumns[currentGridCol].squares[currentGridRow] = this.gem3.color;
				gridColumns[currentGridCol].squares[currentGridRow + 1] = this.gem2.color;
				gridColumns[currentGridCol].squares[currentGridRow + 2] = this.gem1.color;

				gridRows[currentGridRow].squares[currentGridCol] = this.gem3.color;
				gridRows[currentGridRow + 1].squares[currentGridCol] = this.gem2.color;
				gridRows[currentGridRow + 2].squares[currentGridCol] = this.gem1.color;
			}
			else if(this.y === this.gem3.y) {
				gridColumns[currentGridCol].squares[currentGridRow] = this.gem2.color;
				gridColumns[currentGridCol].squares[currentGridRow + 1] = this.gem1.color;
				gridColumns[currentGridCol].squares[currentGridRow + 2] = this.gem3.color;

				gridRows[currentGridRow].squares[currentGridCol] = this.gem2.color;
				gridRows[currentGridRow + 1].squares[currentGridCol] = this.gem1.color;
				gridRows[currentGridRow + 2].squares[currentGridCol] = this.gem3.color;
			}
			else {
				gridColumns[currentGridCol].squares[currentGridRow] = this.gem1.color;
				gridColumns[currentGridCol].squares[currentGridRow + 1] = this.gem3.color;
				gridColumns[currentGridCol].squares[currentGridRow + 2] = this.gem2.color;

				gridRows[currentGridRow].squares[currentGridCol] = this.gem1.color;
				gridRows[currentGridRow + 1].squares[currentGridCol] = this.gem3.color;
				gridRows[currentGridRow + 2].squares[currentGridCol] = this.gem2.color;
			}	
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
			case 39:
				// if the squares in the next column over are empty
				if(!gridColumns[currentGridCol + 1].squares[currentGridRow]) {
					this.x += 50;
					this.gem1.x += 50;
					this.gem2.x += 50;
					this.gem3.x += 50;
					this.left += 50;
					this.drawColumns();
				}
				break;
			case 37:
				// if the squares in the next column over are empty
				if(!gridColumns[currentGridCol - 1].squares[currentGridRow]) {
					this.x -= 50;
					this.gem1.x -= 50;
					this.gem2.x -= 50;
					this.gem3.x -= 50;
					this.left -= 50;
					this.drawColumns();
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
}

var createColumn = function() {
	columnsArray.push(new Column(175, -125));
	columnsArray[columnCounter].drawColumns();
}

// ******************************* //


var init = function() {
	// draw grid
	drawGrid();
	// create column
	createColumn();
	// start drop interval;
	animateInterval = setInterval(function() {
		thisColumn.drop();
	}, 500);

}

$(document).ready(function() {
	init();

	// add arrow key event listener to document
	$(document).on('keydown', function(e) {
		thisColumn.move(e);
	});
});

