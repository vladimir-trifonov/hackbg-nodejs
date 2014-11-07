var os = require('os');

function DirectedGraph() {
	this._nodes = {};
	this._nodesCount = 0;
	this._edgesCount = 0;
};

DirectedGraph.prototype._addNode = function(node) {
	if (!this._hasNode(node)) {
		this._nodesCount++;
		return this._nodes[node] = {
			_outerEdges: {},
			_innerEdges: {} // For further cases
		};
	}
};

DirectedGraph.prototype._hasNode = function(node) {
	return !!this._nodes[node];
};

DirectedGraph.prototype._getNode = function(node) {
	return this._nodes[node];
};

DirectedGraph.prototype.addEdge = function(nodeA, nodeB) {
	var self = this,
		edgeBetween = null,
		nodeFrom = null,
		nodeTo = null;

	if (this._hasEdge(nodeA, nodeB)) {
		return;
	}

	[nodeA, nodeB].forEach(function(node) {
		if (!self._hasNode(node)) {
			self._addNode(node);
		}
	});

	nodeFrom = this._getNode(nodeA);
	nodeTo = this._getNode(nodeB);

	if (!nodeFrom || !nodeTo) {
		return;
	}

	edgeBetween = {
		"hasEdge": true
	};
	nodeFrom._outerEdges[nodeB] = edgeBetween;
	nodeTo._innerEdges[nodeA] = edgeBetween;

	this._edgesCount++;
	return edgeBetween;
};

DirectedGraph.prototype._hasEdge = function(nodeA, nodeB) {
	var nodeFrom = this._getNode[nodeA],
		nodeTo = this._getNode[nodeB];

	if (!nodeFrom || !nodeTo) {
		return false;
	}

	return !!nodeFrom._outerEdges[nodeB];
};

DirectedGraph.prototype._getEdge = function(nodeA, nodeB) {
	var nodeFrom = this._getNode(nodeA),
		nodeTo = this._getNode(nodeB);

	if (!nodeFrom || !nodeTo) {
		return null;
	}

	return nodeFrom._outerEdges[nodeB];
};

DirectedGraph.prototype.getNeighborsFor = function(node) {
	var node = this._getNode(node),
		neighbors = [];

	if (!node) {
		return null;
	}

	for (neighbor in node._outerEdges) {
		if (node._outerEdges.hasOwnProperty(neighbor)) {
			neighbors.push(neighbor);
		}
	}

	return neighbors;
};

DirectedGraph.prototype.pathBetween = function(nodeA, nodeB) {
	var self = this,
		queue = [],
		visited = {},
		nodeFrom = this._getNode(nodeA),
		nodeTo = this._getNode(nodeB),
		next = null;

	if (!nodeFrom || !nodeTo) {
		return null;
	}

	visited[nodeA] = true;
	next = nodeFrom;

	while (next) {
		for (node in next._outerEdges) {
			if (next._outerEdges.hasOwnProperty(node)) {
				if (node === nodeB) {
					return true;
				}

				if (visited[node]) {
					continue;
				}

				visited[node] = true;
				queue.push(this._getNode(node));
			}
		}
		next = queue.shift();
	}
	return false;
};

DirectedGraph.prototype.toString = function() {
	var result = "";
	for (var node in this._nodes) {
		if (this._nodes.hasOwnProperty(node)) {
			var neighbors = this.getNeighborsFor(node);
			if(neighbors.length > 0) {
				result += node + ": [ "
				neighbors.forEach(function(neighbor) {
					result += neighbor + " ";
				});
				result += "]" + os.EOL;
			}
		}
	}
	return result;
};

module.exports = DirectedGraph;