import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { VRM, VRMSchema, VRMHumanoid, VRMBlendShapeGroup } from '@pixiv/three-vrm';

window.addEventListener('DOMContentLoaded', ()=>{
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth/window.innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer({
    antialias: true
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x4CAEAD,1.0);
  document.body.appendChild(renderer.domElement);

  const geometrys: THREE.LatheGeometry[] = []; // array contains geometries
  geometrys.push(
    new THREE.LatheGeometry(
      [
        new THREE.Vector2(0.4, 0.001),
        new THREE.Vector2(0.35,0.001)
      ], 128, 1.0, 2.0
    ),
    new THREE.LatheGeometry(
      [
        new THREE.Vector2(0.45, 0.001),
        new THREE.Vector2(0.42, 0.001),
      ], 128, 0, 2.0
    ),
    new THREE.LatheGeometry(
      [
        new THREE.Vector2(0.33, 0.001),
        new THREE.Vector2(0.23, 0.001)
      ],128, Math.PI, 5.2
    ),
  );

  /*
  * Geometry to Mesh and register meshes to scene
  */
  let meshes: THREE.Mesh[] = [];
  geometrys.map( ( geo ) => meshes.push( new THREE.Mesh( geo, new THREE.MeshBasicMaterial() ) ) );
  meshes.map( (m) => scene.add(m) );

  /*
  * meshes rotation function
  * use this for frame counter
  */
  const meshes_loop_speeds = [-0.04, 0.07, 0.02];
  let MeshesUpdate = () =>
    meshes.map( (mesh, index) =>
      mesh.rotation.y += meshes_loop_speeds[index]
    );


  // light settings
  const light = new THREE.DirectionalLight(0xffffff);
  light.position.set(1.0, 1.0, 1.0).normalize();
  scene.add(light);

  let model: VRM; // current vrm model

  // vrm model import
  const loader = new GLTFLoader();
  loader.load(
    '/models/undefined-chan-toon.vrm',

    (glft)=>{
      VRM.from(glft).then((vrm)=>{
        scene.add(vrm.scene);
        vrm.scene.rotation.y = Math.PI;
        
        vrm.humanoid!.getBoneNode(VRMSchema.HumanoidBoneName.LeftUpperArm)!.rotation.z = Math.PI/2 - 0.28;
        vrm.humanoid!.getBoneNode(VRMSchema.HumanoidBoneName.LeftHand)!.rotation.z = 0.1;
        vrm.humanoid!.getBoneNode(VRMSchema.HumanoidBoneName.RightUpperArm)!.rotation.z = -(Math.PI/2 - 0.28);
        vrm.humanoid!.getBoneNode(VRMSchema.HumanoidBoneName.RightHand)!.rotation.z = -0.1;

        vrm.blendShapeProxy!.setValue(VRMSchema.BlendShapePresetName.Fun, 1);
        vrm.blendShapeProxy!.setValue(VRMSchema.BlendShapePresetName.Sorrow, 0.08);
        vrm.blendShapeProxy!.update();

        vrm.lookAt!.target = camera;
        // vrm.lookAt!.update();
        
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
    model.lookAt!.update();

    renderer.render(scene, camera);
  }

  animate();

})