var expect = require("chai").expect,
	Graph = require("../graph.js"),
	os = require('os');

describe('Test Graph', function() {

	describe("#addEdge()", function() {
		it("should add edge between two nodes and return the same edge", function() {
			var graph = new Graph();
			var result = graph.addEdge('node1', 'node2');

			expect(result).to.have.a.property("hasEdge", true);
		});
	});

	describe('#pathBetween()', function() {
		it('should test whether exist path between two nodes', function() {
			var graph = new Graph();
			graph.addEdge('node1', 'node2');
			graph.addEdge('node1', 'node22');
			graph.addEdge('node1', 'node11');
			graph.addEdge('node1', 'node6');
			graph.addEdge('node2', 'node3');
			graph.addEdge('node2', 'node7');
			graph.addEdge('node2', 'node11');
			graph.addEdge('node3', 'node1');
			graph.addEdge('node3', 'node2');
			graph.addEdge('node3', 'node5');
			graph.addEdge('node3', 'node1');
			graph.addEdge('node3', 'node4');
			graph.addEdge('node4', 'node2');
			graph.addEdge('node4', 'node8');
			graph.addEdge('node5', 'node9');
			graph.addEdge('node33', 'node44');

			expect(graph.pathBetween('node1', 'node4')).to.equal(true);
			expect(graph.pathBetween('node2', 'node8')).to.equal(true);
			expect(graph.pathBetween('node2', 'node9')).to.equal(true);
			expect(graph.pathBetween('node2', 'node44')).to.equal(false);
			expect(graph.pathBetween('node8', 'node2')).to.equal(false);
		})
	});

	describe('#getNeighborsFor()', function() {
		it('should returns a list of neighbors for a given node', function() {
			var graph = new Graph();
			graph.addEdge('node1', 'node2');
			graph.addEdge('node1', 'node22');
			graph.addEdge('node1', 'node11');
			graph.addEdge('node1', 'node6');
			graph.addEdge('node2', 'node3');
			graph.addEdge('node2', 'node7');

			expect(graph.getNeighborsFor('node1')).to.eql([ 'node2', 'node22', 'node11', 'node6' ]);
			expect(graph.getNeighborsFor('node2')).to.not.include('node6');
		})
	});

	describe('#toString()', function() {
		it('should returns a representation of nodes of the graph and their neighbors', function() {
			var graph = new Graph();
			graph.addEdge('node1', 'node2');
			graph.addEdge('node1', 'node22');
			graph.addEdge('node1', 'node11');
			graph.addEdge('node1', 'node6');

			expect(graph.toString()).to.equal(
				"node1: [ node2 node22 node11 node6 ]" +
				os.EOL +
				"node2: [ ]" +
				os.EOL +
				"node22: [ ]" +
				os.EOL +
				"node11: [ ]" +
				os.EOL +
				"node6: [ ]" +
				os.EOL
			);
		})
	});
})