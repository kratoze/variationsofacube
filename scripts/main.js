/* global THREE */

var renderer, scene, camera;

var raycaster, intersects;

var vec,
  pos,
  mouse,
  targetZ = 0,
  selection;

var zeroMoved = false,
  fourMoved = false,
  twoMoved = false;

var isClicked = false;

var edges, line, playerLine, points, correctPoints;

init();
animate();

function init() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const canvas = document.getElementsByTagName("canvas")[0];

  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    500
  );
  camera.position.set(0, 0, 100);
  camera.lookAt(0, 0, 0, 0);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xcdfcff);

  // Vector3 for mouse position relative to scene
  vec = new THREE.Vector3();
  pos = new THREE.Vector3();
  mouse = new THREE.Vector2();
  selection = [0, 1, 2];
  raycaster = new THREE.Raycaster();

  // Set up cube vertices
  var cubeGeo = new THREE.BoxGeometry(20, 20, 20);
  // Rotate cube to right position
  cubeGeo.rotateY(0.785398);
  cubeGeo.rotateX(0.785398);
  // Store edges of cube geometery
  edges = new THREE.EdgesGeometry(cubeGeo);

  // Creat array for the lines we want to render
  var verticesToRender = new Float32Array(24);
  // Create array for the lines that can be moved
  var verticesToControl = new Float32Array(54);

  // TODO: Move to a function and THINK OF A BETTER WAY JEEZE

  // Copying the lines we want in to an array - positions in comments
  // are relative but the cube will never rotate

  // Middle vertex
  verticesToRender[0] = edges.attributes.position.array[7 * 3];
  verticesToRender[1] = edges.attributes.position.array[7 * 3 + 1];
  verticesToRender[2] = edges.attributes.position.array[7 * 3 + 2];
  // Top vertex
  verticesToRender[3] = edges.attributes.position.array[6 * 3];
  verticesToRender[4] = edges.attributes.position.array[6 * 3 + 1];
  verticesToRender[5] = edges.attributes.position.array[6 * 3 + 2];
  // Middle vertex
  verticesToRender[6] = edges.attributes.position.array[5 * 3];
  verticesToRender[7] = edges.attributes.position.array[5 * 3 + 1];
  verticesToRender[8] = edges.attributes.position.array[5 * 3 + 2];
  // Right vertex
  verticesToRender[9] = edges.attributes.position.array[4 * 3];
  verticesToRender[10] = edges.attributes.position.array[4 * 3 + 1];
  verticesToRender[11] = edges.attributes.position.array[4 * 3 + 2];
  // Middle vertex
  verticesToRender[12] = edges.attributes.position.array[22 * 3];
  verticesToRender[13] = edges.attributes.position.array[22 * 3 + 1];
  verticesToRender[14] = edges.attributes.position.array[22 * 3 + 2];
  // Right vertex
  verticesToRender[15] = edges.attributes.position.array[23 * 3];
  verticesToRender[16] = edges.attributes.position.array[23 * 3 + 1];
  verticesToRender[17] = edges.attributes.position.array[23 * 3 + 2];

  // Create lines that will be moved by the player
  // These lines' vertices start off the same to make them invisible and
  // the position will be changed by player
  // Left vertex - player line
  verticesToControl[0] = edges.attributes.position.array[23 * 3];
  verticesToControl[1] = edges.attributes.position.array[23 * 3 + 1];
  verticesToControl[2] = edges.attributes.position.array[23 * 3 + 2];
  verticesToControl[3] = edges.attributes.position.array[23 * 3];
  verticesToControl[4] = edges.attributes.position.array[23 * 3 + 1];
  verticesToControl[5] = edges.attributes.position.array[23 * 3 + 2];
  // Right vertex - player line
  verticesToControl[6] = edges.attributes.position.array[4 * 3];
  verticesToControl[7] = edges.attributes.position.array[4 * 3 + 1];
  verticesToControl[8] = edges.attributes.position.array[4 * 3 + 2];
  verticesToControl[9] = edges.attributes.position.array[4 * 3];
  verticesToControl[10] = edges.attributes.position.array[4 * 3 + 1];
  verticesToControl[11] = edges.attributes.position.array[4 * 3 + 2];
  // Top - player line
  verticesToControl[12] = edges.attributes.position.array[6 * 3];
  verticesToControl[13] = edges.attributes.position.array[6 * 3 + 1];
  verticesToControl[14] = edges.attributes.position.array[6 * 3 + 2];
  verticesToControl[15] = edges.attributes.position.array[6 * 3];
  verticesToControl[16] = edges.attributes.position.array[6 * 3 + 1];
  verticesToControl[17] = edges.attributes.position.array[6 * 3 + 2];
  // Top - need 2 because top vertex will need to go to left and right
  verticesToControl[18] = edges.attributes.position.array[6 * 3];
  verticesToControl[19] = edges.attributes.position.array[6 * 3 + 1];
  verticesToControl[20] = edges.attributes.position.array[6 * 3 + 2];
  verticesToControl[21] = edges.attributes.position.array[6 * 3];
  verticesToControl[22] = edges.attributes.position.array[6 * 3 + 1];
  verticesToControl[23] = edges.attributes.position.array[6 * 3 + 2];
  // Left vertex - need 2
  verticesToControl[24] = edges.attributes.position.array[23 * 3];
  verticesToControl[25] = edges.attributes.position.array[23 * 3 + 1];
  verticesToControl[26] = edges.attributes.position.array[23 * 3 + 2];
  verticesToControl[27] = edges.attributes.position.array[23 * 3];
  verticesToControl[28] = edges.attributes.position.array[23 * 3 + 1];
  verticesToControl[29] = edges.attributes.position.array[23 * 3 + 2];
  // Right vertex - need 2
  verticesToControl[30] = edges.attributes.position.array[4 * 3];
  verticesToControl[31] = edges.attributes.position.array[4 * 3 + 1];
  verticesToControl[32] = edges.attributes.position.array[4 * 3 + 2];
  verticesToControl[33] = edges.attributes.position.array[4 * 3];
  verticesToControl[34] = edges.attributes.position.array[4 * 3 + 1];
  verticesToControl[35] = edges.attributes.position.array[4 * 3 + 2];
  // Top left
  verticesToControl[36] = edges.attributes.position.array[8 * 3];
  verticesToControl[37] = edges.attributes.position.array[8 * 3 + 1];
  verticesToControl[38] = edges.attributes.position.array[8 * 3 + 2];
  verticesToControl[39] = edges.attributes.position.array[8 * 3];
  verticesToControl[40] = edges.attributes.position.array[8 * 3 + 1];
  verticesToControl[41] = edges.attributes.position.array[8 * 3 + 2];
  // Top right
  verticesToControl[42] = edges.attributes.position.array[0 * 3];
  verticesToControl[43] = edges.attributes.position.array[0 * 3 + 1];
  verticesToControl[44] = edges.attributes.position.array[0 * 3 + 2];
  verticesToControl[45] = edges.attributes.position.array[0 * 3];
  verticesToControl[46] = edges.attributes.position.array[0 * 3 + 1];
  verticesToControl[47] = edges.attributes.position.array[0 * 3 + 2];
  // Top front
  verticesToControl[48] = edges.attributes.position.array[11 * 3];
  verticesToControl[49] = edges.attributes.position.array[11 * 3 + 1];
  verticesToControl[50] = edges.attributes.position.array[11 * 3 + 2];
  verticesToControl[51] = edges.attributes.position.array[11 * 3];
  verticesToControl[52] = edges.attributes.position.array[11 * 3 + 1];
  verticesToControl[53] = edges.attributes.position.array[11 * 3 + 2];
  // Use array to create new Geometry with the lines we want to render
  var renderedEdges = new THREE.BufferGeometry();
  renderedEdges.addAttribute(
    "position",
    new THREE.BufferAttribute(verticesToRender, 3)
  );

  var controlledEdges = new THREE.BufferGeometry();
  controlledEdges.addAttribute(
    "position",
    new THREE.BufferAttribute(verticesToControl, 3)
  );

  line = new THREE.LineSegments(
    renderedEdges,
    new THREE.LineBasicMaterial({
      color: 0x000000,
      linewidth: 1
    })
  );

  playerLine = new THREE.LineSegments(
    controlledEdges,
    new THREE.LineBasicMaterial({
      color: 0x000000,
      linewidth: 1
    })
  );

  var line2 = new THREE.LineSegments(
    edges,
    new THREE.LineBasicMaterial({
      color: 0xffffff,
      linewidth: 1,
      alphaTest: 0.4
    })
  );
  line2.position.set(40, 0, 0);

  points = new THREE.Points(playerLine.geometry);
  correctPoints = new THREE.Points(edges);

  scene.add(line);
  scene.add(playerLine);
  scene.add(correctPoints);

  window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();
  });
  canvas.addEventListener("mousemove", mouseMove, false);
  canvas.addEventListener("mousedown", onClick, false);
}
function render() {
  raycaster.setFromCamera(mouse, camera);

  if (isClicked && selection != null) {
    playerLine.geometry.attributes.position.array[selection * 3] = pos.x;
    playerLine.geometry.attributes.position.array[selection * 3 + 1] = pos.y;
    playerLine.geometry.attributes.position.array[selection * 3 + 2] = pos.z;
  }

  playerLine.geometry.attributes.position.needsUpdate = true;

  renderer.render(scene, camera);
}

function mouseMove(event) {
  mouse.x = (event.offsetX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.offsetY / window.innerHeight) * 2 + 1;
  // Get mouse position relative to scene
  vec.set(
    (event.offsetX / window.innerWidth) * 2 - 1,
    -(event.offsetY / window.innerHeight) * 2 + 1,
    0.5
  );
  // Unproject mouse position with Camera
  vec.unproject(camera);

  // Subtract camera position from mouse position
  vec.sub(camera.position).normalize();

  // Calculate distance on Z axis between mouse pos and camera position
  var distance = (targetZ - camera.position.z) / vec.z;

  // Set pos as the relative mouse position
  pos.copy(camera.position).add(vec.multiplyScalar(distance));
}

function onClick() {
  points.geometry.computeBoundingSphere();

  if (!isClicked) {
    intersects = raycaster.intersectObject(points);

    if (intersects.length > 0) {
      isClicked = true;
      selection = intersects[0].index;
      console.log(selection);
      // Force the selection so only one end of a line can be moved
      // Otherwise player can deconstruct the cube
      if (selection === 4 && !fourMoved) {
        fourMoved = true;
      } else if (selection === 5 && fourMoved) {
        selection = 6;
      }
      if (selection === 0 && !zeroMoved) {
        zeroMoved = true;
      } else if (selection === 1 && zeroMoved) {
        selection = 8;
      }
      if (selection === 2 && !twoMoved) {
        twoMoved = true;
      } else if (selection === 3 && twoMoved) {
        selection = 10;
      }
      console.log(selection);
      targetZ =
        playerLine.geometry.attributes.position.array[selection * 3 + 2];
    }
  } else {
    intersects = raycaster.intersectObject(correctPoints);

    if (intersects.length > 0) {
      console.log(intersects[0].index);
      var correctPos = {
        x:
          correctPoints.geometry.attributes.position.array[
            intersects[0].index * 3
          ],
        y:
          correctPoints.geometry.attributes.position.array[
            intersects[0].index * 3 + 1
          ],
        z:
          correctPoints.geometry.attributes.position.array[
            intersects[0].index * 3 + 2
          ]
      };

      playerLine.geometry.attributes.position.array[selection * 3] =
        correctPos.x;
      playerLine.geometry.attributes.position.array[selection * 3 + 1] =
        correctPos.y;
      playerLine.geometry.attributes.position.array[selection * 3 + 2] =
        correctPos.z;
    }

    isClicked = false;
    selection = null;
  }
}

function animate() {
  requestAnimationFrame(animate);
  render();
}
