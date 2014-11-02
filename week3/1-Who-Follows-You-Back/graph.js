function Node(id, data) {
	this.id = id;
	this.data = (data !== undefined) ? data : {};
};

function Edge(source, target) {
	this.source = source;
	this.target = target;
};

function DirectedGraph() {
	this._nodes = [];
	this._edges = [];
	this._adjacency = {};

	this._nodeSet = [];
};

function addNode(node) {
	if (!(node.id in this._nodeSet)) {
		this._nodes.push(node);
	}

	this._nodeSet[node.id] = node;
	return node;
};

function getNode(nodeId, data) {
	return new Node(nodeId, data);
};

function getEdge(nodeA, nodeB) {
	return new Edge(nodeA, nodeB);
};

DirectedGraph.prototype.addEdge = function(nodeA, nodeB) {
	var exists = null,
		edge = null,
		nodeAObj = getNode(nodeA),
		nodeBObj = getNode(nodeB);

	addNode.call(this, nodeAObj);
	addNode.call(this, nodeBObj);
	edge = getEdge.call(this, nodeAObj, nodeBObj);

	exists = this._edges.some(function(e) {
		if (edge.source.id === e.source.id &&
			edge.target.id === e.target.id) {
			return true;
		}
	});

	if (exists === false) {
		this._edges.push(edge);
	}

	if (!(edge.source.id in this._adjacency)) {
		this._adjacency[edge.source.id] = {};
	}

	if (!(edge.target.id in this._adjacency[edge.source.id])) {
		this._adjacency[edge.source.id][edge.target.id] = edge;
	}
};

DirectedGraph.prototype.getNeighborsFor = function(node) {

};

function hasPath(nodeAObj, nodeBObj, visited) {
	if(nodeAObj === nodeBObj && visited.indexOf(nodeAObj) === -1) {
		return true;
	} else {
		
	}
}

DirectedGraph.prototype.pathBetween = function(nodeA, nodeB) {
	var nodeAObj = this._nodeSet[nodeA],
		nodeBObj = this._nodeSet[nodeB];

	Object.keys(this._adjacency[nodeAObj.id]).some(function(node) {
		var visited = [];
		visited.push(nodeAObj);
		if(hasPath.call(this, node, nodeBObj, visited)) {
			return true;
		};
	});
};

DirectedGraph.prototype.toString = function() {

};



module.exports = DirectedGraph;