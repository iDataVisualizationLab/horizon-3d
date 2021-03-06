if ( ! Detector.webgl ) Detector.addGetWebGLMessage();


var container, stats;

var views, glScene, glRenderer, camera, cssrenderer;
var cssScene, cssRenderer;

var light;

var mouseX = 0, mouseY = 0;

var windowWidth = 800,
    windowHeight = 600;

var realData;

var startPosition;


var data = {
    labels: {
        y: ["2%", "4%", "6%", "8%"],
        x: ['', "\'14","\'13","\'12","\'11","\'10","\'09","\'08","\'07","\'06","\'05"],
        z: ["1-month","3-month","6-month","1-year","2-year","3-year","5-year","7-year","10-year", "20-year","30-year"]
    }
};

d3.csv("data/ogallala.csv", function(error, data) {
    realData = data;
    init();
    render();
});


var graphDimensions = {
    w:1000,
    d:2405,
    h:800
};


function labelAxis(width, data, direction){

    var separator = 2*width/data.length,
        p = {
            x:0,
            y:0,
            z:0
        },
        dobj = new THREE.Object3D();

    for ( var i = 0; i < data.length; i ++ ) {
        var label = makeTextSprite(data[i]);

        label.position.set(p.x,p.y,p.z);

        dobj.add( label );
        if (direction=="y"){
            p[direction]+=separator;
        }else{
            p[direction]-=separator;
        }

    }
    return dobj;
}


// This was written by Lee Stemkoski
// https://stemkoski.github.io/Three.js/Sprite-Text-Labels.html
function makeTextSprite( message, parameters )
{
    if ( parameters === undefined ) parameters = {};

    var fontface = parameters["fontface"] || "Helvetica";
    var fontsize = parameters["fontsize"] || 70;
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    context.font = fontsize + "px " + fontface;

    // get size data (height depends only on font size)
    var metrics = context.measureText( message );
    var textWidth = metrics.width;


    // text color
    context.fillStyle = "rgba(0, 0, 0, 1.0)";
    context.fillText( message, 0, fontsize);

    // canvas contents will be used for a texture
    var texture = new THREE.Texture(canvas)
    texture.minFilter = THREE.LinearFilter;
    texture.needsUpdate = true;

    var spriteMaterial = new THREE.SpriteMaterial({ map: texture, useScreenCoordinates: false});
    var sprite = new THREE.Sprite( spriteMaterial );
    sprite.scale.set(100,50,1.0);
    return sprite;
}


//----------------------------------------------------------------------------
//  createAGrid
//
// opts
// {
// 	height: width,
// 	width: depth,
// 	linesHeight: b,
// 	linesWidth: c,
// 	color: 0xcccccc
// }
//
//____________________________________________________________________________

function createAGrid(opts){
    var config = opts || {
            height: 500,
            width: 500,
            linesHeight: 10,
            linesWidth: 10,
            color: 0xDD006C
        };

    var material = new THREE.LineBasicMaterial({
        color: config.color,
        opacity: 0.2
    });

    var gridObject = new THREE.Object3D(),
        gridGeo= new THREE.Geometry(),
        stepw = 2*config.width/config.linesWidth,
        steph = 2*config.height/config.linesHeight;

    //width
    for ( var i = - config.width; i <= config.width; i += stepw ) {
        gridGeo.vertices.push( new THREE.Vector3( - config.height, i,0 ) );
        gridGeo.vertices.push( new THREE.Vector3(  config.height, i,0 ) );

    }
    //height
    for ( var i = - config.height; i <= config.height; i += steph ) {
        gridGeo.vertices.push( new THREE.Vector3( i,- config.width,0 ) );
        gridGeo.vertices.push( new THREE.Vector3( i, config.width, 0 ) );
    }

    var line = new THREE.Line( gridGeo, material, THREE.LinePieces );
    gridObject.add(line);

    return gridObject;
}

//----------------------------------------------------------
// Initialize grids
//----------------------------------------------------------


function gridInit(){

    var boundingGrid = new THREE.Object3D(),
        depth = graphDimensions.w/2, //depth
        width = graphDimensions.d/2, //width
        height = graphDimensions.h/2, //height
        a =data.labels.y.length,
        b= data.labels.x.length,
        c= data.labels.z.length;

    //pink
    var newGridXY = createAGrid({
        height: width,
        width: height,
        linesHeight: b,
        linesWidth: a,
        color: 0xcccccc
    });
    //newGridXY.position.y = height;
    newGridXY.position.z = -depth;
    boundingGrid.add(newGridXY);

    //blue
    var newGridYZ = createAGrid({
        height: width,
        width: depth,
        linesHeight: b,
        linesWidth: c,
        color: 0xcccccc
    });
    newGridYZ.rotation.x = Math.PI/2;
    newGridYZ.position.y = -height;
    boundingGrid.add(newGridYZ);

    //green
    var newGridXZ = createAGrid({
        height: depth,
        width: height,
        linesHeight:c,
        linesWidth: a,
        color: 0xcccccc
    });

    newGridXZ.position.x = width;
    //newGridXZ.position.y = height;
    newGridXZ.rotation.y = Math.PI/2;
    boundingGrid.add(newGridXZ);

    glScene.add(boundingGrid);


    var labelsW = labelAxis(width, data.labels.x,"x");
    labelsW.position.x = width+40;
    labelsW.position.y = -height -40;
    labelsW.position.z = depth;
    glScene.add(labelsW);

    var labelsH = labelAxis(height, data.labels.y,"y");
    labelsH.position.x = width;
    labelsH.position.y = - height +(2*height/a)-20;
    labelsH.position.z = depth;
    glScene.add(labelsH);

    var labelsD = labelAxis(depth, data.labels.z, "z");
    labelsD.position.x = width;
    labelsD.position.y = -(height)-40;
    labelsD.position.z = depth-40;
    glScene.add(labelsD);
};


var getColor = function (saturatedThickness) {
    if (saturatedThickness < 20) {
        return "#ffffff";
    }

    if (saturatedThickness < 80) {
        return "#eef4f8";
    }

    if (saturatedThickness < 140) {
        return "#cce5f0";
    }

    if (saturatedThickness < 200) {
        return "#aed5e7";
    }

    if (saturatedThickness < 260) {
        return "#94c5dc";
    }

    if (saturatedThickness < 320) {
        return "#6aa2c2";
    }

    if (saturatedThickness < 380) {
        return "#6aa2c2";
    }

    if (saturatedThickness < 440) {
        return "#5892b4";
    }

    if (saturatedThickness < 500) {
        return "#4781a6";
    }

    if (saturatedThickness < 560) {
        return "#3a7195";
    }

    if (saturatedThickness < 620) {
        return "#326082";
    }

    if (saturatedThickness < 680) {
        return "#2c506c";
    }

    return "#243d52";
};

function init() {

    container = document.getElementById( 'container' );


//----------------------------------------------------------------------------
//   Set up camera
//____________________________________________________________________________
    vFOVRadians = 2 * Math.atan( windowHeight / ( 2 * 1500 ) ),
        //fov = vFOVRadians * 180 / Math.PI;
        fov = 40;
    startPosition = new THREE.Vector3( 0, 0, 3000 );
    camera = new THREE.PerspectiveCamera( fov, windowWidth / windowHeight, 1, 30000 );
    camera.position.set( startPosition.x, startPosition.y, startPosition.z );


    controls = new THREE.OrbitControls( camera );
    controls.damping = 0.2;
    controls.addEventListener( 'change', render );

//----------------------------------------------------------------------------
//   Create scenes for webGL
//____________________________________________________________________________

    glScene = new THREE.Scene();


//----------------------------------------------------------------------------
//    Add a light source & create Canvas
//____________________________________________________________________________

    light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 0, 0, 1 );
    glScene.add( light );

    // create canvas
    var canvas = document.createElement( 'canvas' );
    canvas.width = 128;
    canvas.height = 128;

    var context = canvas.getContext( '2d' );


//----------------------------------------------------------------------------
//    data
//____________________________________________________________________________

    gridInit();

    var wireframeMaterial = new THREE.MeshBasicMaterial( {
        side:THREE.DoubleSide,
        vertexColors: THREE.VertexColors
    });

    var lineMat = new THREE.LineBasicMaterial({
        color: 0xffffff
    });
    var blacklineMat = new THREE.LineBasicMaterial({
        color: 0x000000
    });

    var floorGeometry = new THREE.PlaneGeometry(graphDimensions.w,graphDimensions.d, 98, 166);
    var faceColors = [];
    var lines={};
    var point;
    // on plane Geometry, change the z value to create the 3D area surface
    // just like when creating a terrain
    for (var i =0; i< floorGeometry.vertices.length; i++){

        //push colors to the faceColors array
        point = realData[i];
        point.lat = +point.lat;
        point.lon = +point.lon;
        point.sat = +point.sat;
        //push colors to the faceColors array
        faceColors.push(getColor(point.sat)); // one vertex on color, depending current data value

        floorGeometry.vertices[i].z = point.sat < 20 ? "null" : point.sat;
    }

    //vertexColors
    for (var x= 0; x <floorGeometry.faces.length; x++){
        floorGeometry.faces[x].vertexColors[0] = new THREE.Color(faceColors[floorGeometry.faces[x].a]);
        floorGeometry.faces[x].vertexColors[1] = new THREE.Color(faceColors[floorGeometry.faces[x].b]);
        floorGeometry.faces[x].vertexColors[2] = new THREE.Color(faceColors[floorGeometry.faces[x].c]);
    }

    // //grid lines
    // for (line in lines){
    //     if (line == "-500"){
    //         var graphLine= new THREE.Line(lines[line], blacklineMat);
    //     }else{
    //         var graphLine = new THREE.Line(lines[line], lineMat);
    //     }
    //
    //     graphLine.rotation.x = -Math.PI/2;
    //     graphLine.position.y = -graphDimensions.h/2;
    //
    //     graphLine.rotation.z = Math.PI/2;
    //
    //     glScene.add(graphLine);
    // }


    var floor = new THREE.Mesh(floorGeometry, wireframeMaterial);
    floor.rotation.x = -Math.PI/2;
    floor.position.y = -graphDimensions.h/2;

    floor.rotation.z = Math.PI/2;
    glScene.add(floor);

//----------------------------------------------------------------------------
//    SET UP RENDERERS
//____________________________________________________________________________

    //set up webGL renderer
    glRenderer = new THREE.WebGLRenderer();
    glRenderer.setPixelRatio( window.devicePixelRatio );
    glRenderer.setClearColor( 0xf0f0f0 );
    glRenderer.setSize( windowWidth, windowHeight);
    container.appendChild( glRenderer.domElement );

//----------------------------------------------------------------------------
//    SET UP STATS
//____________________________________________________________________________

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.bottom = '10px';
    stats.domElement.style.left= '10px';
    container.appendChild( stats.domElement );


    // set up window resize listener
    window.addEventListener( 'resize', onWindowResize, false );
    animate();
}



//----------------------------------------------------------------------------
//	Animate
//----------------------------------------------------------------------------

function animate() {
    requestAnimationFrame(animate);
    controls.update();
}

function render() {
    camera.lookAt( glScene.position );
    glRenderer.render( glScene, camera );
    stats.update();

}


//----------------------------------------------------------------------------
// ON RESIZE
//----------------------------------------------------------------------------
function onWindowResize() {

    camera.aspect = windowWidth / windowHeight;
    camera.updateProjectionMatrix();

    glRenderer.setSize( windowWidth, windowHeight );
    render();

}

