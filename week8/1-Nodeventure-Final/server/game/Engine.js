var world = [];

var EventEmitter = require('events').EventEmitter,
	util = require('util');

function Engine(websocketServer) {
	EventEmitter.call(this);

	this.world = world;
	this.server = websocketServer;
	this.createDefaultZone();
}
util.inherits(Engine, EventEmitter);

Engine.prototype.addUnit = function() {
	world[this.zone][this.cellX][this.cellY].units.push(unit);
	this.emit("newUnit", unit);
};

Engine.prototype.createDefaultZone = function() {
	this.zone = 0;
	this.cellX = 0;
	this.cellY = 0;

	world[this.zone] = [];
	world[this.zone][this.cellX] = [];
	world[this.zone][this.cellX][this.cellY] = {
		units: []
	}
};

Engine.prototype.worldToGridCoordinates = function(x, y, gridsize) {
	if (gridsize % 2 != 0) {
		console.error("gridsize not dividable by 2!");
	}

	var gridHalf = gridsize / 2;

	x = Math.floor((x + gridHalf) / gridsize);
	y = Math.floor((y + gridHalf) / gridsize);

	return {
		x: x,
		y: y
	};
};

Engine.prototype.gridToWorldCoordinates = function(x, y, gridsize) {
	if (gridsize % 2 != 0) {
		console.error("gridsize not dividable by 2!");
	}

	x = (x * gridsize);
	y = (y * gridsize);

	return {
		x: x,
		y: y
	};
}

module.exports = Engine;