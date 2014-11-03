var Graph = require("./graph");

var newGraph = new Graph();
newGraph.addEdge('node1', 'node2');
newGraph.addEdge('node1', 'node22');
newGraph.addEdge('node1', 'node11');
newGraph.addEdge('node1', 'node6');
newGraph.addEdge('node2', 'node3');
newGraph.addEdge('node2', 'node7');
newGraph.addEdge('node2', 'node11');
newGraph.addEdge('node3', 'node1');
newGraph.addEdge('node3', 'node2');
newGraph.addEdge('node3', 'node5');
newGraph.addEdge('node3', 'node1');
newGraph.addEdge('node3', 'node4');
newGraph.addEdge('node4', 'node2');
newGraph.addEdge('node4', 'node8');
newGraph.addEdge('node5', 'node9');
newGraph.addEdge('node33', 'node44');

var neighbors = newGraph.getNeighborsFor('node3'),
	pathBetween_1_4 = newGraph.pathBetween('node1', 'node4'),
	pathBetween_2_8 = newGraph.pathBetween('node2', 'node8'),
	pathBetween_2_9 = newGraph.pathBetween('node2', 'node9'),
	pathBetween_2_44 = newGraph.pathBetween('node2', 'node44'),
	pathBetween_8_2 = newGraph.pathBetween('node8', 'node2');
