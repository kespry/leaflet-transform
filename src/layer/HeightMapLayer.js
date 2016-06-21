import L from "leaflet";

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

  getHeightForPoint: function(lat, lon) {
    var zoom     = this._map.getZoom(),
        tileSize = this._getTileSize();
        x        = ((lon + 180) / 360 * (1<<zoom)),
        y        = (1 - Math.log(Math.tan(this.toRad(lat)) + 1 / Math.cos(this.toRad(lat))) / Math.PI) / 2 * (1<<zoom),
        xTile    = parseInt(Math.floor(x)),
        yTile    = parseInt(Math.floor(y)),
        tileX    = Math.floor(((x - xTile) * tileSize) / 1.0),
        tileY    = Math.floor(((y - yTile) * tileSize) / 1.0);

    var tile = this._tiles[xTile + ':' + yTile];
    var offset = (tileY * tileSize) + tileX;

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
