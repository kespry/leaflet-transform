import L from "leaflet";
import cover from "tile-cover";
import rewind from "geojson-rewind";
import * as THREE from "three";
import * as TrackballControls from "three-trackballcontrols";

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

  cropHeightMapToPoints: function(geojson) {
    var xKeys = {},
        yKeys = {},
        minX  = Infinity,
        minY  = Infinity,
        zoom  = this._map.getZoom(),
        tiles = cover.tiles(geojson, { min_zoom: zoom,
                                       max_zoom: zoom });

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
    for(var i = 0; i < tiles.length; i++) {
      var tile = tiles[i],
          tileEl = this._tiles[tile[0] + ':' + tile[1]];
      if(tileEl) {
        ctx.drawImage(tileEl.image, (tile[0] - minX) * tileSize, (tile[1] - minY) * tileSize);
      }
    }

    var cw = rewind(geojson, true);
    var points = cw.coordinates[0];
    ctx.globalCompositeOperation = 'destination-in';
    ctx.beginPath();

    var perimeterPoints = [], pointSampleSize = 5;
    for(var i = 0; i < points.length; i++) {
      var point = points[i],
          info = this.getTileInfoForPoint(point[1], point[0]),
          offsetX = ((info.tile.x - minX) * tileSize) + info.tile.offset.x,
          offsetY = ((info.tile.y - minY) * tileSize) + info.tile.offset.y;

      perimeterPoints.push([info, new Float32Array(
        ctx.getImageData(offsetX, offsetY, pointSampleSize, pointSampleSize).data.buffer
      )]);
      if(i === 0) ctx.moveTo(offsetX, offsetY);
      if(i > 0 && i < points.length) ctx.lineTo(offsetX, offsetY);
    }
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

    w = p.x[n] - p.x[0];
    h = p.y[n] - p.y[0];

    var crop = ctx.getImageData(p.x[0], p.y[0], w, h);
    canvasEl.width = w;
    canvasEl.height = h;
    ctx.putImageData(crop, 0, 0);

    var crop32 = new Float32Array(crop.data.buffer);
    var geometry = new THREE.PlaneGeometry(60, 60, w - 1, h - 1);
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();

    var allPerimeterPoints = new Float32Array(pointSampleSize * pointSampleSize * perimeterPoints.length);
    for(var i = 0, o = 0; i < perimeterPoints.length; i++) {
      for(var n = 0; n < perimeterPoints[i][1].length; n++, o++) {
        allPerimeterPoints[o] = perimeterPoints[i][1][n];
      }
    }
    var minPerimeterPoint = Math.min.apply(null, allPerimeterPoints);

    for(var i = 0, l = geometry.vertices.length; i < l; i++) {
      var val = crop32[i] - minPerimeterPoint;
      geometry.vertices[i].z = (val > 0 ? val : 0);
    }

    var material = new THREE.MeshPhongMaterial({
      color: 0xdddddd,
      wireframe: true
    });
    var plane = new THREE.Mesh(geometry, material);
    plane.castShadow = true;
    plane.receiveShadow = true;
    plane.name = "heightmap";
    this.createScene();
    var oldMap = this.scene.getObjectByName(plane.name);
    if(oldMap) this.scene.remove(oldMap);
    this.camera.lookAt(plane);

    this.scene.add(plane);

    //2147483647
    //debugger;

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
      var camera = window.camera = this.camera = new THREE.PerspectiveCamera(45, 640 / 480, 0.1, 1000);
      //camera.position.y = -60;
      camera.position.z = 100;

      
      var renderer = new THREE.WebGLRenderer();
      renderer.setSize(640, 480);
      $(renderer.domElement).css({
        position: "absolute",
        right: "0px",
        bottom: "0px"
      });
      document.body.appendChild(renderer.domElement);
      
      window.THREE = THREE;
      var controls = new TrackballControls.default(camera, renderer.domElement);

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
