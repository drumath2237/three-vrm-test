import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { VRM, VRMSchema, VRMHumanoid, VRMBlendShapeGroup } from '@pixiv/three-vrm';
import { Vector2, Mesh, Geometry, MeshBasicMaterial } from 'three';

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

  const geometrys: THREE.LatheGeometry[] = [];
  geometrys.push(
    new THREE.LatheGeometry(
      [
        new THREE.Vector2(0.4, 0.01),
        new Vector2(0.3,0.01)
      ], 64, 1.0, 5.0
    ),
    new THREE.LatheGeometry(
      [
        new Vector2(0.45, 0.01),
        new Vector2(0.42, 0.01),
      ], 64, 0, 2.0
    )
  );

  let meshes: THREE.Mesh[] = [];
  geometrys.map((geo)=>meshes.push(new THREE.Mesh(geo, new THREE.MeshBasicMaterial())));
  meshes.map( (m) => {
    scene.add(m);
  })

  const meshes_loop_speeds = [0.01, 0.03];

  let MeshesUpdate = () =>
    meshes.map( (mesh, index) =>
      mesh.rotation.y += meshes_loop_speeds[index]
    );


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

    MeshesUpdate();

    renderer.render(scene, camera);
  }

  animate();

})