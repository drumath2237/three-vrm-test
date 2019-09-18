import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { VRM, VRMSchema, VRMHumanoid, VRMBlendShapeGroup } from '@pixiv/three-vrm';
import { Vector2 } from 'three';

window.addEventListener('DOMContentLoaded', ()=>{
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45,
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

  const points = [];
  points.push(new THREE.Vector2(0.3,0.01));
  points.push(new THREE.Vector2(0.4,0.01));
  const geo = new THREE.LatheGeometry(points,64, 1.0, 5.0);
  const mat = new THREE.MeshBasicMaterial();
  const c = new THREE.Mesh(geo,mat);
  scene.add(c);
  c.rotation.z = Math.PI;

  const geo2 = new THREE.LatheGeometry(
    [
      new Vector2(0.42, 0.01),
      new Vector2(0.45, 0.01)
    ],64,0,2.0
  );
  const c2 = new THREE.Mesh(geo2, mat)
  scene.add( c2 );
  c2.rotation.z = Math.PI;

  const light = new THREE.DirectionalLight(0xffffff);
  light.position.set(1.0, 1.0, 1.0).normalize();
  scene.add(light);

  const loader = new GLTFLoader();

  let model: VRM;
  loader.load(
    './models/undefined-chan-toon.vrm',

    (glft)=>{
      VRM.from(glft).then((vrm)=>{
        scene.add(vrm.scene);
        vrm.scene.rotation.y = Math.PI;
        
        vrm.humanoid!.getBoneNode(VRMSchema.HumanoidBoneName.LeftUpperArm)!.rotation.z = Math.PI/2 - 0.3;
        vrm.humanoid!.getBoneNode(VRMSchema.HumanoidBoneName.RightUpperArm)!.rotation.z = -(Math.PI/2 - 0.3);
        vrm.blendShapeProxy!.setValue(VRMSchema.BlendShapePresetName.Fun, 1);
        vrm.blendShapeProxy!.setValue(VRMSchema.BlendShapePresetName.Sorrow, 0.08);
        vrm.blendShapeProxy!.update();
        
        model = vrm;
        console.log(vrm);        
      })
    },
    (progress)=>{},
    (error)=>{console.log(error);}
  );

  camera.position.z = 3;
  camera.position.y = 1;

  let clock = new THREE.Clock();
  let animate = function(){
    requestAnimationFrame(animate);

    c.rotation.y += 0.01;
    c2.rotation.y += 0.03;

    renderer.render(scene, camera);
  }

  animate();

})