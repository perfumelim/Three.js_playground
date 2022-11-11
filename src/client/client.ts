import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader";
import Stats from "three/examples/jsm/libs/stats.module";
import { GUI } from "dat.gui";

const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper(5));

const light = new THREE.DirectionalLight();
scene.add(light);

const helper = new THREE.DirectionalLightHelper(light);
scene.add(helper);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 7;

const renderer = new THREE.WebGLRenderer();
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

new OrbitControls(camera, renderer.domElement);

const envTexture = new THREE.CubeTextureLoader().load([
  "img/px_50.png",
  "img/nx_50.png",
  "img/py_50.png",
  "img/ny_50.png",
  "img/pz_50.png",
  "img/nz_50.png",
]);
envTexture.mapping = THREE.CubeReflectionMapping;

const material = new THREE.MeshPhysicalMaterial({
  color: 0x795644,
  envMap: envTexture,
  metalness: 0,
  roughness: 0.25,
  transparent: false,
  transmission: 1.0,
  side: THREE.DoubleSide,
  clearcoat: 0.0,
  clearcoatRoughness: 0.25,
});

const loader = new PLYLoader();
loader.load(
  "models/Troglodytes.ply",
  function (geometry) {
    geometry.computeVertexNormals();
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotateX(-Math.PI / 2);
    scene.add(mesh);
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  (error) => {
    console.log(error);
  }
);

window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

const stats = Stats();
document.body.appendChild(stats.dom);

const data = {
  color: light.color.getHex(),
  mapsEnabled: true,
};

const gui = new GUI();
const lightFolder = gui.addFolder("THREE.Light");
lightFolder.addColor(data, "color").onChange(() => {
  light.color.setHex(Number(data.color.toString().replace("#", "0x")));
});
lightFolder.add(light, "intensity", 0, 1, 0.01);

const directionalLightFolder = gui.addFolder("THREE.DirectionalLight");
directionalLightFolder.add(light.position, "x", -100, 100, 0.01);
directionalLightFolder.add(light.position, "y", -100, 100, 0.01);
directionalLightFolder.add(light.position, "z", -100, 100, 0.01);
directionalLightFolder.open();

function animate() {
  requestAnimationFrame(animate);

  //helper.update()

  render();

  stats.update();
}

function render() {
  renderer.render(scene, camera);
}

animate();
