import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { VRM } from '@pixiv/three-vrm';

window.addEventListener('DOMContentLoaded', ()=>{
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth/window.innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer();

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x4CAEAD,1.0);
  document.body.appendChild(renderer.domElement);

  // const geometry = new THREE.BoxGeometry(1,1,1);
  // const material = new THREE.MeshBasicMaterial();
  // const cube = new THREE.Mesh(geometry,material);
  // scene.add(cube);

  const light = new THREE.DirectionalLight(0xffffff);
  light.position.set(1.0, 1.0, 1.0).normalize();
  scene.add(light);

  const loader = new GLTFLoader();

  let model: THREE.Scene;
  loader.load(
    './models/undefined-chan-toon.vrm',

    (glft)=>{
      VRM.from(glft).then((vrm)=>{
        scene.add(vrm.scene);
        vrm.scene.rotation.y = Math.PI;
        model = vrm.scene;
        console.log(vrm);        
      })
    },
    (progress)=>{},
    (error)=>{console.log(error);}
  );

  camera.position.z = 2;
  camera.position.y = 1;

  let animate = function(){
    requestAnimationFrame(animate);

    if(model)
      model.rotation.y += 0.01;

    renderer.render(scene, camera);
  }

  animate();

})