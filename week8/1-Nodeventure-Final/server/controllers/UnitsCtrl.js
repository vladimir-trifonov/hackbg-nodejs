module.exports = {
	setEngine: function(currentEngine) {
		this.engine = currentEngine;

		this._initEventHandlers();
	},
	_initEventHandlers: function() {
		this.engine.on("tick", function() {});

		this.engine.on("newUnit", function() {
			console.log("New Unit Added!");
			this._notifyOtherPlayers();
		});
	},
	_notifyOtherPlayers: function() {
		var firstList = this.otherUnits;
		var secondList = [];

		var gridPosition = this.engine.worldToGridPosition(this.x, this.y, 50);

		var cx = gridPosition.x;
		var cy = gridPosition.y;

		for (var x = cx - 1; x <= cx + 1; x++) {
			for (var y = cy - 1; y <= cy + 1; y++) {
				_.each(worldHandler.units[this.zone][x][y], function(unit) {
					if (unit !== this) {
						secondList.push(unit);
					}
				}, this);
			}
		}

		for (var i = 0; i < firstList.length; i++) {
			if (secondList.indexOf(firstList[i]) === -1) {
				this._removeOtherUnit(firstList[i]);
			}
		}
		for (var i = 0; i < secondList.length; i++) {
			if (firstList.indexOf(secondList[i]) === -1) {
				this._addOtherUnit(secondList[i]);
			}
		}
	},
	_addOtherUnit: function() {
		var packet = {
			id: id,
			position: unit.position,
			name: unit.name,
			isGameMaster: true
		};

		this.engine.server.emit("addUnit", packet);
	},
	_removeOtherUnit: function() {

	},
	_tick: function() {
		_.each(this.world, function(zone) {
			_.each(zone, function(cellX) {
				_.each(cellX, function(cellY) {
					_.each(cellY.units, function(unit) {

						var snapshot = [];

						_.each(unit.otherUnits, function(otherUnit) {
							var packet = {
								id: otherUnit.id,
								x: otherUnit.x,
								y: otherUnit.y
							};

							snapshot.push(packet);
						});

						if (snapshot.length) {
							unit.socket.emit("snapshot", snapshot);
						}
					});
				});
			});
		});
	}
}