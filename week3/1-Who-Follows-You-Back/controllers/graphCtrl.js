module.exports = {
	createEdges: function(graph, node, neighbors) {
		neighbors.forEach(function(neighbor) {
			graph.addEdge.call(graph, node, neighbor.login);
		})
	},
	toString: function(graph) {
		return graph.toString();
	},
	toArray: function(graph, nodeKeyName, edgesCollectionName) {
		return graph.toArray(nodeKeyName, edgesCollectionName);
	},
	pathBetween: function(graph, nameA, nameB) {
		return graph.pathBetween(nameA, nameB);
	},
	getNeighborsFor: function(graph, name) {
		return graph.getNeighborsFor(name);
	},
	load: function(graph, parentName, childrens) {
		throw "Not Implemented!";
	}
}