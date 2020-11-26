import * as THREE from "./three.js-dev/build/three.module.js";
import { OBJLoader } from "./three.js-dev/examples/jsm/loaders/OBJLoader.js";
import { OrbitControls } from "./three.js-dev/examples/jsm/controls/OrbitControls.js";
import { AnaglyphEffect } from './three.js-dev/examples/jsm/effects/AnaglyphEffect.js'
import { VRButton } from './three.js-dev/examples/jsm/webxr/VRButton.js';
import { XRControllerModelFactory } from './three.js-dev/examples/jsm/webxr/XRControllerModelFactory.js';


export function gr_1() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x00001a);
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  const renderer = new THREE.WebGLRenderer();
  const orbit_controls = new OrbitControls(camera, renderer.domElement);
  const loader = new THREE.TextureLoader();

  //audio
  const listener = new THREE.AudioListener();
camera.add( listener );


 renderer.setSize(window.innerWidth, window.innerHeight);
 renderer.setPixelRatio(window.devicePixelRatio);

  let windowHalfX = window.innerWidth/2;
  let windowHalfY = window.innerHeighth/2;

  orbit_controls.enableDamping = true;
  orbit_controls.dampingFactor = 0.05;
  orbit_controls.screenSpacePanning = false;
  orbit_controls.minDistance = 100;
  orbit_controls.maxDistance = 500;
  orbit_controls.maxPolarAngle = Math.PI / 2;

  let object;

const geometry = new THREE.SphereGeometry();

//light
  const ambientLight = new THREE.AmbientLight(0xffcce6, 1);
  scene.add(ambientLight);

  const light = new THREE.DirectionalLight();
        light.position.set( 0.5, 1, 1 );
        light.castShadow = true;
        light.shadow.camera.zoom = 4; 
        scene.add( light );

//loadmodel+texture
  const manager = new THREE.LoadingManager(loadModel);
  const texture_loader = new THREE.TextureLoader(manager);
  const texture = texture_loader.load('./ship_tex.jpg');



//material
const material_m = new THREE.MeshPhongMaterial({
    color: "#ffffff",
morphTargets: true,
  });


const material_1 = new THREE.MeshPhongMaterial({
    map: loader.load ("./plan1.jpg")
  });

const material_4 = new THREE.MeshPhongMaterial({
    map: loader.load ("./plan4.jpg")
  });

const material_3 = new THREE.MeshPhongMaterial({
    map: loader.load ("./plan3.jpg")
  });

//object

  const object_loader = new OBJLoader(manager);
  object_loader.load('./ship_obj.obj', function (obj) {
    object = obj;
  }, onProgress, onError);



//orbi
const this_mesh = new THREE.Group();
 
 for (let i_counter = 0; i_counter < 2000; i_counter++) {
        let this_mesh = new THREE.Mesh(geometry, material_m);
        this_mesh.position.x = Math.random() * 1600 - 800;
        this_mesh.position.y = Math.random() * 1600 - 800;
        this_mesh.position.z = Math.random() * 1600 - 800;
        this_mesh.updateMatrix();
        this_mesh.matrixAutoUpdate = false;
        scene.add(this_mesh);

    }


    orbit_controls.update();

//planetas
const cube = new THREE.Mesh(geometry, material_1);
cube.scale.set(30, 30, 30);
cube.position.z = -100; 
 cube.position.y = 0;

scene.add(cube);

const cube1 = new THREE.Mesh(geometry, material_3);
cube1.scale.set(200, 200, 200);
cube1.position.z = -20; 
cube1.position.y = 0;
cube1.position.x =-400;

scene.add(cube1);

const cube2 = new THREE.Mesh(geometry, material_4);
cube2.scale.set(100, 100, 100);
cube2.position.z = 100; 
cube2.position.y = -100;
cube2.position.x =+400;

scene.add(cube2);

    let controller1, controller2;
    let controllerGrip1, controllerGrip2;

    document.body.appendChild( VRButton.createButton( renderer ) );

    controller1 = renderer.xr.getController( 0 );
    controller1.addEventListener( 'selectstart', onSelectStart );
    controller1.addEventListener( 'selectend', onSelectEnd );
    controller1.addEventListener( 'connected', function ( event ) {

        this.add( buildController( event.data ) );

    } );
    controller1.addEventListener( 'disconnected', function () {

        this.remove( this.children[ 0 ] );

    } );
    scene.add( controller1 );

    controller2 = renderer.xr.getController( 1 );
    controller2.addEventListener( 'selectstart', onSelectStart );
    controller2.addEventListener( 'selectend', onSelectEnd );
    controller2.addEventListener( 'connected', function ( event ) {

        this.add( buildController( event.data ) );

    } );
    controller2.addEventListener( 'disconnected', function () {

        this.remove( this.children[ 0 ] );

    } );
    scene.add( controller2 );

    // The XRControllerModelFactory will automatically fetch controller models
    // that match what the user is holding as closely as possible. The models
    // should be attached to the object returned from getControllerGrip in
    // order to match the orientation of the held device.

    const controllerModelFactory = new XRControllerModelFactory();

    controllerGrip1 = renderer.xr.getControllerGrip( 0 );
    controllerGrip1.add( controllerModelFactory.createControllerModel( controllerGrip1 ) );
    scene.add( controllerGrip1 );

    controllerGrip2 = renderer.xr.getControllerGrip( 1 );
    controllerGrip2.add( controllerModelFactory.createControllerModel( controllerGrip2 ) );
    scene.add( controllerGrip2 );

    let room;
    let count = 0;


//efect
const width = window.innerWidth || 2;
const height = window.innerHeight || 2;




  //Animation loop
  renderer.setAnimationLoop(function () {
 
cube.rotation.y += Math.PI/180;
cube1.rotation.z += Math.PI/150;
cube2.rotation.x += Math.PI/100;

  orbit_controls.update();

  handleController( controller1 );
  handleController( controller2 );
  renderer.render(scene,camera);
  });

    renderer.xr.enabled = true;
  document.body.appendChild(renderer.domElement);

  //Functions
  function loadModel() {
   object.traverse(function (child) {
     //traverse
     if (child.isMesh) {
       child.material.map = texture;
   }
    });
   object.scale.set(0.1,0.1,0.1);
    object.position.z = 0;    
    object.position.y = 0;
    object.position.x = 0;
    object.rotation.x = - Math.PI / 1;
    object.rotation.y = - Math.PI / 1.5 ;
    object.rotation.z = - Math.PI / 1 ;
    

    scene.add(object);
  }

  //On progress
  function onProgress(xhr) {
    if (xhr.lengthComputable) {
      const loading_completed = xhr.loaded / xhr.total / 100;
      console.log('Model ' + Math.round(loading_completed, 2) + '% loaded.');
    }
  }

  //On error
  function onError(err) {
    console.log(err);
  }

    // controllers

    function onSelectStart() {

        this.userData.isSelecting = true;

    }

    function onSelectEnd() {

        this.userData.isSelecting = false;

    }

    function buildController( data ) {

        let geometry, material;

        switch ( data.targetRayMode ) {

            case 'tracked-pointer':

                geometry = new THREE.BufferGeometry();
                geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( [ 0, 0, 0, 0, 0, - 1 ], 3 ) );
                geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( [ 0.5, 0.5, 0.5, 0, 0, 0 ], 3 ) );

                material = new THREE.LineBasicMaterial( { vertexColors: true, blending: THREE.AdditiveBlending } );

                return new THREE.Line( geometry, material );

            case 'gaze':

                geometry = new THREE.RingBufferGeometry( 0.02, 0.04, 32 ).translate( 0, 0, - 1 );
                material = new THREE.MeshBasicMaterial( { opacity: 0.5, transparent: true } );
                return new THREE.Mesh( geometry, material );

        }

    }

    function handleController( controller ) {

        if ( controller.userData.isSelecting ) {

            const object = room.children[ count ++ ];

            object.position.copy( controller.position );
            object.userData.velocity.x = ( Math.random() - 0.5 ) * 3;
            object.userData.velocity.y = ( Math.random() - 0.5 ) * 3;
            object.userData.velocity.z = ( Math.random() - 9 );
            object.userData.velocity.applyQuaternion( controller.quaternion );

            if ( count === room.children.length ) count = 0;

        }

    }

    function render() {

        handleController( controller1 );
        handleController( controller2 );

        //

        const delta = clock.getDelta() * 0.8; // slow down simulation

        const range = 3 - radius;

        for ( let i = 0; i < room.children.length; i ++ ) {

            const object = room.children[ i ];

            object.position.x += object.userData.velocity.x * delta;
            object.position.y += object.userData.velocity.y * delta;
            object.position.z += object.userData.velocity.z * delta;

            // keep objects inside room

            if ( object.position.x < - range || object.position.x > range ) {

                object.position.x = THREE.MathUtils.clamp( object.position.x, - range, range );
                object.userData.velocity.x = - object.userData.velocity.x;

            }

            if ( object.position.y < radius || object.position.y > 6 ) {

                object.position.y = Math.max( object.position.y, radius );

                object.userData.velocity.x *= 0.98;
                object.userData.velocity.y = - object.userData.velocity.y * 0.8;
                object.userData.velocity.z *= 0.98;

            }

            if ( object.position.z < - range || object.position.z > range ) {

                object.position.z = THREE.MathUtils.clamp( object.position.z, - range, range );
                object.userData.velocity.z = - object.userData.velocity.z;

            }

            for ( let j = i + 1; j < room.children.length; j ++ ) {

                const object2 = room.children[ j ];

                normal.copy( object.position ).sub( object2.position );

                const distance = normal.length();

                if ( distance < 2 * radius ) {

                    normal.multiplyScalar( 0.5 * distance - radius );

                    object.position.sub( normal );
                    object2.position.add( normal );

                    normal.normalize();

                    relativeVelocity.copy( object.userData.velocity ).sub( object2.userData.velocity );

                    normal = normal.multiplyScalar( relativeVelocity.dot( normal ) );

                    object.userData.velocity.sub( normal );
                    object2.userData.velocity.add( normal );

                }

            }

            object.userData.velocity.y -= 9.8 * delta;

        }

        renderer.render( scene, camera );

    }


}

  