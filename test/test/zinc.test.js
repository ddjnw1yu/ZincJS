import Zinc from "../../src/zinc";
import {assert} from 'chai';
import nock from 'nock';
const THREE = Zinc.THREE;
import fs from 'file-system';
const container = window.document.querySelector("#container");
let geometryCount = 0;
global.XMLHttpRequest = require("xhr2");

var testBoxGeometry = new THREE.BoxGeometry( 10, 10, 10 );

var preRenderCallback = function() {
  return function() {
    it('PreRenderCallbackFunction',function() 
      {assert.isTrue(true, 'PreRenderCallbackFunction is successfully called');}
    );
  }
}

var geometryCallback = function() {
  return function(geometry) {
    assert.isObject(geometry, 'geometry has been read'); 
    geometryCount = geometryCount + 1;
  }
}

function checkControls(scene) {
  describe('Controls()', function(){
    var controls = undefined;
    before('Get Camera Controls', function() {
      controls = scene.getZincCameraControls();
      assert.isObject(controls, 'controls is available');
    });
    describe('Local Variables()', function(){
      it('cameraObject', function(){
        assert.isObject(controls.cameraObject, 'cameraObject is an object');
      });
      //it('domElement', function(){
      //  assert.isObject(controls.domElement, 'domElement is an object');
      //});
      it('renderer', function(){
        assert.isObject(controls.renderer, 'renderer is an object');
      });
      it('scene', function(){
        assert.isObject(controls.scene, 'renderer is an object');
      });
      it('tumble_rate', function(){
        assert.equal(controls.tumble_rate, 1.5, 'tumble_rate is correct');
      });
      it('zoomRate', function(){
        assert.equal(controls.zoomRate, 50, 'zoomRate is correct');
      });
      it('rotateRate', function(){
        assert.equal(controls.rotateRate, 50, 'rotateRate is correct');
      });
      it('panRate', function(){
        assert.equal(controls.panRate, 100, 'panRate is correct');
      });
    });
    describe('Methods()', function(){
      before('Setup Mock response', function() {
        var scope = nock('https://www.mytestserver.com')
          .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
          .get(function(uri) {
            console.log(uri)
            return uri;
          })
          .reply(200, (uri, requestBody, cb) => {console.log(uri);fs.readFile("." + uri, cb)});
      });
      it('setMouseButtonAction', function(){
        assert.isUndefined(controls.setMouseButtonAction("AUXILIARY", "ZOOM"), 'setMouseButtonAction is successfully called');
      });
      it('updateDirectionalLight', function(){
        assert.isUndefined(controls.updateDirectionalLight(), 'updateDirectionalLight is successfully called');
      });
      it('disable', function(){
        assert.isUndefined(controls.updateDirectionalLight(), 'disable is successfully called');
      });
      it('enable', function(){
        assert.isUndefined(controls.enable(""), 'enable is successfully called');
      });
      it('setPathDuration', function(){
        assert.isUndefined(controls.setPathDuration(2000), 'setPathDuration is successfully called');
      });
      it('setTime', function(){
        assert.isUndefined(controls.setTime(1000), 'setTime is successfully called');
      });
      it('setPlayRate', function(){
        assert.isUndefined(controls.setPlayRate(200), 'setPlayRate is successfully called');
      });
      it('loadPathURL', function(done){
        assert.isUndefined(controls.loadPathURL('https://www.mytestserver.com/models/test_path.json', done),
        'loadPathURL is successfully called');
      });
      it('getNumberOfTimeFrame', function(){
        assert.equal(controls.getNumberOfTimeFrame(), 8135, 'getNumberOfTimeFrame returns the correct value');
      });
      it('getCurrentTimeFrame', function(){
        assert.equal(controls.getCurrentTimeFrame()[0], 4067, 'getCurrentTimeFrame returns the correct value');
      });
      it('setCurrentTimeFrame', function(){
        assert.isUndefined(controls.setCurrentTimeFrame(4110), 'setCurrentTimeFrame is successfully called');
        assert.equal(controls.getCurrentTimeFrame()[0], 4110, 'getCurrentTimeFrame returns the correct value');
      });
      it('playPath', function(){
        assert.isUndefined(controls.playPath(), 'playPath is successfully called');
        assert.isTrue(controls.isPlayingPath(), 'Playing path');
      });
      it('update', function(){
        assert.isTrue(controls.update(1), 'update is successfully called');
        assert.equal(controls.getCurrentTimeFrame()[0], 4923, 'getCurrentTimeFrame returns the correct value');
      });
      it('stopPath', function(){
        assert.isUndefined(controls.stopPath(), 'stopPath is successfully called');
        assert.isFalse(controls.isPlayingPath(), 'Stop playing path');
      });
      it('enableDirectionalLightUpdateWithPath', function(){
        assert.isUndefined(controls.enableDirectionalLightUpdateWithPath(true),
          'enableDirectionalLightUpdateWithPath is successfully called');
      });
      it('enableDeviceOrientation', function(){
        assert.isUndefined(controls.enableDeviceOrientation(), 'enableDeviceOrientation is successfully called');
        assert.isTrue(controls.isDeviceOrientationEnabled(), 'Device Orientation is correctly enabled');
      });
      it('disableDeviceOrientation', function(){
        assert.isUndefined(controls.disableDeviceOrientation(), 'disableDeviceOrientation is successfully called');
        assert.isFalse(controls.isDeviceOrientationEnabled(), 'Device Orientation is correctly disable');
      });
      it('getViewportFromCentreAndRadius', function(){
        var viewport = controls.getViewportFromCentreAndRadius(10,20,30, 30, 40, 100);
        assert.isObject(viewport, 'getViewportFromCentreAndRadius successfully returns an object');
      });
      it('getDefaultViewport', function(){
        var viewport = controls.getDefaultViewport();
        assert.equal(viewport, 'default', 'getDefaultViewport successfully returns default');
      });
      it('getCurrentViewport', function() {
        var viewport = controls.getCurrentViewport();
        assert.isObject(viewport, 'getCurrentViewport successfully returns an object');
      });
      it('addViewport', function(){
        var viewport = controls.getViewportFromCentreAndRadius(10,20,30, 30, 40, 100);
        assert.isObject(viewport, 'getViewportFromCentreAndRadius successfully returns an object');
        assert.isUndefined(controls.addViewport('newViewport', viewport), 'addViewport  successfully called');
        assert.isObject(controls.getViewportOfName('newViewport'), 'getViewportOfName  successfully called');
      });
      it('setCurrentCameraSettings', function(){
        var viewport = controls.getViewportFromCentreAndRadius(10,20,30, 30, 40, 100);
        assert.isObject(viewport, 'getViewportFromCentreAndRadius successfully returns an object');
        assert.isUndefined(controls.setCurrentCameraSettings(viewport), 'setCurrentCameraSettings is successfully called');
        assert.equal(viewport.eyePosition[0], controls.getCurrentViewport().eyePosition[0], 'Current camera settings are set correctly');
      });
      it('resetView', function(){
        assert.isUndefined(controls.resetView(), 'resetView is successfully called');
      });
      it('cameraTransition', function(){
        var startingViewport = controls.getViewportFromCentreAndRadius(10,20,30, 30, 40, 100);
        var endingViewport = controls.getViewportFromCentreAndRadius(20,40,60, 60, 80, 200);
        assert.isUndefined(controls.cameraTransition(startingViewport, endingViewport, 2000), 
            'cameraTransition is successfully called');
      });
      it('enableCameraTransition', function(){
        assert.isUndefined(controls.enableCameraTransition(), 'enableCameraTransition is successfully called');
        assert.isTrue(controls.isTransitioningCamera(), 'camera transition is successfully enabled');
      });
      it('pauseCameraTransition', function(){
        assert.isUndefined(controls.pauseCameraTransition(), 'pauseCameraTransition is successfully called');
        assert.isFalse(controls.isTransitioningCamera(), 'camera transition is successfully paused');
      });
      it('stopCameraTransition', function(){
        assert.isUndefined(controls.stopCameraTransition(), 'stopCameraTransition is successfully called');
        assert.isFalse(controls.isTransitioningCamera(), 'camera transition is successfully stopped');
      });
      it('autoTumble', function(){
        assert.isUndefined(controls.autoTumble([1.0, 0.0], 0.01, true), 'autoTumble is successfully called');
      });
      it('enableAutoTumble', function(){
        assert.isUndefined(controls.enableAutoTumble(), 'enableAutoTumble is successfully called');
        assert.isTrue(controls.isAutoTumble(), 'auto tumble is successfully enabled');
      });
      it('updateAutoTumble', function(){
        assert.isUndefined(controls.updateAutoTumble(), 'updateAutoTumble is successfully called');
      });
      it('stopAutoTumble', function(){
        assert.isUndefined(controls.stopAutoTumble(), 'stopAutoTumble is successfully called');
        assert.isFalse(controls.isAutoTumble(), 'auto tumble is successfully stopped');
      });
      it('enableRaycaster', function(){
        assert.isUndefined(controls.enableRaycaster(scene, undefined, undefined), 'enableRaycaster is successfully called');
      });
      it('disableRaycaster', function(){
        assert.isUndefined(controls.disableRaycaster(), 'disableRaycaster is successfully called');
      });
    });
  });
}

function checkGeometry(scene) {
  describe('Geometry()', function(){
    let geometry = undefined;
    before('New Zinc Geometry', function() {
      geometry = new Zinc.Geometry();
      let options = {};
      options.colour = 0x00ff00;
      options.opacity = 1.0;
      options.localTimeEnabled = false;
      options.localMorphColour = false
      geometry.createMesh(testBoxGeometry, undefined, options);
      geometry.setName('TestGeometry');
      scene.addZincObject(geometry);
      assert.isObject(geometry, 'ZincGeometry has been created');
      assert.equal(geometry.groupName, "TestGeometry", 'ZincGeometry group name has been set');
    });
    describe('Local Variables()', function(){
      it('geometry', function(){
        assert.isObject(geometry.geometry, 'geometry is an object');
      });
      it('mixer', function(){
        assert.isObject(geometry.mixer, 'mixer is an object');
      });
      it('timeEnabled', function(){
        assert.isFalse(geometry.timeEnabled, 'timeEnabled is false');
      });
      it('morphColour', function(){
        assert.isFalse(geometry.morphColour, 'morphColour is an object');
      });
      it('morph', function(){
        assert.isObject(geometry.getMorph(), 'morph is an object');
      });
      it('clipAction', function(){
        assert.isUndefined(geometry.clipAction, 'clipAction is an object');
      });
      it('groupName', function(){
        assert.equal(geometry.groupName, "TestGeometry", 'groupName is correct');
      });
    });
    describe('Methods()', function(){
      it('getBoundingBox', function() {
        var boundingBox = geometry.getBoundingBox();
        assert.isObject(boundingBox, 'boundingBox is successfully called');
        assert.isObject(boundingBox.min,'boundingbox`s min is alright');
        assert.isObject(boundingBox.max, 'boundingbox`s max is alright');
      });
      it('setVisibility', function() {
        assert.isUndefined(geometry.setVisibility(false), 'setVisibility is successfully called');
        assert.isFalse(geometry.getVisibility(), 'visibility is false');
      });
      it('setAlpha', function() {
        assert.isUndefined(geometry.setAlpha(0.5), 'setAlpha is successfully called');
        assert.isTrue(geometry.getMorph().material.transparent, 'transparent is true');
        assert.equal(geometry.getMorph().material.opacity, 0.5, 'opacity is correct');
      });
      it('setMarkerMode', function() {
        assert.isUndefined(geometry.setMarkerMode("on"), 'setMarkerMode is successfully called');
        assert.equal(geometry.markerMode, "on", 'marker is set correctly');
        assert.isUndefined(geometry.setMarkerMode("off"), 'setMarkerMode is successfully called');
        assert.equal(geometry.markerMode, "off", 'marker is set correctly');
        assert.isUndefined(geometry.setMarkerMode("inherited"), 'setMarkerMode is successfully called');
        assert.equal(geometry.markerMode, "inherited", 'marker is set correctly');
      });
      it('getCurrentTime', function() {
        assert.equal(geometry.getCurrentTime(), 0.0, 'getCurrentTime returns the correct value');
      });
      it('setMorphTime', function() {
        assert.isUndefined(geometry.setMorphTime(1500), 'setMorphTime is successfully called');
        assert.equal(geometry.getCurrentTime(), 1500.0, 'getCurrentTime returns the correct value');
      });
      it('setWireframe', function() {
        assert.isUndefined(geometry.setWireframe(true), 'setWireframe is successfully called');
        assert.isTrue(geometry.getMorph().material.wireframe , 'wireframe is correct');
      });
      it('setColour', function() {
        assert.isUndefined(geometry.setColour(0x888888), 'setColour is successfully called');
        assert.equal(geometry.getMorph().material.color , 0x888888, 'colour is correct');
      });
      it('setVertexColour', function() {
        assert.isUndefined(geometry.setVertexColors(THREE.NoColors), 'setVertexColour is successfully called');
        assert.equal(geometry.getMorph().material.vertexColors , THREE.NoColors, 'colour is correct');
      });
      it('setMaterial', function() {
        var material = new THREE.MeshBasicMaterial( {
          color: 0x000000
        } );
        assert.isUndefined(geometry.setMaterial(material), 'setMaterial is successfully called');;
        assert.equal(geometry.getMorph().material, material, 'material is correct');
      });
      it('render', function() {
        assert.isUndefined(geometry.render(100, true), 'render is successfully called');
      });
    });
  });
}

function checkLines(lines) {
  describe('Lines()', function(){
    describe('Local Variables()', function(){
      it('lines', function(){
        assert.isObject(lines.getMorph(), 'geometry is an object');
      });
      it('timeEnabled', function(){
        assert.isTrue(lines.timeEnabled, 'timeEnabled is true');
      });
      it('morphColour', function(){
        assert.isFalse(lines.morphColour, 'morphColour is false');
      });
      it('clipAction', function(){
        assert.isObject(lines.clipAction, 'clipAction is an object');
      });
      it('groupName', function(){
        assert.equal(lines.groupName, "test lines", 'groupName is correct');
      });
    });
    describe('Methods()', function(){
      it('setMorphTime', function() {
        assert.isUndefined(lines.setMorphTime(1500), 'setMorphTime is successfully called');
      });
      it('getCurrentTime', function() {
        assert.equal(lines.getCurrentTime(), 1500.0, 'getCurrentTime returns the correct value');
      });
      it('getBoundingBox', function() {
        var boundingBox = lines.getBoundingBox();
        assert.isObject(boundingBox, 'boundingBox is successfully called');
        assert.isObject(boundingBox.min,'boundingbox`s min is alright');
        assert.isObject(boundingBox.max, 'boundingbox`s max is alright');
      });
      it('setName', function() {
        assert.isUndefined(lines.setName("lines1"), 'setName is successfully called');
        assert.equal(lines.groupName, 'lines1', 'name is correctly set');
      });
      it('setVisibility', function() {
        assert.isUndefined(lines.setVisibility(false), 'setVisibility is successfully called');
      });
      it('setWidth', function() {
        assert.isUndefined(lines.setWidth(3), 'setWidth is successfully called');
        assert.equal(lines.getMorph().material.linewidth, 3.0, 'setWidth sets the correct value');
      });
      it('isTimeVarying', function() {
        assert.isTrue(lines.isTimeVarying(), 'isTimeVarying is true');
      });
      it('render', function() {
        assert.isUndefined(lines.render(100, true), 'render is successfully called');
      });
    });
  });
}

function checkPoints(points) {
  describe('Points()', function(){
    describe('Local Variables()', function(){
      it('points', function(){
        assert.isObject(points.getMorph(), 'geometry is an object');
      });
      it('timeEnabled', function(){
        assert.isFalse(points.timeEnabled, 'timeEnabled is true');
      });
      it('morphColour', function(){
        assert.isFalse(points.morphColour, 'morphColour is false');
      });
      it('clipAction', function(){
        assert.isUndefined(points.clipAction, 'clipAction is an object');
      });
      it('groupName', function(){
        assert.equal(points.groupName, "test point", 'groupName is correct');
      });
    });
    describe('Methods()', function(){
      it('setMorphTime', function() {
        assert.isUndefined(points.setMorphTime(1500), 'setMorphTime is successfully called');
      });
      it('getCurrentTime', function() {
        assert.equal(points.getCurrentTime(), 1500.0, 'getCurrentTime returns the correct value');
      });
      it('getBoundingBox', function() {
        var boundingBox = points.getBoundingBox();
        assert.isObject(boundingBox, 'boundingBox is successfully called');
        assert.isObject(boundingBox.min,'boundingbox`s min is alright');
        assert.isObject(boundingBox.max, 'boundingbox`s max is alright');
      });
      it('setName', function() {
        assert.isUndefined(points.setName("points1"), 'setName is successfully called');
        assert.equal(points.groupName, 'points1', 'name is correctly set');
      });
      it('setVisibility', function() {
        assert.isUndefined(points.setVisibility(false), 'setVisibility is successfully called');
      });
      it('setSize', function() {
        assert.isUndefined(points.setSize(3.0), 'setSize is successfully called');
        assert.equal(points.getMorph().material.size, 3.0, 'setSize sets the correct value');
      });
      it('setSizeAttenuation', function() {
        assert.isUndefined(points.setSizeAttenuation(true), 'setSizeAttenuation is successfully called');
        assert.isTrue(points.getMorph().material.sizeAttenuation, 'setSizeAttenuation sets the correct value');
      });
      it('isTimeVarying', function() {
        assert.isFalse(points.isTimeVarying(), 'isTimeVarying is true');
      });
      it('render', function() {
        assert.isUndefined(points.render(100, true), 'render is successfully called');
      });
    });
  });
}

function checkTextureSlides(scene) {
  const rootRegion = scene.getRootRegion();
  describe('TextureSlides()', function(){
    before('Setup Mock response', function(done) {
      var scope = nock('https://www.mytestserver.com')
        .persist()
        .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
        .get(function(uri) {
          return uri;
        })
        .reply(200, (uri, requestBody, cb) => {fs.readFile("." + uri, cb)});

      scene.loadMetadataURL("https://www.mytestserver.com/models/test_ts_metadata.json", undefined, done);
    });

    describe('Methods()', function(){
      it('findObjectsWithGroupName', function() {
        let objects = rootRegion.findObjectsWithGroupName('textureSlides', false);
        assert.equal(objects.length, 1, 'Should be found in root region');
        assert.isTrue(objects[0].isTextureSlides, "Object should be a textureSlides");
      });
    });
  });
}


function checkCleanup(scene) {
  describe('Cleanup()', function(){
    describe('Local Variables()', function(){
      it('scene', function(){
        assert.isObject(scene, 'scene is an object');
      });
    });
    describe('Methods()', function(){
      it ('removeZincObject', function() {
        var glyphsets = scene.findGlyphsetsWithGroupName("test glyph");
        assert.lengthOf(glyphsets, 1, 'findGlyphsetsWithGroupName returns 1 geometry');
        assert.isUndefined(scene.removeZincObject(glyphsets[0]), 'removeZincGlyphset is successfully called');
        assert.lengthOf(scene.findGlyphsetsWithGroupName("test glyph"), 0, 'findLinesWithGroupName returns 0 point');
      });
      it('clearAll', function(){
        assert.isUndefined(scene.clearAll(), 'renderGeometries is successfully called');
      });
    });
  });
}

function checkScene(renderer) {
  var testScene = undefined;
  describe('Scene()', function(){
    var scene = renderer.createScene("TestScene");
    testScene = scene;
    it('New scene object', function(){
      assert.isObject(scene, 'Scene has been created');
    });
    var returnedValue = renderer.setCurrentScene(scene);
    it('Set as current scene', function(){
      assert.isUndefined(returnedValue, 'Scene has been set correctly');
    });
    describe('Local Variables()', function(){
      it('autoClearFlag', function(){
        assert.isTrue(scene.autoClearFlag, 'autoClearFlag equals `false`');
      });
    });

    describe('Methods()', function(){
      var testGeometry = undefined;
      before('addZincGeometry', function() {
        let options = {};
        options.colour = 0x00ff00;
        options.opacity = 1.0;
        options.localTimeEnabled = undefined;
        options.localMorphColour = undefined
        testGeometry = new Zinc.Geometry();
        testGeometry.createMesh(testBoxGeometry, undefined, options);
        testGeometry.setName("TestGeometry");
        scene.addZincObject(testGeometry);
        assert.isObject(testGeometry, 'ZincGeometry has been created');
        assert.equal(testGeometry.groupName, "TestGeometry", 'ZincGeometry group name has been set');
      });
      before('Setup Mock response', function() {
        var scope = nock('https://www.mytestserver.com')
          .persist()
          .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
          .get(function(uri) {
            return uri;
          })
          .reply(200, (uri, requestBody, cb) => {fs.readFile("." + uri, cb)}, {'Content-Type': 'application/json'});
      });
      it('loadView', function() {
        scene.loadViewURL("https://www.mytestserver.com/models/test_view.json");
      });
      it('loadMetadataURL', function(done) {
        scene.loadMetadataURL("https://www.mytestserver.com/models/test_metadata.json", undefined, 
          done);
      });
      it('onWindowResize', function(){
        assert.isUndefined(scene.onWindowResize(), 'onWindowResize is successfully called');
      });
      it('resetView', function(){
        assert.isUndefined(scene.resetView(), 'resetView is successfully called');
      });
      it('viewAll', function(){
        assert.isUndefined(scene.viewAll(), 'viewAll is successfully called');
      });
      it('getBoundingBox', function() {
        var boundingBox = scene.getBoundingBox();
        assert.isObject(boundingBox, 'boundingBox is successfully called');
        assert.isObject(boundingBox.min,'boundingbox`s min is alright');
        assert.isObject(boundingBox.max, 'boundingbox`s max is alright');
      });
      it('viewAllWithBoundingBox', function() {
        var boundingBox = scene.getBoundingBox();
        assert.isUndefined(scene.viewAllWithBoundingBox(boundingBox), 'viewAllWithBoundingBox is successfully called');
      });
      it ('forEachGeometry', function() {
        geometryCount = 0;
        scene.forEachGeometry(geometryCallback());
        assert.equal(3, geometryCount, 'forEachGeometry is called successfully.')
      });
      it ('forEachGlyphset', function() {
        geometryCount = 0;
        scene.forEachGlyphset(geometryCallback());
        assert.equal(1, geometryCount, 'forEachGlyphset is called successfully.')
      });
      it ('forEachPointset', function() {
        geometryCount = 0;
        scene.forEachPointset(geometryCallback());
        assert.equal(1, geometryCount, 'forEachPointset is called successfully.')
      });
      it ('forEachLine', function() {
        geometryCount = 0;
        scene.forEachLine(geometryCallback());
        assert.equal(1, geometryCount, 'forEachLine is called successfully.')
      });
      it ('findGeometriesWithGroupName', function() {
        assert.lengthOf(scene.findGeometriesWithGroupName("TestGeometry"), 1, 'findGeometriesWithGroupName returns 1 geometry');
      });
      it ('findGlyphsetsWithGroupName', function() {
        assert.lengthOf(scene.findGlyphsetsWithGroupName("test glyph"), 1, 'findGlyphsetsWithGroupName returns 1 glyphset');
      });
      it ('findLinesWithGroupName', function() {
        assert.lengthOf(scene.findLinesWithGroupName("test lines"), 1, 'findLinesWithGroupName returns 1 glyphset');
      });
      it ('findPointsetsWithGroupName', function() {
        assert.lengthOf(scene.findPointsetsWithGroupName("test point"), 1, 'findPointsetsWithGroupName returns 1 point');
      });
      it('updateDirectionalLight', function(){
        assert.isUndefined(scene.updateDirectionalLight(), 'updateDirectionalLight is successfully called');
      });
      it('isTimeVarying', function(){
        assert.isTrue(scene.isTimeVarying(), 'isTimeVarying is successfully called');
      });
      it('getCurrentTime', function(){
        assert.equal(scene.getCurrentTime(), 0.0, 'getCurrentTime is successfully called');
      });
      it('setMorphsTime', function(){
        assert.isUndefined(scene.setMorphsTime(1000.0), 'setMorphsTime is successfully called');
      });
      it('getZincCameraControls', function() {
        assert.isObject(scene.getZincCameraControls(), 'getZincCameraControls returns the correct object');
      });
      it('getThreeJSScene', function(){
        assert.isObject(scene.getThreeJSScene(), 'getThreeJSScene returns the correct object');
      });
      it('setInteractiveControlEnable', function(){
        assert.isUndefined(scene.setInteractiveControlEnable(true), 'setInteractiveControlEnable is successfully called');
      });
      it('setStereoEffectEnable', function(){
        assert.isUndefined(scene.setStereoEffectEnable(true), 'setStereoEffectEnable is successfully called');
      });
      it('isStereoEffectEnable', function(){
        assert.isTrue(scene.isStereoEffectEnable(), 'setStereoEffectEnable is successfully called');
      });
      it('setDuration', function(){
        assert.isUndefined(scene.setDuration(4000), 'setDuration is successfully called');
      });
      it('getDuration', function(){
        assert.equal(scene.getDuration(), 4000, 'getDuration returns the correct object');
      });
      it('alignObjectToCameraView', function(){
        assert.isUndefined(scene.alignObjectToCameraView(testGeometry,30000), 'alignObjectToCameraView is successfully called');
      });
      it('setCameraTargetToObject', function(){
        assert.isUndefined(scene.setCameraTargetToObject(testGeometry), 'setCameraTargetToObject is successfully called');
      });
      it('renderGeometries', function(){
        assert.isUndefined(scene.renderGeometries(500, 0.3, true), 'renderGeometries is successfully called');
      });
      it('removeZincObject', function(){
        assert.isUndefined(scene.removeZincObject(testGeometry), 'removeZincGeometry is successfully called');
      });
      if ('getNamedObjectsScreenXY', function() {
        assert.isObject(scene.getNamedObjectsScreenXY("TestGeometry"), 
          'getNamedObjectsScreenXY is successfully called');
      });
      describe("primitives()", function(){
        it ('Lines', function() {
          var lines = scene.findLinesWithGroupName("test lines");
          assert.lengthOf(lines, 1, 'findLinesWithGroupName returns 1 glyphset');
          checkLines(lines[0]);
        });
        it ('pointset', function() {
          var pointsets = scene.findPointsetsWithGroupName("test point");
          assert.lengthOf(pointsets, 1, 'findPointsetsWithGroupName returns 1 point');
          checkPoints(pointsets[0]);
        });
      });
      describe('Cleanup()', function(){
        it ('removeZincGlyphset', function() {
          checkCleanup(scene);
        });
      });
    });
  });
  return testScene;
}


function checkRegion(scene) {
  describe('Region()', function(){
    const rootRegion = scene.getRootRegion();
    before('Setup Mock response', function(done) {
      var scope = nock('https://www.mytestserver.com')
        .persist()
        .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
        .get(function(uri) {
          return uri;
        })
        .reply(200, (uri, requestBody, cb) => {fs.readFile("." + uri, cb)}, {'Content-Type': 'application/json'});
        scene.loadMetadataURL("https://www.mytestserver.com/models/test_region_metadata.json", undefined, 
          done);
    });

    describe('Methods()', function(){
      it('getRegion', function(){
        const cubeRegion = rootRegion.getChildWithName("cube");
        assert.isObject(cubeRegion, 'cube region is not found');
      });
      it('getGroup', function(){
        assert.isTrue(rootRegion.getGroup().isGroup, 'Visibility should be an object')
      });
      it('findChildFromPath', function(){
        const child = rootRegion.findChildFromPath("cube/grandChild_2/greatGrand");
        assert.isObject(child, 'child region is not found');
        assert.equal(child.getFullPath(), 'cube/grandChild_2/greatGrand',
          'child region path is not matching');
      });
      it('findOrCreateChildFromPath', function(){
        const child = rootRegion.findOrCreateChildFromPath("cube/grandChild_2/greatGrand/greatGreateGrand");
        assert.isObject(child, 'region cannot be created');
        assert.equal(child.getFullPath(), 'cube/grandChild_2/greatGrand/greatGreateGrand',
          'child region path is not matching');
      });
      it('checkPickableUpdateRequred', function(){
        const flag = rootRegion.checkPickableUpdateRequred(true);
        assert.isTrue(flag, 'Pickable flag is not correct');
      });
      it('getPickableThreeJSObjects', function(){
        let objectsList = [];
        rootRegion.getPickableThreeJSObjects(objectsList, true);
        assert.equal(objectsList.length, 6, 'Number of pickable object is not correct');
      });
      
      it('duration', function() {
        rootRegion.setDuration(500);
        assert.equal(rootRegion.getDuration(), 500, 'Duration is not set correctly');
      });
      it('getBoundingBox', function(){
        const boundingBox = rootRegion.getBoundingBox(true);
        assert.isObject(boundingBox, 'Cannot get bounding box for the root region');
      });
      it('objectIsInRegion', function() {
        const objects = rootRegion.findGeometriesWithGroupName('cube texture', true);
        assert.equal(objects.length, 1, 'cannot find surface in region');
        assert.isTrue(objects[0].isGeometry, "Object is not geometry");
        assert.isFalse(rootRegion.objectIsInRegion(objects[0], false),
          "object should not be in the rootRegion");
        assert.isTrue(rootRegion.objectIsInRegion(objects[0], true),
          "object should be in the one of the child regions");
        const cubeRegion = rootRegion.getChildWithName("cube");
        assert.isTrue(cubeRegion.objectIsInRegion(objects[0], false),
          "object should be in the cube region");
      });
      it('findObjectsWithGroupName', function() {
        let objects = rootRegion.findObjectsWithGroupName('greatGrand_surface', false);
        assert.equal(objects.length, 0, 'Should not be found in root region');
        objects = rootRegion.findObjectsWithGroupName('greatGrand_surface', true);
        assert.equal(objects.length, 1, 'cannot find objects in region');
        assert.isTrue(objects[0].isGeometry, "Object is geometry");
        objects = [];
        objects = rootRegion.findObjectsWithGroupName('not me', true);
        assert.equal(objects.length, 0, 'should find objects in region');
      });
      it('findGeometriesWithGroupName', function() {
        let objects = rootRegion.findGeometriesWithGroupName('cube texture', false);
        assert.equal(objects.length, 0, 'Should not be found in root region');
        objects = rootRegion.findGeometriesWithGroupName('cube texture', true);
        assert.equal(objects.length, 1, 'cannot find surface in region');
        assert.isTrue(objects[0].isGeometry, "Object is not geometry");
        objects = [];
        objects = rootRegion.findGeometriesWithGroupName('not me', true);
        assert.equal(objects.length, 0, 'should find objects in region');
      });
      it('findPointsetsWithGroupName', function() {
        let objects = rootRegion.findPointsetsWithGroupName('points', true);
        assert.equal(objects.length, 1, 'Should not be found in root region');
        objects = rootRegion.findPointsetsWithGroupName('points', true);
        assert.equal(objects.length, 1, 'cannot find points in regions');
        assert.isTrue(objects[0].isPointset, "Object is not pointsets");
        objects = [];
        objects = rootRegion.findPointsetsWithGroupName('not me', true);
        assert.equal(objects.length, 0, 'should find objects in region');
      });
      it('findGlyphsetsWithGroupName', function() {
        let objects = rootRegion.findGlyphsetsWithGroupName('grandChild_1_glyph', false);
        assert.equal(objects.length, 0, 'Should not be found in root region');
        objects = rootRegion.findGlyphsetsWithGroupName('grandChild_1_glyph', true);
        assert.equal(objects.length, 1, 'cannot find glyphset in group');
        assert.isTrue(objects[0].isGlyphset, "Object is not glyphset");
        objects = [];
        objects = rootRegion.findGlyphsetsWithGroupName('not me', true);
        assert.equal(objects.length, 0, 'should find objects in region');
      });
      it('findLinesWithGroupName', function() {
        let objects = rootRegion.findLinesWithGroupName('grandChild_2_lines', false);
        assert.equal(objects.length, 0, 'Should not be found in root region');
        objects = rootRegion.findLinesWithGroupName('grandChild_2_lines', true);
        assert.equal(objects.length, 1, 'cannot find lines in group');
        assert.isTrue(objects[0].isLines, "Object is not line");
        objects = [];
        objects = rootRegion.findLinesWithGroupName('not me', true);
        assert.equal(objects.length, 0, 'should find objects in region');
      });
      it('getAllObjects', function(){
        const list = rootRegion.getAllObjects(true);
        assert.equal(list.length, 6, 'Number of primitives is not matching');
      });
      it('setMorphTime', function(){
        rootRegion.setMorphTime(200, false);
        assert.equal(rootRegion.getCurrentTime(), 200, 'morph time is not correct');
        const childRegion = rootRegion.findChildFromPath("cube/grandChild_2/greatGrand");
        assert.equal(childRegion.getCurrentTime(), 0, 'morph time is not correct');
      });
      it('isTimeVarying', function(){
        assert.isFalse(rootRegion.isTimeVarying(), 'It should not be time varying');
      });
      it ('forEachGeometry', function() {
        geometryCount = 0;
        rootRegion.forEachGeometry(geometryCallback(), false);
        assert.equal(0, geometryCount, 'geometry count is incorrect.')
        geometryCount = 0;
        rootRegion.forEachGeometry(geometryCallback(), true);
        assert.equal(2, geometryCount, 'geometry count is incorrect.')
      });
      it ('forEachGlyphset', function() {
        geometryCount = 0;
        rootRegion.forEachGlyphset(geometryCallback(), false);
        assert.equal(0, geometryCount, 'glyphset count is incorrect.')
        geometryCount = 0;
        rootRegion.forEachGlyphset(geometryCallback(), true);
        assert.equal(1, geometryCount, 'glyphset count is incorrect.')
      });
      it ('forEachPointset', function() {
        geometryCount = 0;
        rootRegion.forEachPointset(geometryCallback(), false);
        assert.equal(1, geometryCount, 'pointset count is incorrect.')
        geometryCount = 0;
        rootRegion.getChildWithName("cube").forEachPointset(geometryCallback(), false);
        assert.equal(0, geometryCount, 'line count is incorrect.')
        geometryCount = 0;
        rootRegion.forEachPointset(geometryCallback(), true);
        assert.equal(1, geometryCount, 'pointset count is incorrect.')
      });
      it ('forEachLine', function() {
        geometryCount = 0;
        rootRegion.forEachLine(geometryCallback(), false);
        assert.equal(0, geometryCount, 'line count is incorrect.')
        geometryCount = 0;
        rootRegion.getChildWithName("cube").forEachLine(geometryCallback(), false);
        assert.equal(1, geometryCount, 'line count is incorrect.')
        geometryCount = 0;
        rootRegion.forEachLine(geometryCallback(), true);
        assert.equal(2, geometryCount, 'line count is incorrect.')
      });
      it ('renderGeometries', function() {
        rootRegion.renderGeometries(
          1, 0.1, false, undefined);
      });
      it('setVisibility', function(){
        assert.isTrue(rootRegion.getVisibility(), 'Visibility should be true')
        rootRegion.setVisibility(false);
        assert.isFalse(rootRegion.getVisibility(), 'Visibility should be false');
      });
      it('clear', function(){
        rootRegion.clear(true);
        const objects = rootRegion.getAllObjects(true);
        assert.equal(0, objects.length, 'All graphics should be removed');
        assert.isUndefined(rootRegion.getChildWithName("cube"), 'All regions should be removed');
      });
    });
  });
}

function checkCreateAPIs(scene) {
  describe('Methods()', function() {
    const rootRegion = scene.getRootRegion();
    it('createPoints', function() {
      let object = scene.createPoints(
        '__create', 'createdPoints', [[1.0, 1.0, 1.0]], undefined, 0x0022ee,
      );
      assert.isObject(object, "Object is not defined");
      let objects = rootRegion.findPointsetsWithGroupName('createdPoints', false);
      assert.equal(objects.length, 0, 'Should not be found in root region');
      objects = rootRegion.findPointsetsWithGroupName('createdPoints', true);
      assert.equal(objects.length, 1, 'Should be found in sub region');
      assert.isTrue(objects[0].isPointset, "Object is a pointsets");
    });
    it('createLines', function() {
      let lines2 = scene.createLines(
        '__create', 'createdLines', [[0.0, 1,0, 2.0], [3.0, 4.0, 5.0]], 0x0022ee,
      );
      assert.isObject(lines2, "Object is not defined");
      let objects = rootRegion.findLinesWithGroupName('createdLines', false);
      assert.equal(objects.length, 0, 'Should not be found in root region');
      objects = rootRegion.findLinesWithGroupName('createdLines', true);
      assert.equal(objects.length, 1, 'Should be found in sub region');
      assert.isTrue(objects[0].isLines2, "Object is a lines");
    });
    it('addBoundingBoxes', function() {
      let object = scene.addBoundingBoxPrimitive(
        "_helper", "boundingBox", 0x40E0D0, 0.15
      );
      assert.isObject(object, "Object is not defined");
      let objects = rootRegion.findGeometriesWithGroupName('boundingBox', false);
      assert.equal(objects.length, 0, 'Should not be found in root region');
      objects = rootRegion.findGeometriesWithGroupName('boundingBox', true);
      assert.equal(objects.length, 1, 'Should be found in sub region');
      assert.isTrue(objects[0].isGeometry, "Object should be a geometry");
    });
    it('addSlicesPrimitive', function() {
      let object = scene.addSlicesPrimitive(
        "_helper", ["x-plane", "y-plane", "z-plane"],
        [0xFF5555, 0x55FF55, 0x5555FF], 0.15
      );
      assert.equal(object.length, 3, "Object is not defined");
      let objects = rootRegion.findGeometriesWithGroupName('x-plane', false);
      assert.equal(objects.length, 0, 'Should not be found in root region');
      objects = rootRegion.findGeometriesWithGroupName('x-plane', true);
      assert.equal(objects.length, 1, 'Should be found in sub region');
      assert.isTrue(objects[0].isGeometry, "Object should be a geometry");

    });
    it('addTemporaryPoints', function() {
      let object = scene.addTemporaryPoints(
        [0.0, 0,0, 0.0], 0xFF5555
      );
      assert.isObject(object, "Object is not defined");
    });
    it('addTemporaryLines', function() {
      let object = scene.addTemporaryLines(
        [[0.0, 0,0, 0.0], [1.0, 1.0, 1.0]], 0xFF5555
      );
      assert.isObject(object, "Object is not defined");
    });
    it('clearTemporaryPrimitives', function() {
      let number = scene.clearTemporaryPrimitives();
      assert.equal(number, 2, "Number of removal should be 2");
    });

  });
}

function checkIndexedAndMergedFormat(scene) {
  describe('IndexedAndMergedFormat()', function(){
    const rootRegion = scene.getRootRegion();
    before('Setup Mock response', function(done) {
      var scope = nock('https://www.mytestserver.com')
        .persist()
        .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
        .get(function(uri) {
          return uri;
        })
        .reply(200, (uri, requestBody, cb) => {fs.readFile("." + uri, cb)}, {'Content-Type': 'application/json'});
        scene.loadMetadataURL("https://www.mytestserver.com/models/test_indexed_metadata.json", undefined, 
          done);
    });

    describe('Methods()', function(){
      it('findGeometriesWithGroupName', function() {
        let objects = rootRegion.findGeometriesWithGroupName('indexed geometry', false);
        assert.equal(objects.length, 1, 'Should be found in root region');
        assert.isTrue(objects[0].isGeometry, "Object is not geometry");
      });
      it('findPointsetsWithGroupName', function() {
        let objects = rootRegion.findPointsetsWithGroupName('indexed points', false);
        assert.equal(objects.length, 1, 'Should be found in root region');
        assert.isTrue(objects[0].isPointset, "Object is not pointsets");
      });
      it('findMergedWithGroupName', function() {
        let objects = rootRegion.findGeometriesWithGroupName('merged surfaces', false);
        assert.equal(objects.length, 1, 'Should be found in root region');
        assert.isTrue(objects[0].isGeometry, "Object is not pointsets");
      });
      it ('renderGeometries', function() {
        rootRegion.renderGeometries(
          1, 0.1, false, undefined);
      });
    });
  });
}

function checkRenderer() {
  var testRenderer;
  describe('Renderer()', function(){
    it('Renderer is a valid constructor', function(){
      assert.isFunction(Zinc.Renderer, 'Zinc.Renderer is a valid constructor'); 
    });
    var renderer = new Zinc.Renderer(container, window);
    it('Renderer creates an object', function(){
      assert.isObject(renderer, 'Zinc.Renderer creates an object'); 
    });
    describe('Local Variables()', function(){
      it('playAnimation', function(){
        assert.equal(renderer.playAnimation, true, 'playAnimation equals `true`');
      });
    })
    describe('Methods()', function(){
      var parameters = {};
      var context = require("gl")(1024, 1024);
      parameters['context'] = context;
      var returnValue = renderer.initialiseVisualisation(parameters);
      it('initialiseVisualisation', function(){
        assert.isUndefined(returnValue, 'initialiseVisualisation is successfully called');
      });
      it('getCurrentScene', function(){
        assert.isObject(renderer.getCurrentScene(), 'getCurrentScene returns an object');
      });
      var scene = renderer.createScene("Test1");
      it('createScene', function(){
        assert.isObject(scene, 'createScene returns an object');
      });
      it('getSceneByName', function(){
        assert.isObject(renderer.getSceneByName("Test1"), 'getSceneByName returns an object');
      });
      it('setCurrentScene', function(){
        assert.isUndefined(renderer.setCurrentScene(scene), 'setCurrentScene is successfully called');
      });
      it('resetView', function(){
        assert.isUndefined(renderer.resetView(), 'resetView is successfully called');
      });
      it('viewAll', function(){
        assert.isUndefined(renderer.viewAll(), 'viewAll is successfully called');
      });
      it('updateDirectionalLight', function(){
        assert.isUndefined(renderer.updateDirectionalLight(), 'updateDirectionalLight is successfully called');
      });
      it('getPlayRate', function(){
        assert.equal(renderer.getPlayRate(), 1000, 'getPlayRate succesfully returns the correct value');
      });
      var callbackId =  renderer.addPreRenderCallbackFunction(preRenderCallback());
      it('addPreRenderCallbackFunction', function(){
        assert.isNumber(callbackId, 'addPreRenderCallbackFunction succesfully returns the correct value');
      });

      it('setPlayRate', function(){
        assert.isUndefined(renderer.setPlayRate(300), 'setPlayRate succesfully returns the correct value');
      });
      it('getCurrentTime', function(){
        assert.equal(renderer.getCurrentTime(), 0, 'getCurrentTime succesfully returns the correct value');
      });
      it('setMorphsTime', function(){
        assert.isUndefined(renderer.setMorphsTime(300), 'setMorphsTime succesfully returns the correct value');
      });
      var  returnValue2 = renderer.render();
      it('render', function(){
        assert.isUndefined(returnValue2, 'render succesfully returns the correct value');
      });
      it('removePreRenderCallbackFunction', function(){
        assert.isUndefined(renderer.removePreRenderCallbackFunction(callbackId),
            'removePreRenderCallbackFunction succesfully is successfully called');
      });
      it('getThreeJSRenderer', function(){
        assert.isObject(renderer.getThreeJSRenderer(), 'getThreeJSRenderer returns an object');
      });
      var scene2 = renderer.createScene("Test2");
      it('isSceneActive', function() {
        assert.isFalse(renderer.isSceneActive(scene2), 'isSceneActive succcessfully returns fail value');
      });
      it('addActiveScene', function() {
        assert.isUndefined(renderer.addActiveScene(scene2), 'addActiveScene is successfully called');
      });
      it('isSceneActive', function() {
        assert.isTrue(renderer.isSceneActive(scene2), 'isSceneActive successfully returns correct value');
      });
      it('removeActiveScene', function() {
        assert.isUndefined(renderer.removeActiveScene(scene2), 'removeActiveScene is successfully called');
      });
      it('isSceneActive', function() {
        assert.isFalse(renderer.isSceneActive(scene2), 'isSceneActive succcessfully returns fail value');
      });
      it('clearAllActiveScene', function() {
        assert.isUndefined(renderer.clearAllActiveScene(), 'clearAllActiveScene is successfully called');
      });
      it('transitionScene', function() {
        assert.isUndefined(renderer.transitionScene(scene2, 3000), 'transitionScene is successfully called');
      });
      it('animate', function() {
        assert.isUndefined(renderer.animate(), 'animate is successfully called');
      });
      it('stopAnimate', function() {
        assert.isUndefined(renderer.stopAnimate(), 'stopAnimate is successfully called');
      });
      it('getDrawingWidth', function() {
        assert.equal(renderer.getDrawingWidth(), 0, 'getDrawingWidth is successfully called');
      });
      it('getDrawingHeight', function() {
        assert.equal(renderer.getDrawingHeight(), 0, 'getDrawingHeight is successfully called');
      });
    })

    testRenderer = renderer;
  })
  var testScene = checkScene(testRenderer);
  checkGeometry(testScene);
  
  checkControls(testScene);
  var indexedScene = testRenderer.createScene("indexedScene");
  checkIndexedAndMergedFormat(indexedScene);
  var regionScene = testRenderer.createScene("regionScene");
  checkRegion(regionScene);
  checkCreateAPIs(testScene);
  checkTextureSlides(testScene)
  //checkCleanup(testScene);
}

function checkZincObject() {
  it('Zinc is a valid object', function(){
    assert.isObject(Zinc, 'Zinc is an object'); 
  });
  checkRenderer();
}

describe('Zinc', function(){
  checkZincObject();
})
