const dijkstraWithNodeWeights = (nodes, startNode, endNode) => {
  const distances = {};
  const previousNodes = {};
  const unvisitedNodes = new Set(Object.keys(nodes));

  // Initialize distances and previous nodes
  unvisitedNodes.forEach((node) => {
    distances[node] = Infinity;
    previousNodes[node] = null;
  });
  distances[startNode] = nodes[startNode].weight;

  while (unvisitedNodes.size > 0) {
    // Find the unvisited node with the smallest distance
    const currentNode = [...unvisitedNodes].reduce((minNode, node) =>
      distances[node] < distances[minNode] ? node : minNode
    );

    // If the smallest distance is infinity, we are disconnected
    if (distances[currentNode] === Infinity) break;

    // Remove the current node from the unvisited set
    unvisitedNodes.delete(currentNode);

    // If we reached the end node, construct the path
    if (currentNode === endNode) {
      const path = [];
      let node = endNode;
      while (node) {
        path.unshift(node);
        node = previousNodes[node];
      }
      return path;
    }

    // Update distances to neighboring nodes
    nodes[currentNode].neighbors.forEach((neighbor) => {
      console.log(neighbor)
      const tentativeDistance = distances[currentNode] + nodes[neighbor].weight;
      if (tentativeDistance < distances[neighbor]) {
        distances[neighbor] = tentativeDistance;
        previousNodes[neighbor] = currentNode;
      }
    });
  }

  // Return an empty array if no path is found
  return [];
};

export default dijkstraWithNodeWeights;