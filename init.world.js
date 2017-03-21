var idv = idv || {};
idv.vr = idv.vr || {};


idv.vr.setupCamera = function () {
    // CAMERA

    // var camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
    // scene.add(camera);

    var fov = 40;
    var container = document.getElementById( 'container' );
    var windowWidth = 800;
    var windowHeight = 800;

    var startPosition = new THREE.Vector3( 0, 0, 0 );
    this.camera = new THREE.PerspectiveCamera( fov, windowWidth / windowHeight, 1, 3000 );
    this.camera.position.set( startPosition.x, startPosition.y, startPosition.z );

    this.scene.add(this.camera);
    //
    // camera.position.x = 2000;
    //
    this.controls = new THREE.OrbitControls( this.camera );
    // orbit control
    this.controls.userPanSpeed = 100;

    this.scene.add( new THREE.AxisHelper(1500) );

    var light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 0, 0, 1 );
    this.scene.add( light );

    return this;
};

idv.vr.getScene = function () {
    return this.scene;
};

idv.vr.getCamera = function () {
    return this.camera;
};

idv.vr.getRenderer = function () {
    return this.renderer;
};

idv.vr.getWireMaterial = function () {
  return this.wireframeMaterial;
};

idv.vr.addToScene = function (objThreeD) {
  this.scene.add(objThreeD);

  return this.scene;
};

idv.vr.getControls = function () {
    return this.controls;
};

idv.vr.init = function(){
    var container = document.getElementById( 'container' );
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setClearColor( 0xf0f0f0 );
    this.renderer.setSize( 800, 600);
    container.appendChild( this.renderer.domElement );

    this.wireframeMaterial = new THREE.MeshBasicMaterial( {
        side:THREE.DoubleSide,
        vertexColors: THREE.VertexColors
    });

    var stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.bottom = '10px';
    stats.domElement.style.left= '10px';
    container.appendChild( stats.domElement );

    return this;
};

//----------------------------------------------------------------------------
//	Animate
//----------------------------------------------------------------------------

function animate() {

    // console.log("working,,");
    requestAnimationFrame(animate);



    idv.vr.getControls().update();
}

function render() {
    idv.vr.getCamera().lookAt( idv.vr.getScene().position );
    idv.vr.getRenderer().render( idv.vr.getScene(), idv.vr.getCamera() );

}


//----------------------------------------------------------------------------
// ON RESIZE
//----------------------------------------------------------------------------
function onWindowResize() {

    idv.vr.getCamera().aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
    idv.vr.getCamera().updateProjectionMatrix();
    idv.vr.getRenderer().setSize( 800, 600 );

    render();

}
