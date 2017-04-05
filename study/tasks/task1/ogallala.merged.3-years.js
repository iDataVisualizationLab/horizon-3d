if ( ! Detector.webgl ) {
    Detector.addGetWebGLMessage();
    document.getElementById( 'container' ).innerHTML = "";
}

var url = window.location.href;
var maxYear = {value: -9999, year: null};
var trialLocation = {};
trialLocation.lat = +getParameterByName("lat", url);
trialLocation.lon =  +getParameterByName("lon", url);

var container, stats;

var views, glScene, glRenderer, camera, cssrenderer;
var cssScene, cssRenderer;

var light;

var mouseX = 0, mouseY = 0;

var windowWidth =  1200,
    windowHeight = 800;

var realData2011;
var realData2012;
var realData2013;

var startPosition;

var controls;

var max = {
    lat: 0, // z label.z; graphDimensions.w
    lon: 0, // x label.x; graphDimensions.d
    sat: -9999 // y label.y; graphDimensions.h
};

// var max = {
//     lat: 100, // z label.z; graphDimensions.w
//     lon: 167, // x label.x; graphDimensions.d
//     sat: 2000 // y label.y; graphDimensions.h
// };

var data = {
    labels: {
        y: ["500", "1000", "1500", "2000", "2500", "3000"],
        x: ['', "20","40","60","80","100","120","140","160","180"],
        z: ["", "10","20","30","40","50","60","70","80","90"]
    }
};

d3.csv("../data/ascii_2010all.optimized-2-2.optimized-2-2.converted.csv", function(error, data2011) {
    realData2011 = data2011;

    d3.csv("../data/ascii_2014all.optimized-2-2.optimized-2-2.converted.csv", function(error, data2012) {
        realData2012 = data2012;

        d3.csv("../data/ascii_2016all.optimized-2-2.optimized-2-2.converted.csv", function(error, data2013) {
            realData2013 = data2013;

            init();
            render();
        });
    });

});


var graphDimensions = {
    w:1000,
    d:2405,
    h:1200
};

function getParameterByName(name, url) {
    if (!url) {
        url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}


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
        color: "#CCCCCC"
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
        color: "#CCCCCC"
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
        color: "#CCCCCC"
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
        return "#fbd1b0";
    }

    if (saturatedThickness < 140) {
        return "#d9a78c";
    }

    if (saturatedThickness < 200) {
        return "#b49b69";
    }

    if (saturatedThickness < 260) {
        return "#6b936b";
    }

    if (saturatedThickness < 320) {
        return "#00759e";
    }

    if (saturatedThickness < 380) {
        return "#006493";
    }

    if (saturatedThickness < 440) {
        return "#005388";
    }

    if (saturatedThickness < 500) {
        return "#00437c";
    }

    if (saturatedThickness < 560) {
        return "#00326e";
    }

    if (saturatedThickness < 620) {
        return "#00215d";
    }

    if (saturatedThickness < 680) {
        return "#00114d";
    }

    return "#00003c";
};

var myPoint;
function createGeometry(dataYear, scale, graphBase) {
    if (!graphBase) {
        graphBase = 0;
    }

    if (!scale) {
        scale = 1;
    }

    var floorGeometry = new THREE.PlaneGeometry(graphDimensions.w,graphDimensions.d, 148, 284);
    var faceColors = [];
    var point;
    // on plane Geometry, change the z value to create the 3D area surface
    // just like when creating a terrain
    var myHeight;

    trialLocation.sat = null;
    trialLocation.x = null;
    trialLocation.y = null;
    trialLocation.vertices = [];

    var point200 = [];
    var point600 = [];
    var pointAbove600 = [];

    for (var i =0; i< floorGeometry.vertices.length; i++){

        //push colors to the faceColors array
        point = dataYear[i];
        point.lat = +point.lat;
        point.lon = +point.lon;
        point.sat = +point.sat;

        if (point.sat > 0 && point.sat < 300) {
            point200.push(point);
        }
        else if (point.sat < 600 && point.sat  >300) {
            point600.push(point);
        }
        else if (point.sat > 600) {
            pointAbove600.push(point);
        }

        if (point.lat == trialLocation.lat && point.lon == trialLocation.lon) {
            trialLocation.sat = point.sat;
            trialLocation.x = floorGeometry.vertices[i].x;
            trialLocation.y = floorGeometry.vertices[i].y;
            trialLocation.z = scale*point.sat;

            trialLocation.vertices.push(new THREE.Vector3(floorGeometry.vertices[i].x, floorGeometry.vertices[i].y, scale*point.sat + 10))
        }

        if (max.lat < point.lat) {
            max.lat = point.lat;
        }

        if (max.lon < point.lon) {
            max.lon = point.lon;
        }

        if (max.sat < point.sat) {
            max.sat = point.sat;
        }

        //push colors to the faceColors array
        faceColors.push(getColor(point.sat)); // one vertex on color, depending current data value

        myHeight = scale*point.sat;

        floorGeometry.vertices[i].z = graphBase + ( myHeight < 0 ? "null" : myHeight );

        // if (!lines[floorGeometry.vertices[i].x]) {
        //     lines[floorGeometry.vertices[i].x] = new THREE.Geometry();
        // }
        //
        // lines[floorGeometry.vertices[i].x].vertices.push(new THREE.Vector3(floorGeometry.vertices[i].x, floorGeometry.vertices[i].y, realData[i][2]*100));

    }

    console.log(point200);
    console.log(point600);
    console.log(pointAbove600);

    console.log(max);
    //vertexColors
    for (var x= 0; x <floorGeometry.faces.length; x++){
        floorGeometry.faces[x].vertexColors[0] = new THREE.Color(faceColors[floorGeometry.faces[x].a]);
        floorGeometry.faces[x].vertexColors[1] = new THREE.Color(faceColors[floorGeometry.faces[x].b]);
        floorGeometry.faces[x].vertexColors[2] = new THREE.Color(faceColors[floorGeometry.faces[x].c]);
    }

    return floorGeometry;
}

function addDot(myColor, vertices, text) {
    var dotGeometry = new THREE.Geometry();
    for(var i=0; i< trialLocation.vertices.length; i ++) {
        dotGeometry.vertices.push(vertices[i]);
    }
    var dotMaterial = new THREE.PointCloudMaterial( { size: 8, sizeAttenuation: false, color: myColor } );
    var dot = new THREE.Points( dotGeometry, dotMaterial );
    dot.rotation.x = -Math.PI/2;
    dot.position.y = -graphDimensions.h/2;
    dot.rotation.z = Math.PI/2;

    glScene.add( dot );

    if (!!text) {
        var location = {
            x: trialLocation.x,
            y: trialLocation.y,
            z: trialLocation.z
        };

        addText(location, text)
    }
}


function addText(position, myText) {

    var loader = new THREE.FontLoader();

    loader.load( '../Open_Sans_Regular.json', function ( font ) {

        var options = {
            size: 90,
            height: 90,
            weight: 'normal',
            font: font,
            style: 'normal',
            curveSegments: 12,
            bevelThickness: 2,
            bevelSize: 4,
            bevelEnabled: true,
            material: 0,
            extrudeMaterial: 1
        };

        if (!position) {
            position = {x: 0, y: 0};
        }

        var textGeo = new THREE.TextGeometry(myText, options);
        var textMatterial = new THREE.MeshBasicMaterial( {
            side:THREE.DoubleSide,
            color: '#000000'
        });

        textGeo.computeBoundingBox();
        textGeo.computeVertexNormals();

        // textGeo.position.x = position.x;
        // textGeo.position.y = position.y;
        // textGeo.position.z = position.z;

        var textMesh = new THREE.Mesh(textGeo, textMatterial);
        // textMesh.rotation.x = -Math.PI/2;
        // textMesh.position.y = -graphDimensions.h/2;
        // textMesh.rotation.z = Math.PI/2;

        // textMesh.position.x = position.x;
        // textMesh.position.y = position.y;
        // textMesh.position.z = position.z;

        glScene.add( textMesh );
    });


}



function init() {

    container = document.getElementById( 'container' );


//----------------------------------------------------------------------------
//   Set up camera
//____________________________________________________________________________
    var vFOVRadians = 2 * Math.atan( windowHeight / ( 2 * 1500 ) ),
        //fov = vFOVRadians * 180 / Math.PI;
        fov = 40;
    startPosition = new THREE.Vector3( 0, 1000, 2500 );
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

    // var wireframeMaterial = new THREE.MeshBasicMaterial( {
    //     side:THREE.DoubleSide,
    //     vertexColors: THREE.VertexColors
    // });

    var cTen = d3.scale.category10();
    var colorRange = cTen.range();

    var material2011 = new THREE.MeshBasicMaterial( {
        side:THREE.DoubleSide,
        color: colorRange[0]
    });

    var redMaterial = new THREE.MeshBasicMaterial( {
        side:THREE.DoubleSide,
        color: colorRange[1]
    });

    var material2013 = new THREE.MeshBasicMaterial( {
        side:THREE.DoubleSide,
        color: colorRange[2]
    });

    var lineMat = new THREE.LineBasicMaterial({
        color: 0xffffff
    });
    var blacklineMat = new THREE.LineBasicMaterial({
        color: 0x000000
    });

    var floorGeometry2011 = createGeometry(realData2011);
    var floor2011 = new THREE.Mesh(floorGeometry2011, material2011);
    floor2011.rotation.x = -Math.PI/2;
    floor2011.position.y = -graphDimensions.h/2;
    floor2011.rotation.z = Math.PI/2;
    // addDot(colorRange[0], trialLocation.vertices);
    addDot('#FFFF00', trialLocation.vertices);
    maxYear.value = trialLocation.sat;
    maxYear.year = 2010;
    maxYear.y1 = 2010;
    maxYear.v1 = trialLocation.sat;


    var floorGeometry2012 = createGeometry(realData2012);
    var floor2012 = new THREE.Mesh(floorGeometry2012, redMaterial);
    floor2012.rotation.x = -Math.PI/2;
    floor2012.position.y = -graphDimensions.h/2;
    floor2012.rotation.z = Math.PI/2;

    addDot('#FF0000', trialLocation.vertices);
    maxYear.y2 = 2014;
    maxYear.v2 = trialLocation.sat;
    if (trialLocation.sat > maxYear.value) {
        maxYear.value = trialLocation.sat;
        maxYear.year = 2014;
    }



    var floorGeometry2013 = createGeometry(realData2013);
    var floor2013 = new THREE.Mesh(floorGeometry2013, material2013);
    floor2013.rotation.x = -Math.PI/2;
    floor2013.position.y = -graphDimensions.h/2;
    floor2013.rotation.z = Math.PI/2;

    addDot('#00FF00', trialLocation.vertices);
    maxYear.y3 = 2016;
    maxYear.v3 = trialLocation.sat;
    if (trialLocation.sat > maxYear.value) {
        maxYear.value = trialLocation.sat;
        maxYear.year = 2016;
    }

    var group = new THREE.Object3D();
    group.add(floor2011);
    group.add(floor2012);
    group.add(floor2013);


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

    glScene.add(group);

//----------------------------------------------------------------------------
//    SET UP RENDERERS
//____________________________________________________________________________

    //set up webGL renderer
    glRenderer = new THREE.WebGLRenderer();
    glRenderer.setPixelRatio( window.devicePixelRatio );
    glRenderer.setClearColor("#FFFFFF");
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

    console.log("done calling animate");
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

