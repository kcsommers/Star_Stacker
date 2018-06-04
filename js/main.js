var board = $('#canvas')[0];
var ctx = board.getContext('2d');
board.width = 300;
board.height = 650;

// ************************ //
// ******* Main grid ****** //

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

// push lines into array
for(let i = 0; i < 14; i++) {
	horizArray.push(new Horizontal(xH, yH, xH + (50 * 6), yH));
	yH += 50;
}

for(let i = 0; i < 7; i++) {
	vertArray.push(new Vertical(xV, yV, xV, yV + (50 * 13)));
	xV += 50;
}

var init = function() {
	// draw grid
	horizArray.forEach(function(line) {
		line.draw();
	});

	vertArray.forEach(function(line) {
		line.draw();
	});
}

$(document).ready(function() {
	init();
});

