import * as THREE from "../lib/three.module.js";

/**
 * The Level Generator class for for building each level
 */
class LevelGenerator {
  /**
   * Create a level
   * @param {Object} level The level configuration containing 2 arrays for the cube vertices that will be rendered and controlled.
   *
   */
  constructor(level) {
    Object.assign(this, level);

    // Set up cube vertices
    var cubeGeometry = new THREE.BoxGeometry(20, 20, 20);
    // Rotate cube to right position
    cubeGeometry.rotateY(0.785398);
    cubeGeometry.rotateX(0.785398);
    // Store edges of cube geometery
    this.edges = new THREE.EdgesGeometry(cubeGeometry);
    cubeGeometry.dispose();
  }

  /**
   * Get edges of complete cube, used to extract the desired geoemtery
   * @return {EdgesGeometry} The edges of a complete cube
   */
  getEdges() {
    return this.edges;
  }

  /**
   * Uses the complete cube's edges and the level's array of vertices to be rendered to create
   * the edges of the cube that will be displayed
   * @return {LineSegments} A LineSegments object that can be added to the threejs scene
   */
  generateRenderLines() {
    // Create a BufferGeoemetry to store the desired vertices
    var renderGeometry = new THREE.BufferGeometry();
    // Create a temporary array so we can push the vertices
    let tmpVertices = [];
    // Use the renderVertices array to rerieve the X, Y and Z coordinates of the desired points and
    // copy to the tmp array
    this.renderVertices.forEach(function(vertex) {
      // Take the value from level config array and multiply by 3 to get the array index of the X coord
      tmpVertices.push(this.getEdges().attributes.position.array[vertex * 3]);
      // Multiply by 3 and add one to get the Y coord
      tmpVertices.push(
        this.getEdges().attributes.position.array[vertex * 3 + 1]
      );
      // Add 1 to get the Z coord
      tmpVertices.push(
        this.getEdges().attributes.position.array[vertex * 3 + 2]
      );
    }, this);
    // Create a Typed Array from the tmp array, threejs needs a Typed Array
    var bufferVertices = new Float32Array(tmpVertices);
    // Add the bufferVertices as position attribute to our custom geometry
    renderGeometry.addAttribute(
      "position",
      new THREE.BufferAttribute(bufferVertices, 3)
    );

    // Return a LineSegments object using the custom geometry
    return new THREE.LineSegments(
      renderGeometry,
      new THREE.LineBasicMaterial({
        color: 0x000000,
        linewidth: 1
      })
    );
  }

  /**
   * Uses the complete cube's edges and the level's array of vertices to be controlled to create
   * the edges of the cube that will be moved by the player
   * @return {LineSegments} A LineSegments object that can be added to the threejs scene
   */
  generateConnectVertices() {
    // generateRenderLines explains the logic
    var connectGeometry = new THREE.BufferGeometry();
    let tmpVertices = [];

    this.connectVertices.forEach(function(vertex) {
      // Add duplicates so the line can be moved, it starts of "stacked" on itself then appears as a
      // line when the point is moved
      for (let i = 0; i < 2; i++) {
        tmpVertices.push(this.getEdges().attributes.position.array[vertex * 3]);
        tmpVertices.push(
          this.getEdges().attributes.position.array[vertex * 3 + 1]
        );
        tmpVertices.push(
          this.getEdges().attributes.position.array[vertex * 3 + 2]
        );
      }
    }, this);

    var bufferVertices = new Float32Array(tmpVertices);

    connectGeometry.addAttribute(
      "position",
      new THREE.BufferAttribute(bufferVertices, 3)
    );

    return new THREE.LineSegments(
      connectGeometry,
      new THREE.LineBasicMaterial({
        color: 0x000000,
        linewidth: 1
      })
    );
  }

  /**
   * Creates a level and returns it as an object
   * @return {{renderLines:LineSegments, connectLines:LineSegments, edges:EdgesGeometry}} An Object with the LineSegments that will be rendered and controlled and the complete cube geometry
   */
  generateLevel() {
    return {
      renderLines: this.generateRenderLines(this.renderVertices),
      connectLines: this.generateConnectVertices(this.connectVertices),
      edges: this.getEdges()
    };
  }
}

export default LevelGenerator;
