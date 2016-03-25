import L from 'leaflet';

export default L.ImageOverlay.extend({
  initialize: function (options) {
	  this._url = options.url;
    L.setOptions(this, options);
    this._initImage();
  },
  _initImage: function () {
    this._image = L.DomUtil.create('img', 'leaflet-image-layer');
    L.DomUtil.addClass(this._image, 'leaflet-zoom-hide');

    this._updateOpacity();

    //TODO createImage util method to remove duplication
    L.extend(this._image, {
      galleryimg: 'no',
      onselectstart: L.Util.falseFn,
      onmousemove: L.Util.falseFn,
      onload: L.bind(this._onImageLoad, this),
      src: this._url
    });
  },
  setPolygon: function(polygon) {
    this._polygon = polygon;
    this._bounds = polygon.getBounds();
  },
  applyTransform: function(tx) {
    if(tx) {
      if(this._lastTx) {
        tx = this._lastTx.clone(tx).applyTransform(tx);
      }

      var transform =
        [tx.getCSSTranslateString(this._origLeft), tx.getCSSTransformString(true)].join(" ");
          this._image.style[L.DomUtil.TRANSFORM] = transform;
        this._tx = tx;

        this._image._leaflet_pos = tx._applyPts(this._origLeft);
    } else {
      this._lastTx = this._tx;
    }
  },
  _animateZoom: function() {
    this._bounds = this._polygon.getBounds();
    L.ImageOverlay.prototype._animateZoom.apply(this, arguments);
  },
  _reset: function() {
    var image   = this._image,
	    topLeft = this._map.latLngToLayerPoint(this._polygon.getBounds().getNorthWest()),
	    size = this._map.latLngToLayerPoint(this._polygon.getBounds().getSouthEast())._subtract(topLeft);

    this._origLeft = topLeft;
    image.style.width  = size.x + 'px';
    image.style.height = size.y + 'px';
    image.style.transformOrigin = '0 0 0';

    L.DomUtil.setPosition(image, topLeft);
  }
});
