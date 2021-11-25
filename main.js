import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});
const lightsource = new THREE.PointLight(0xffffff,1,80);
scene.add(lightsource);

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth,window.innerHeight);
camera.position.set(-2,12,25);
camera.rotation.set(-0.1,-0.3,0);

// const controls = new OrbitControls(camera,renderer.domElement);
const textureLoader = new THREE.TextureLoader();
const loader = new THREE.FontLoader();

// function for rendering text
function textRenderer(text,type,x = 0,y= 0,z = 0,rx = 0,ry = 0,rz = 0) {
  let _text = text;
  loader.load('fonts/Roboto_Regular.json',function (font) {
    const geometry = new THREE.TextGeometry( _text,{
      font: font,
      size: (type == 'title') ? 3 : 1,
      height: (type == 'title') ? 0.5 : 0.2,
    })
    const material = new THREE.MeshStandardMaterial({color: 0xffffff});
    text = new THREE.Mesh(geometry,material);
    text.position.set(x,y,z);
    text.rotation.set(rx,ry,rz);
    scene.add(text);
  })
};
textRenderer('Midas van veen','title',-7,10);
textRenderer('Software Developer','text',-7,8,0)
textRenderer('Skills','title',2,17,30,0,-0.3)
textRenderer('C++\nPython\nRust\nPHP\nJavascript','text',2,15,30,0,-0.3)
textRenderer('C#\n.NET\nBash\nTypescript\nReact.js\nGit\nKotlin\nDart','text',10,15,33,0,-0.3)
textRenderer('Projects','title',-10,10,60);
textRenderer('blabla\nblabla\nblabla','text',-10,7,60)

// generate cubes with custom texture
const cubetexture = textureLoader.load('assets/cube.png');
var cubeList = [];
Array(200).fill().forEach(() => {
  const cubeGeometry = new THREE.BoxGeometry(1,1,1);
  const cubeMaterial = new THREE.MeshStandardMaterial({color: 0xffffff,map: cubetexture});
  const cube = new THREE.Mesh(cubeGeometry,cubeMaterial);

  let [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(60));
  const [rx,ry,rz] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(60));
  cube.position.set(x,y,z);
  cube.rotation.set(rx,ry,rz);
  cubeList.push(cube);
});
cubeList.forEach((cube) => {
  if (-10 < cube.position.x && cube.position.x < 10) {} else {scene.add(cube);};
})

window.addEventListener( 'resize', onWindowResize );
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}
window.addEventListener( 'wheel', onScroll );
function onScroll(ev) {
  if (ev.deltaY > 0) {
    camera.position.z += 0.5;
  } else if (ev.deltaY < 0) {
    camera.position.z -= 0.5;
  }
}

function animate() {
  requestAnimationFrame(animate);
  // controls.update();
  lightsource.position.x = camera.position.x;
  lightsource.position.y = camera.position.y;
  lightsource.position.z = camera.position.z;
  // controls.update();

  cubeList.forEach((cube) => {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.003;
    // cube.rotation.z += 0.01;
    let distance_to_camera = Math.sqrt((camera.position.x - cube.position.x)**2 + (camera.position.z - cube.position.z)**2);
    if (distance_to_camera > 80) {
      cube.position.z = camera.position.z - 5
    }
  });

  renderer.render(scene, camera);
}

animate();
