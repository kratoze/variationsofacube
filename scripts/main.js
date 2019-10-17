/* global THREE */

import * as THREE from "../lib/three.module.js";
import LevelGenerator from "./LevelGenerator.js";
import { levels } from "./CubeConfigs.js";
var renderer, scene, camera, levelGenerator;

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

var edges, renderLines, playerLine, points, correctPoints;

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

  // Setup Level One
  var levelOne = new LevelGenerator(levels[0]);

  ({
    renderLines: renderLines,
    connectLines: playerLine,
    edges: edges
  } = levelOne.generateLevel());
  points = new THREE.Points(playerLine.geometry);
  correctPoints = new THREE.Points(edges);
  console.log(playerLine);
  console.log(correctPoints);

  window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();
  });
  canvas.addEventListener("mousemove", mouseMove, false);
  canvas.addEventListener("mousedown", onClick, false);

  scene.add(renderLines);
  scene.add(playerLine);
  scene.add(correctPoints);
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
  console.log(isClicked);
  if (!isClicked) {
    intersects = raycaster.intersectObject(points);

    if (intersects.length > 0) {
      console.log(intersects);
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
