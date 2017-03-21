if ( ! Detector.webgl ) {
    Detector.addGetWebGLMessage();
    document.getElementById( 'container' ).innerHTML = "";
}

var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;


var graphDimensions = {
    w:1000,
    d:2405,
    h:800
};


var idv = idv || {};
idv.vr = idv.vr || {};

idv.vr.getColor = function (saturatedThickness) {
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

idv.vr.createGeometry = function (pointData) {

    // ogallala-2-2: 99 witdth, 167 height pixels
    var floorGeometry = new THREE.PlaneGeometry(graphDimensions.w, graphDimensions.d, 98, 166);
    var colors = ["#eef4f8","#ddecf4","#cce5f0","#bcddec","#aed5e7","#a0cde2","#94c5dc","#89bcd6","#7eb4d0","#74abc9","#6aa2c2","#619abb","#5892b4","#4f8aad","#4781a6","#3f799f","#3a7195","#35688c","#326082","#2f5877","#2c506c","#243d52"];
    var faceColors = [];

    var saturatedThickness;
    var point;
    // on plane Geometry, change the z value to create the 3D area surface
    // just like when creating a terrain
    for (var i =0; i< floorGeometry.vertices.length; i++){

        point = pointData[i];
        if (point == undefined) {
            debugger;
        }
        point.lat = +point.lat;
        point.lon = +point.lon;
        point.sat = +point.sat;
        //push colors to the faceColors array
        faceColors.push(idv.vr.getColor(point.sat)); // one vertex on color, depending current data value

        floorGeometry.vertices[i].z = point.sat < 20 ? "null" : point.sat;

        // if (pointData[i][2] == null){
        //     //hack hack hack
        //     floorGeometry.vertices[i].z="null";
        //
        // }else{
        //     saturatedThickness = pointData[i][2]*100;
        //     floorGeometry.vertices[i].z= saturatedThickness;
        // }
    }

    //vertexColors
    for (var x= 0; x <floorGeometry.faces.length; x++){
        floorGeometry.faces[x].vertexColors[0] = new THREE.Color(faceColors[floorGeometry.faces[x].a]);
        floorGeometry.faces[x].vertexColors[1] = new THREE.Color(faceColors[floorGeometry.faces[x].b]);
        floorGeometry.faces[x].vertexColors[2] = new THREE.Color(faceColors[floorGeometry.faces[x].c]);
    }

    return floorGeometry;

};

idv.vr.createCubeGeometry = function (pointData) {

    new THREE.PlaneGeometry(1000, 800, 98, 166);
 };

idv.vr.play = function () {
    d3.csv("data/ogallala.csv", function(error, pointData) {

        idv.vr.init();

        idv.vr.setupCamera();

        // var floorGeometry = idv.vr.createGeometry(pointData);
        var floorGeometry = idv.vr.createCubeGeometry(pointData);
        var floor = new THREE.Mesh(floorGeometry, idv.vr.getWireMaterial());
        floor.rotation.x = -Math.PI/2;
        floor.position.y = -graphDimensions.h/2;
        floor.rotation.z = Math.PI/2;

        idv.vr.addToScene(floor);

        // set up window resize listener
        window.addEventListener( 'resize', onWindowResize, false );

        render();

        animate();

    });
};

idv.vr.play();