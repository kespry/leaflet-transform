import L from 'leaflet';

export default L.ImageOverlay.extend({
  initialize: function (polygon, options) {
	  this._url = options.url;
	  this._bounds = polygon.getBounds();
    L.setOptions(this, options);
    this._polygon = polygon;
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
