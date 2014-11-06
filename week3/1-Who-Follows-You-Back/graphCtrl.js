module.exports = {
	createEdges: function(graph, node, neighbors) {
		neighbors.forEach(function(neighbor) {
			graph.addEdge.call(graph, node, neighbor.login);
		})
	},
	toString: function(graph) {
		return graph.toString();
	}
}