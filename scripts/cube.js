/* global THREE */

var renderer, scene, camera;

var raycaster, intersects;

var vec,
  pos,
  mouse,
  targetZ = 0,
  selection;

var isClicked = false;

var line, points, correctPos;

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
  cubeGeo.rotateY(0.785398);
  cubeGeo.rotateX(0.785398);
  var edges = new THREE.EdgesGeometry(cubeGeo);

  var verticesToRender = new Float32Array(24);

  // Copying the lines we want in to an array - Make a new function for this
  // for (let i = 0; i < verticesToRender.length; i++) {
  //   verticesToRender[i] = edges.attributes.position.array[i + 6];
  // }
  verticesToRender[0] = edges.attributes.position.array[7 * 3];
  verticesToRender[1] = edges.attributes.position.array[7 * 3 + 1];
  verticesToRender[2] = edges.attributes.position.array[7 * 3 + 2];
  verticesToRender[3] = edges.attributes.position.array[6 * 3];
  verticesToRender[4] = edges.attributes.position.array[6 * 3 + 1];
  verticesToRender[5] = edges.attributes.position.array[6 * 3 + 2];

  verticesToRender[6] = edges.attributes.position.array[5 * 3];
  verticesToRender[7] = edges.attributes.position.array[5 * 3 + 1];
  verticesToRender[8] = edges.attributes.position.array[5 * 3 + 2];
  verticesToRender[9] = edges.attributes.position.array[4 * 3];
  verticesToRender[10] = edges.attributes.position.array[4 * 3 + 1];
  verticesToRender[11] = edges.attributes.position.array[4 * 3 + 2];

  verticesToRender[12] = edges.attributes.position.array[22 * 3];
  verticesToRender[13] = edges.attributes.position.array[22 * 3 + 1];
  verticesToRender[14] = edges.attributes.position.array[22 * 3 + 2];
  verticesToRender[15] = edges.attributes.position.array[23 * 3];
  verticesToRender[16] = edges.attributes.position.array[23 * 3 + 1];
  verticesToRender[17] = edges.attributes.position.array[23 * 3 + 2];

  verticesToRender[18] = edges.attributes.position.array[23 * 3];
  verticesToRender[19] = edges.attributes.position.array[23 * 3 + 1];
  verticesToRender[20] = edges.attributes.position.array[23 * 3 + 2];

  verticesToRender[21] = edges.attributes.position.array[23 * 3];
  verticesToRender[22] = edges.attributes.position.array[23 * 3 + 1];
  verticesToRender[23] = edges.attributes.position.array[23 * 3 + 2];

  // Use array to create new Geometry with the lines we want to render
  var renderedEdges = new THREE.BufferGeometry();
  renderedEdges.addAttribute(
    "position",
    new THREE.BufferAttribute(verticesToRender, 3)
  );

  line = new THREE.LineSegments(
    renderedEdges,
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

  scene.add(line);

  points = new THREE.Points(line.geometry);
  points.material.size = 10;
  points.material.colorWrite = false;
  scene.add(points);
  correctPos = new THREE.Vector3(
    line.geometry.attributes.position.array[0],
    line.geometry.attributes.position.array[1],
    line.geometry.attributes.position.array[2]
  );

  window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();
  });
  canvas.addEventListener("mousemove", mouseMove, false);
  canvas.addEventListener("mousedown", onClick, false);
}
function render() {
  // line.rotateX(0.01);
  // line.rotateY(0.01);

  raycaster.setFromCamera(mouse, camera);

  if (isClicked && selection != null) {
    line.geometry.attributes.position.array[selection * 3] = pos.x;
    line.geometry.attributes.position.array[selection * 3 + 1] = pos.y;
    line.geometry.attributes.position.array[selection * 3 + 2] = pos.z;
  }

  line.geometry.attributes.position.needsUpdate = true;

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
  // if (
  //   line.geometry.attributes.position.array[selection[0]] < correctPos.x + 1 &&
  //   line.geometry.attributes.position.array[selection[0]] > correctPos.x - 1 &&
  //   line.geometry.attributes.position.array[selection[1]] < correctPos.y + 1 &&
  //   line.geometry.attributes.position.array[selection[1]] > correctPos.y - 1
  // ) {
  //   line.geometry.attributes.position.array[selection[0]] = correctPos.x;
  //   line.geometry.attributes.position.array[selection[1]] = correctPos.y;
  //   selection = [selection[0] + 3, selection[1] + 3, selection[2] + 3];
  //   correctPos.x = line.geometry.attributes.position.array[selection[0]];
  //   correctPos.y = line.geometry.attributes.position.array[selection[1]];
  //   correctPos.z = line.geometry.attributes.position.array[selection[2]];
  // }
  //
  points.geometry.computeBoundingSphere();
  intersects = raycaster.intersectObject(points);

  if (!isClicked) {
    if (intersects.length > 0) {
      isClicked = true;
      selection = intersects[0].index;
      if (selection === 5) selection = 6;
      targetZ = line.geometry.attributes.position.array[selection * 3 + 2];
      console.log(selection);
    }
  } else {
    isClicked = false;
    selection = null;
  }
}

function animate() {
  requestAnimationFrame(animate);

  render();
}
