import { RGBELoader } from './examples/jsm/loaders/RGBELoader.js';
import { GLTFLoader } from './examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from './examples/jsm/controls/OrbitControls.js';
var container, controls;
var camera, scene, renderer;

init();
render();

function init() {
    container = document.createElement('div');
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.25, 200 );
	camera.position.set( - 1.8, .6, 27 );

    scene = new THREE.Scene();
    
    new RGBELoader()
        .setDataType( THREE.UnsignedByteType )
        .setPath( 'textures/')
        .load( 'st_fagans_interior_1k.hdr', function ( texture ) {

            var envMap = pmremGenerator.fromEquirectangular( texture ).texture;

            scene.background = envMap;
            scene.environment = envMap;
            
            texture.dispose();
            pmremGenerator.dispose();
            
            render();
            
            var loader = new GLTFLoader().setPath( 'models/' );
			loader.load( '01_without_alpa.glb', function ( gltf ) {
                gltf.scene.traverse( function ( child ) {

                } );
                //gltf.scene.setSize(.5);
                scene.add( gltf.scene );

                render();


            } );
        
        } );

    renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = 1;
	renderer.outputEncoding = THREE.sRGBEncoding;
	container.appendChild( renderer.domElement );

	var pmremGenerator = new THREE.PMREMGenerator( renderer );
	pmremGenerator.compileEquirectangularShader();

	controls = new OrbitControls( camera, renderer.domElement );
	controls.addEventListener( 'change', render ); // use if there is no animation loop
	controls.minDistance = 2;
    controls.maxDistance = 30;

	controls.target.set( 0, 0, - 0.2 );
	controls.update();

	window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    render();

}

function render() {
    renderer.render( scene, camera );

}