var ns = ns || {};

(function(app) {

	function invertColor(hexTripletColor) {
		var color = hexTripletColor;
		color = color.substring(1); 
		color = parseInt(color, 16); 
		color = 0xFFFFFF ^ color; 
		color = color.toString(16); 
		color = ("000000" + color).slice(-6); 
		color = "#" + color; 
		return color;
	}

	var trianglesStorage = (function() {
		var triangles = [];

		function add(triangle) {
			triangles.push(triangle)
		}

		function empty() {
			triangles = [];
		}

		function toArray() {
			return triangles;
		}

		return {
			"add": add,
			"empty": empty,
			"toArray": toArray
		}
	})();

	function CanvasInstance(id, storage) {
		var that = this;

		this.storage = storage;
		this.canvas = document.getElementById(id);

		this.points = [];

		if (this.canvas.getContext) {
			this.ctx = this.canvas.getContext('2d');
		} else {
			throw Error("Missing Element!");
		}

		this.canvas.addEventListener('click', function(e) {
			x = that.getCursorPosition(e)[0] - this.offsetLeft;
			y = that.getCursorPosition(e)[1] - this.offsetTop;

			var pointsCount = that.addPoint({
				"x": x,
				"y": y
			});

			if (pointsCount === 3) {
				var triangle = that.drawTriangle();
				that.drawAreaText();
				if (that.storage) {
					that.storage.add(triangle);
				}
				that.clearPoints();
			}

		}, false);
	}

	CanvasInstance.prototype.getCursorPosition = function(e) {
		var x;
		var y;

		if (e.pageX != undefined && e.pageY != undefined) {
			x = e.pageX;
			y = e.pageY;
		} else {
			x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}

		return [x, y];
	}

	CanvasInstance.prototype.addPoint = function(point) {
		this.points.push(point);
		return this.points.length;
	}

	CanvasInstance.prototype.clearPoints = function() {
		this.points = [];
	}

	CanvasInstance.prototype.drawTriangle = function(triangle) {
		var fillColor, strokeColor;
		var p0X, p0Y, p1X, p1Y, p2X, p2Y;
		if (triangle) {
			fillColor = triangle.fillColor;
			strokeColor = triangle.strokeColor;
			p0X = triangle.point0.x;
			p0Y = triangle.point0.y;
			p1X = triangle.point1.x;
			p1Y = triangle.point1.y;
			p2X = triangle.point2.x;
			p2Y = triangle.point2.y;
		} else {
			fillColor = getColor();
			strokeColor = fillColor;
			p0X = this.points[0].x;
			p0Y = this.points[0].y;
			p1X = this.points[1].x;
			p1Y = this.points[1].y;
			p2X = this.points[2].x;
			p2Y = this.points[2].y;
		}		

		this.ctx.beginPath();
		this.ctx.fillStyle = fillColor;
		this.ctx.strokeStyle = strokeColor;

		this.ctx.moveTo(p0X, p0Y);
		this.ctx.lineTo(p1X, p1Y);
		this.ctx.lineTo(p2X, p2Y);
		this.ctx.stroke();
		this.ctx.fill();

		return {
			"point0": {
				"x": p0X,
				"y": p0Y
			},
			"point1": {
				"x": p1X,
				"y": p1Y
			},
			"point2": {
				"x": p2X,
				"y": p2Y
			},
			"fillColor": fillColor,
			"strokeColor": strokeColor
		}
	}

	CanvasInstance.prototype.drawAreaText = function(triangle) {
		var p0X, p0Y, p1X, p1Y, p2X, p2Y, d1, d2, d3, p, area, centerX, centerY;
		var fillColor, textColor;
		if (triangle) {
			fillColor = triangle.fillColor;
			p0X = triangle.point0.x;
			p0Y = triangle.point0.y;
			p1X = triangle.point1.x;
			p1Y = triangle.point1.y;
			p2X = triangle.point2.x;
			p2Y = triangle.point2.y;
		} else {
			fillColor = getColor();
			p0X = this.points[0].x;
			p0Y = this.points[0].y;
			p1X = this.points[1].x;
			p1Y = this.points[1].y;
			p2X = this.points[2].x;
			p2Y = this.points[2].y;
		}

		d1 = Math.sqrt(Math.pow(p2X - p0X, 2) + Math.pow(p2Y - p0Y, 2));
		d2 = Math.sqrt(Math.pow(p1X - p0X, 2) + Math.pow(p1Y - p0Y, 2));
		d3 = Math.sqrt(Math.pow(p2X - p1X, 2) + Math.pow(p2Y - p1Y, 2));

		p = (d1 + d2 + d3) / 2;

		area = Math.sqrt(p * (p - d1) * (p - d2) * (p - d3));
		area = (Math.round(area * 100)/100).toFixed(2)		
		textColor = invertColor(fillColor);

		centerX = ((p0X + p1X + p2X) / 3) - (3 * area.toString().length);
		centerY = (p0Y + p1Y + p2Y) / 3;

		this.ctx.beginPath();
		this.ctx.fillStyle = textColor;
	  	this.ctx.font = "bold 16px Arial";
	  	this.ctx.fillText(area, centerX, centerY);	  	
	}

	CanvasInstance.prototype.getMousePos = function(canvas, evt) {
		var rect = canvas.getBoundingClientRect();
		return {
			x: evt.clientX - rect.left,
			y: evt.clientY - rect.top
		};
	}

	CanvasInstance.prototype.clear = function() {
		this.canvas.width = this.canvas.width;
		if (this.storage) {
			this.storage.empty();
		}
	}

	function getColor() {
		return document.getElementById("color-picker").value;
	}

	var init = function() {
		var canvasInstance = new CanvasInstance("myCanvas", trianglesStorage);

		var canvasNameSelect = document.getElementById("canvas-name-select");
		for (var itemName in localStorage) {
			if (localStorage.hasOwnProperty(itemName)) {
				otionEl = document.createElement("option");
				otionEl.text = itemName;
				canvasNameSelect.add(otionEl);
			}
		}

		initHandlers(canvasInstance);
	}

	var initHandlers = function(canvas) {
		var clearButton = document.getElementById("btn-clear");
		clearButton.addEventListener("click", function(e) {
			e.preventDefault();
			canvas.clear();
		})

		var saveButton = document.getElementById("btn-save");
		saveButton.addEventListener("click", function(e) {
			e.preventDefault();

			var canvasName = prompt("Please enter canvas name", "sample-canvas");
			if (canvasName != null) {
				localStorage.setItem(canvasName, JSON.stringify(trianglesStorage.toArray()));

				var canvasNameSelect = document.getElementById("canvas-name-select"),
					otionEl = document.createElement("option");

				otionEl.text = canvasName;
				canvasNameSelect.add(otionEl);
			}
		})

		var loadButton = document.getElementById("btn-load");
		loadButton.addEventListener("click", function(e) {
			e.preventDefault();

			var canvasNameSelect = document.getElementById("canvas-name-select"),
				canvasName = canvasNameSelect.options[canvasNameSelect.selectedIndex].value,
				triangles = JSON.parse(localStorage.getItem(canvasName));

			canvas.clear();
			triangles.forEach(function(triangle) {
				var triangle = canvas.drawTriangle(triangle);
				canvas.drawAreaText(triangle);
				if (trianglesStorage) {
					trianglesStorage.add(triangle);
				}
			});
		})
	}

	window.addEventListener("load", function() {
		init();
	});
})(ns);