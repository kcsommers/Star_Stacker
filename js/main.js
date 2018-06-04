// canvas stuff
var board = $('#canvas')[0];
var ctx = board.getContext('2d');
board.width = 300;
board.height = 650;


// Column variables
var gemColors = ['salmon', 'rebeccapurple', 'lightblue'];
var columnsArray = [];
var columnCounter = 0;
var animateInterval, thisColumn;

// ************************ //
// ******* Main grid ****** //

var gridColumns = [{
	name: 'col1',
	leftY: 0,
	rightY: 50,
	bottomX: 650,
	pieces: []  
},
{
	name: 'col2',
	leftY: 50,
	rightY: 100,
	bottomX: 650,
	pieces: []
},
{
	name: 'col3',
	leftY: 100,
	rightY: 150,
	bottomX: 650,
	pieces: []
}, 
{
	name: 'col4',
	leftY: 150,
	rightY: 200,
	bottomX: 650,
	pieces: []
}, 
{
	name: 'col5',
	leftY: 200,
	rightY: 250,
	bottomX: 650,
	pieces: []
}, 
{
	name: 'col6',
	leftY: 250,
	rightY: 300,
	bottomX: 650,
	pieces: []
}];

var gridRows = [{
	name: 'row1',
	bottomX: 650,
	topX: 600,
	pieces: []  
},
{
	name: 'row2',
	bottomX: 600,
	topX: 550,
	pieces: []
},
{
	name: 'row3',
	bottomX: 550 ,
	topX: 500,
	pieces: []
}, 
{
	name: 'row4',
	bottomX: 500,
	topX: 450,
	pieces: []
}, 
{
	name: 'row5',
	bottomX: 450,
	topX: 400,
	pieces: []
}, 
{
	name: 'row6',
	bottomX: 400,
	topX: 350,
	pieces: []
},
{
	name: 'row7',
	bottomX: 350,
	topX: 300,
	pieces: []  
},
{
	name: 'row8',
	bottomX: 300,
	topX: 250,
	pieces: []
},
{
	name: 'row9',
	bottomX: 250 ,
	topX: 200,
	pieces: []
}, 
{
	name: 'row10',
	bottomX: 200,
	topX: 150,
	pieces: []
}, 
{
	name: 'row11',
	bottomX: 150,
	topX: 100,
	pieces: []
}, 
{
	name: 'row12',
	bottomX: 100,
	topX: 50,
	pieces: []
},
{
	name: 'row13',
	bottomX: 100,
	topX: 50,
	pieces: []
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
	this.top = this.gem1.y + 25;
	this.bottom = this.gem3.y + 25;

	this.drawColumns = function() {
		ctx.clearRect(0, 0, innerWidth, innerHeight);
		drawGrid();
		for(let i = 0; i < columnsArray.length; i++) {
			columnsArray[i].gem1.draw();
			columnsArray[i].gem2.draw();
			columnsArray[i].gem3.draw();
		}
	};

	this.drop = function() {
		this.y += 25;
		this.gem1.y += 25;
		this.gem2.y += 25;
		this.gem3.y += 25;
		this.drawColumns();
	};

	this.move = function(e) {
		switch(e.keyCode) {
			case 38:
				this.changeOrder();
				break;
			case 39:
				this.x += 50;
				this.gem1.x += 50;
				this.gem2.x += 50;
				this.gem3.x += 50;
				this.drawColumns();
				break;
			case 37:
				this.x -= 50;
				this.gem1.x -= 50;
				this.gem2.x -= 50;
				this.gem3.x -= 50;
				this.drawColumns();
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
	}

};

var createColumn = function() {
	columnsArray.push(new Column(25, 25));
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
	console.log(thisColumn);
	// add arrow key event listener to document
	$(document).on('keydown', function(e) {
		thisColumn.move(e);
	});
});

