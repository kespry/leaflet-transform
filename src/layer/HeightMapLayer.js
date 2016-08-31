import L from "leaflet";
import cover from "tile-cover";
import rewind from "geojson-rewind";
import * as THREE from "three";
import TrackballControls from "three-trackballcontrols";
import * as colorbrewer from "colorbrewer";
import interpolate from "color-interpolate";
import * as palettes from "nice-color-palettes";
import tps from "thinplate";
import mvi from "./mvi";

export default L.TileLayer.extend({
  redraw: function() {
    if (this._map) {
      this._reset({ hard: true });
      this._update();
    }

    for (var i in this._tiles) {
      this._redrawTile(this._tiles[i]);
    }
    return this;
  },
  _redrawTile: function(tile) {
    this.drawTile(tile, this._tilePoint, this._map._zoom);
  },
  _addTile: function(tilePoint, container) {
    var tilePos = this._getTilePos(tilePoint);

    var tile = this._getTile();
    L.DomUtil.setPosition(tile.image, tilePos);
    L.DomUtil.setPosition(tile.canvas, tilePos);

    this._tiles[tilePoint.x + ':' + tilePoint.y] = tile;
    this._loadTile(tile, tilePoint);

    if(tile.canvas.parentNode !== this._tileContainer) {
      container.appendChild(tile.canvas);
    }
  },

  _createTile: function() {
    var canvasTile = L.DomUtil.create('canvas', 'leaflet-tile'),
        imgTile = L.DomUtil.create('img', 'leaflet-tile');

    canvasTile.height = canvasTile.width = this.options.tileSize;
    imgTile.width = canvasTile.width = this.options.tileSize;
    canvasTile.onselectstart = canvasTile.onmouseove = L.Util.falseFn;
    imgTile.onselectstart = imgTile.onmousemove = L.Util.falseFn;

    return { image: imgTile, canvas: canvasTile };
  },

  _loadTile: function(tile, tilePoint) {
    tile._layer = this;
    tile._tilePoint = tilePoint;

    this._adjustTilePoint(tilePoint);

    tile.image.src     = this.getTileUrl(tilePoint);
    tile.image.onload  = this._tileOnLoad(this, tile);
    tile.image.onerror = this._tileOnError(this, tile);

    this.fire('tileloadstart', {
      tile: tile,
      url: tile.image.src
    });
  },

  _tileOnLoad: function(layer, tile) {
    return function() {
      if(this.src !== L.Util.emptyImageUrl) {
        L.DomUtil.addClass(tile.canvas, 'leaflet-tile-loaded');
        L.DomUtil.addClass(tile.image, 'leaflet-tile-loaded');

        layer.fire('tileload', {
          tile: this,
          url: this.src
        });
      }

      layer._redrawTile(tile);
      layer._tileLoaded();
    }
  },

  _tileOnError: function(layer, tile) {
    return function() {
      layer.fire('tileerror', {
        tile: this,
        url: this.src
      });

      layer._tileLoaded();
    }
  },

  _tileLoaded: function() {
    this._tilesToLoad--;

    if(!this._tilesToLoad) {
      this.fire('load');
    }
  },

  flipY: function(y, z) {
    return Math.pow(2, z) - y - 1;
  },

  toRad: function(n) {
    return n * Math.PI / 180;
  },

  getTileInfoForPoint: function(lat, lon) {
    var zoom     = this._map.getZoom(),
        tileSize = this._getTileSize(),
        x        = ((lon + 180) / 360 * (1<<zoom)),
        y        = (1 - Math.log(Math.tan(this.toRad(lat)) + 1 / Math.cos(this.toRad(lat))) / Math.PI) / 2 * (1<<zoom),
        xTile    = parseInt(Math.floor(x)),
        yTile    = parseInt(Math.floor(y)),
        tileX    = Math.floor(((x - xTile) * tileSize) / 1.0),
        tileY    = Math.floor(((y - yTile) * tileSize) / 1.0);

    var el = this._tiles[xTile + ':' + yTile];
    return { mercator: { x: x, y: y }, tile: { el: el, size: tileSize, x: xTile, y: yTile, offset: { x: tileX, y: tileY } } };
  },

  getRawHeightForPoint: function(lat, lon) {
    var point = this.getTileInfoForPoint(lat, lon);
    var tile = this._tiles[point.tile.x + ':' + point.tile.y];
    var offset = (point.tile.offset.y * point.tile.size) + point.tile.offset.x;

    if(tile && tile.floatData) {
      if(this.options.debug) {
        $('canvas').css({
          border: 'none'
        });
        $(tile.canvas).css({
          border: '2px solid red'
        });
      }

      return tile.floatData[offset];
    }
  },

  calcCenter: function(polygon) {
    var coords = polygon.coordinates[0],
        lats = coords.map(function(coord) {
          return coord[0];
        }),
        lngs = coords.map(function(coord) {
          return coord[1];
        });

    var minLat = Math.min.apply(null, lats), maxLat = Math.max.apply(null, lats);
    var minLng = Math.min.apply(null, lngs), maxLng = Math.max.apply(null, lngs);

    return [
      minLat + (maxLat - minLat) / 2,
      minLng + (maxLng - minLng) / 2
    ];
  },

  cropHeightMapToPoints: function(polygon, markers) {
    var xKeys = {},
        yKeys = {},
        minX  = Infinity,
        minY  = Infinity,
        zoom  = this._map.getZoom(),
        polygonTiles = cover.tiles(polygon, { min_zoom: zoom, max_zoom: zoom }),
        markerTiles  = cover.tiles(markers, { min_zoom: zoom, max_zoom: zoom }),
        tiles = polygonTiles.concat(markerTiles);

    for(var i = 0; i < tiles.length; i++) {
      var tile = tiles[i];
      xKeys[tile[0]] = true;
      yKeys[tile[1]] = true;
      minX = minX > tile[0] ? tile[0] : minX;
      minY = minY > tile[1] ? tile[1] : minY;
    }

    if(this.canvasEl) {
      document.body.removeChild(this.canvasEl);
    }

    var canvasEl = document.createElement('canvas'),
        tileSize = this._getTileSize();
    canvasEl.width = Object.keys(xKeys).length * tileSize;
    canvasEl.height = Object.keys(yKeys).length * tileSize;

    var ctx = canvasEl.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    var drawnTiles = {};
    for(var i = 0; i < tiles.length; i++) {
      var tile = tiles[i],
          tileEl = this._tiles[tile[0] + ':' + tile[1]];
      if(tileEl && !drawnTiles[tile[0] + ':' + tile[1]]) {
        ctx.drawImage(tileEl.image, (tile[0] - minX) * tileSize, (tile[1] - minY) * tileSize);
      }
      drawnTiles[tile[0] + ':' + tile[1]] = true;
    }

    var cw = rewind(polygon, true);
    var points = cw.coordinates[0];
    ctx.globalCompositeOperation = 'destination-in';
    ctx.beginPath();

    var perimeterPoints = [], pointSampleSize = 5;
    for(var i = 0; i < points.length; i++) {
      var point = points[i],
          info = this.getTileInfoForPoint(point[1], point[0]),
          offsetX = ((info.tile.x - minX) * tileSize) + info.tile.offset.x,
          offsetY = ((info.tile.y - minY) * tileSize) + info.tile.offset.y;

      info.offset = { x: offsetX, y: offsetY };
      perimeterPoints.push([info, new Float32Array(
        ctx.getImageData(offsetX, offsetY, pointSampleSize, pointSampleSize).data.buffer
      )]);
      if(i === 0) ctx.moveTo(offsetX, offsetY);
      if(i > 0 && i < points.length) ctx.lineTo(offsetX, offsetY);
    }

    var basePoints = [],
        polygonCenter = this.calcCenter(polygon),
        origin = this.getTileInfoForPoint(polygonCenter[1], polygonCenter[0]);
        origin.offset = {
          x: ((origin.tile.x - minX) * tileSize) + origin.tile.offset.x,
          y: ((origin.tile.y - minY) * tileSize) + origin.tile.offset.y
        };

    for(var i = 0; i < markers.coordinates.length; i++) {
      var point = markers.coordinates[i],
         info = this.getTileInfoForPoint(point[1], point[0]),
         offsetX = ((info.tile.x - minX) * tileSize) + info.tile.offset.x,
         offsetY = ((info.tile.y - minY) * tileSize) + info.tile.offset.y;

      info.offset = { x: offsetX, y: offsetY };
      info.center = { x: origin.offset.x - offsetX, y: origin.offset.y - offsetY };
      basePoints.push([info, new Float32Array(
        ctx.getImageData(offsetX, offsetY, pointSampleSize, pointSampleSize).data.buffer
      )]);
    }
    console.log('bp', basePoints, 'tps!!', tps, 'mvi!!', mvi);


    ctx.closePath();
    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    ctx.fill();
    ctx.clip();

    var w = canvasEl.width,
        h = canvasEl.height,
        clippedImage = ctx.getImageData(0, 0, w, h),
        x, y, index, p = { x: [], y: [] },
        origValues = {};

    for(y = 0; y < h; y++) {
      for(x = 0; x < w; x++) {
        index = (y * w + x) * 4;
        if(clippedImage.data[index+3] > 0) {
          p.x.push(x);
          p.y.push(y);
        }
      }
    }

    p.y.sort(function(a, b) { return a-b; });
    p.x.sort(function(a, b) { return a-b; });
    var n = p.x.length - 1;

    var origW = w,
        origH = h;
    w = p.x[n] - p.x[0];
    h = p.y[n] - p.y[0];

    var crop = ctx.getImageData(p.x[0], p.y[0], w, h);
    canvasEl.width = w;
    canvasEl.height = h;
    ctx.putImageData(crop, 0, 0);

    var crop32 = new Float32Array(crop.data.buffer);
    var geometry = new THREE.PlaneGeometry(w, h, w - 1, h - 1);
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();

    var allPerimeterPoints = new Float32Array(pointSampleSize * pointSampleSize * perimeterPoints.length);
    for(var i = 0, o = 0; i < perimeterPoints.length; i++) {
      for(var n = 0; n < perimeterPoints[i][1].length; n++, o++) {
        allPerimeterPoints[o] = perimeterPoints[i][1][n];
      }
    }
    var minPerimeterPoint = Math.min.apply(null, allPerimeterPoints);

    var allBasePoints = new Float32Array(pointSampleSize * pointSampleSize * basePoints.length);
    for(var i = 0, o = 0; i < basePoints.length; i++) {
      for(var n = 0; n < basePoints[i][1].length; n++, o++) {
        allBasePoints[o] = basePoints[i][1][n];
      }
    }
    var minBasePoint = Math.min.apply(null, allBasePoints);


    var minZ = Infinity, maxZ = -Infinity, minPoint = minBasePoint, scale = 5;
    for(var i = 0, l = geometry.vertices.length; i < l; i++) {
      var val = crop32[i] - minPoint;
      minZ = minZ > crop32[i] && crop32[i] >= minPoint ? crop32[i] : minZ;
      maxZ = maxZ < crop32[i] ? crop32[i] : maxZ;
      geometry.vertices[i].z = (val > 0 ? val : 0) * scale;
    }

    var palette = interpolate(colorbrewer.Spectral[11].reverse()), range = (maxZ - minZ) * scale;
    for(var i = 0, l = geometry.faces.length; i < l; i++) {
      var face = geometry.faces[i];
      face.vertexColors = [
        new THREE.Color(palette(geometry.vertices[face.a].z / range)),
        new THREE.Color(palette(geometry.vertices[face.b].z / range)),
        new THREE.Color(palette(geometry.vertices[face.c].z / range))
      ];
    }

    this.createScene();
    for(var i = 0; i < basePoints.length; i++) {
      var point = basePoints[i];
      var basePointGeometry = new THREE.SphereGeometry( 5, 32, 32 );
      var basePointMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
      var basePointMesh = new THREE.Mesh(basePointGeometry, basePointMaterial);
      basePointMesh.name = "basePoint" + i;
      var zValue = point[0].zAvg = point[1].reduce(function(a, b) {
        return a + b;
      }, 0) / point[1].length;
      basePointMesh.position.set(point[0].center.x * -1, point[0].center.y, (zValue - minPoint) * scale);
      console.log(basePointMesh, 'zValue!!!', zValue);
      var oldPoint = this.scene.getObjectByName(basePointMesh.name);
      if(oldPoint) this.scene.remove(oldPoint);
      this.scene.add(basePointMesh);
    }

    var targets = [], xPoints = [], yPoints = [], _originXPoints = [], _originYPoints = [], zPoints = [], fitPoints = basePoints.map(function(point) {
      var info = point[0];
      targets.push(info.zAvg);
      xPoints.push(info.center.x);
      yPoints.push(info.center.y);
      zPoints.push(info.zAvg);
      return [info.center.x, info.center.y, info.zAvg];
    });

    var sizeX = Math.max.apply(null, xPoints.map(Math.abs)) * 2,
        sizeY = Math.max.apply(null, yPoints.map(Math.abs)) * 2,
        minZ = Math.min.apply(null, zPoints),
        maxZ = Math.max.apply(null, zPoints);

    //debugger;
    fitPoints = fitPoints.map(function(pt) {
      return [pt[0] * -1, pt[1], pt[2]];
    });
    var plate = mvi.thinPlateSpline(fitPoints, 0);
   //debugger;
        var planeGeometry = new THREE.PlaneGeometry(sizeX, sizeY, sizeX - 1, sizeY - 1);
        planeGeometry.computeFaceNormals();
        planeGeometry.computeVertexNormals();
       //debugger;
        //for(var i = 0, l = planeGeometry.vertices.length; i < l; i++) {
         // var coords = calculateCoordinates(i, w, h);
          for(var i = 0, l = planeGeometry.vertices.length; i < l; i++) {
            var y = Math.floor(i / sizeX), x = i - (y * sizeX);
            planeGeometry.vertices[i].z = (plate(x - sizeX/2, y - sizeY/2) - minPoint) * scale;
          }
          /*for(var y  = 0; y < sizeY; y++) {
            for(var x = 0; x < sizeX; x++) {
              //console.log(plate(x, y));
              planeGeometry.vertices[y * sizeX + x].z = (plate(x, y) - minPoint) * scale;
            }
          }
          //planeGeometry.vertices[i].z = (plate(coords[0], coords[1]) - minPoint) * scale;
        //}

        /*for(var x = 0; x < sizeX; x++) {
          for(var y = 0; y < sizeY; y++) {
            planeGeometry.vertices[x * sizeY + y].z = (plate(x, y) - minPoint) * scale;
          }
        }*/
        //for(var i = 0, l = planeGeometry.vertices.length; i < l; i++) {
        //  planeGeometry.vertices[i].z = (plate - minPoint) * scale;
       // }
      var planeMaterial = new THREE.MeshBasicMaterial({
        //vertexColors: THREE.VertexColors,
        wireframe: true,
        color: 0xff0000
        //opacity: 0.2,
        //transparent: true
      });

      var basePlane = new THREE.Mesh(planeGeometry, planeMaterial);
      basePlane.castShadow = true;
      basePlane.receiveShadow = true;
      basePlane.name = "baseplane";
      var oldPlane = this.scene.getObjectByName(basePlane.name);
      if(oldPlane) this.scene.remove(oldPlane);
      this.scene.add(basePlane);

    var material = new THREE.MeshBasicMaterial({
      vertexColors: THREE.VertexColors,
      wireframe: true,
      opacity: 0.2,
      transparent: true
    });
    var plane = new THREE.Mesh(geometry, material);
    plane.castShadow = true;
    plane.receiveShadow = true;
    plane.name = "heightmap";
    var oldMap = this.scene.getObjectByName(plane.name);
    if(oldMap) this.scene.remove(oldMap);
    this.camera.lookAt(plane);

    this.scene.add(plane);

    $(canvasEl).css({
      position: "absolute",
      right: "0px",
      top: "0px",
      border: "1px solid black"
    });

    document.body.appendChild(canvasEl);
    this.canvasEl = canvasEl;
  },

  createScene: function() {
    if(!this.scene) {
      var scene = this.scene = new THREE.Scene();
      var axes = new THREE.AxisHelper(200);
      scene.add(axes);

      scene.add(new THREE.AmbientLight(0x111111));
      var light = new THREE.DirectionalLight(0xffffff, 1);
      light.shadowCameraVisible = true;
      light.position.set(0,300,100);
      scene.add(light);
      var camera = window.camera = this.camera = new THREE.PerspectiveCamera(45, 800 / 600, 0.1, 1000);
      camera.position.z = 100;

      var renderer = new THREE.WebGLRenderer();
      renderer.setSize(800, 600);
      $(renderer.domElement).css({
        position: "absolute",
        right: "0px",
        bottom: "0px"
      });
      document.body.appendChild(renderer.domElement);

      window.THREE = THREE;
      var controls = new TrackballControls(camera, renderer.domElement);

      function render() {
        requestAnimationFrame(render);
        controls.update();
        renderer.render(scene, camera);
      }
      render();
    }
  },

  drawTile: function(tile, tilePoint, zoom) {
    var ctx = tile.canvas.getContext('2d');
    ctx.drawImage(tile.image, 0, 0);
    var imageData = ctx.getImageData(0, 0, tile.canvas.width, tile.canvas.height);
    tile.buffer = imageData.data.buffer;
    this.floatData = new Float32Array(tile.buffer);
  },

  tileDrawn: function(tile) {
    this._tileOnLoad.call(tile);
  }
});
