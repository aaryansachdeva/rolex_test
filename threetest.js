var scene = new THREE.Scene();
scene.background = new THREE.Color( 0xa0a0a0 );
scene.fog = new THREE.Fog( 0xa0a0a0, 10, 50 );

clock = new THREE.Clock();

var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer({antialias: true});

renderer.setSize( window.innerWidth, window.innerHeight );
renderer.physicallyCorrectLights = true;
renderer.shadowMap.enabled = true;

controls = new THREE.OrbitControls(camera, renderer.domElement);
document.body.appendChild( renderer.domElement );


//SPHERE
var geometry = new THREE.SphereGeometry(1,32,32);
var material = new THREE.MeshLambertMaterial();
var sphere = new THREE.Mesh(geometry,material);
//scene.add(sphere);

let loader = new THREE.GLTFLoader();
loader.load('tr_rt.glb', function(gltf){
    mixer = new THREE.AnimationMixer( gltf.scene );
    tr = gltf.scene;
    tr.scale.set(2,2,2);
    tr.castShadow = true;
    tr.position.set(0,0,0);
    var animations = gltf.animations;
	var action = mixer.clipAction( animations[1] );
	action.play();
    scene.add(gltf.scene);
})

var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 100, 100 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
mesh.rotation.x = - Math.PI / 2;
mesh.receiveShadow = true;
scene.add( mesh );


var dirLight = new THREE.DirectionalLight( 0xffffff,1 );
dirLight.position.set( - 3, 10, - 10 );
dirLight.castShadow = true;
dirLight.shadow.camera.top = 2;
dirLight.shadow.camera.bottom = - 2;
dirLight.shadow.camera.left = - 2;
dirLight.shadow.camera.right = 2;
dirLight.shadow.camera.near = 0.1;
dirLight.shadow.camera.far = 40;
scene.add( dirLight );

var hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
hemiLight.position.set( 0, 20, 0 );
scene.add( hemiLight );

camera.position.z = 5;
camera.position.y = .5;

camera.rotation.x = 30/180 * Math.PI;



function animate() {
    requestAnimationFrame(animate);
    var delta = clock.getDelta();
    if ( mixer ) mixer.update( delta );
    sphere.rotation.x += 0.01;
    sphere.rotation.y += 0.01;
    renderer.render(scene,camera);
}

animate();