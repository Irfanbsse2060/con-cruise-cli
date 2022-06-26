class Graph {

	constructor() {
		this.AdjList = new Map();
	}


	addVertex(v) {
		this.AdjList.set(v, []);
	}


	addEdge(v, w) {

		this.AdjList.get(v).push(w);

		// Since graph is undirected,
		// add an edge from w to v also
		this.AdjList.get(w[0]).push([v, w[1]]);
	}


	printGraph() {
		// get all the vertices
		var get_keys = this.AdjList.keys();

		for (var i of get_keys) {
			var get_values = this.AdjList.get(i);
			var conc = '';

			for (var j of get_values)
				conc += j + ' ';
			console.log(i + ' -> ' + conc);
		}
	}

	findMaxVertex(startingVertex, excludeVertex) {
		const get_List = this.AdjList.get(startingVertex);
		let currentMax = 0;
		let currentNode = null;

		for (var i in get_List) {
			var neigh = get_List[i];
			if (currentMax < neigh[1] && !excludeVertex[neigh[0]]) {
				currentMax = neigh[1];
				currentNode = neigh;
			}
		}
		return currentNode;
	}
}

module.exports = Graph;