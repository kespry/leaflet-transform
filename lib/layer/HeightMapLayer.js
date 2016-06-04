'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _leaflet = require('leaflet');

var _leaflet2 = _interopRequireDefault(_leaflet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _leaflet2.default.TileLayer.extend({
  redraw: function redraw() {
    if (this._map) {
      this._reset({ hard: true });
      this._update();
    }

    for (var i in this._tiles) {
      this._redrawTile(this._tiles[i]);
    }
    return this;
  },
  _redrawTile: function _redrawTile(tile) {
    this._drawTile(tile, this._tilePoint, this._map._zoom);
  },
  _addTile: function _addTile(tilePoint, container) {
    var tilePos = this._getTilePos(tilePoint);

    var tile = this._getTile();
    _leaflet2.default.DomUtil.setPosition(tile.image, tilePos);
    _leaflet2.default.DomUtil.setPosition(tile.canvas, tilePos);

    this._tiles[tilePoint.x + ':' + tilePoint.y] = tile;
    this._loadTile(tile, tilePoint);

    if (tile.canvas.parentNode !== this._tileContainer) {
      container.appendChild(tile.canvas);
    }
  },

  _createTile: function _createTile() {
    var canvasTile = _leaflet2.default.DomUtil.create('canvas', 'leaflet-tile'),
        imgTile = _leaflet2.default.DomUtil.create('img', 'leaflet-tile');

    canvasTile.height = canvasTile.width = this.options.tileSize;
    imgTile.width = canvasTile.width = this.options.tileSize;
    canvasTile.onselectstart = canvasTile.onmouseove = _leaflet2.default.Util.falseFn;
    imgTile.onselectstart = imgTile.onmousemove = _leaflet2.default.Util.falseFn;

    return { image: imgTile, canvas: canvasTile };
  },

  _loadTile: function _loadTile(tile, tilePoint) {
    this._layer = this;
    this._tilePoint = tilePoint;

    this._adjustTilePoint(tilePoint);

    this.image.src = this.getTileUrl(tilePoint);
    this.image.onload = this._tileOnLoad(this, tile);
    this.image.onerror = this._tileOnError(this, tile);

    this.fire('tileloadstart', {
      tile: tile,
      url: tile.image.src
    });
  },

  _tileOnLoad: function _tileOnLoad(layer, tile) {
    return function () {
      if (this.src !== _leaflet2.default.Util.emptyImageUrl) {
        _leaflet2.default.DomUtil.addClass(tile.canvas, 'leaflet-tile-loaded');
        _leaflet2.default.DomUtil.addClass(tile.image, 'leaflet-tile-loaded');

        layer.fire('tileload', {
          tile: this,
          url: this.src
        });
      }

      layer._redrawTile(tile);
      layer._tileLoaded();
    };
  },

  _tileOnError: function _tileOnError(layer, tile) {
    return function () {
      layer.fire('tileerror', {
        tile: this,
        url: this.src
      });

      layer._tileLoaded();
    };
  },

  _tileLoaded: function _tileLoaded() {
    this._tilesToLoad--;

    if (!this._tilesToLoad) {
      this.fire('load');
    }
  },

  flipY: function flipY(y, z) {
    return Math.pow(2, z) - y - 1;
  },

  toRad: function toRad(n) {
    return n * Math.PI / 180;
  },

  getHeightForPoint: function getHeightForPoint(lat, lon) {
    var zoom = this._map.getZoom(),
        tileSize = this._getTileSize();
    x = (lon + 180) / 360 * (1 << zoom), y = (1 - Math.log(Math.tan(this.toRad(lat)) + 1 / Math.cos(this.toRad(lat))) / Math.PI) / 2 * (1 << zoom), xTile = parseInt(Math.floor(x)), yTile = parseInt(Math.floor(y)), tileX = Math.floor((x - xTile) * tileSize / 1.0), tileY = Math.floor((y - yTile) * tileSize / 1.0);

    var tile = this._tiles[xTile + ':' + yTile];
    var offset = tileY * tileSize + tileX;

    if (tile && tile.floatData) {
      if (this.options.debug) {
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

  drawTile: function drawTile(tile, tilePoint, zoom) {
    var ctx = tile.canvas.getContext('2d');
    ctx.drawImage(tile.image, 0, 0);
    var imageData = ctx.getImageData(0, 0, tile.canvas.width, tile.canvas.height);
    tile.buffer = imageData.data.buffer;
    this.floatData = new Float32Array(tile.buffer);
  },

  tileDrawn: function tileDrawn(tile) {
    this._tileOnLoad.call(tile);
  }
});