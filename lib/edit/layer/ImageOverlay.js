'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _leaflet = require('leaflet');

var _leaflet2 = _interopRequireDefault(_leaflet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _leaflet2.default.ImageOverlay.extend({
  initialize: function initialize(options) {
    this._url = options.url;
    _leaflet2.default.setOptions(this, options);
    this._initImage();
  },
  _initImage: function _initImage() {
    this._image = _leaflet2.default.DomUtil.create('img', 'leaflet-image-layer');
    _leaflet2.default.DomUtil.addClass(this._image, 'leaflet-zoom-hide');

    this._updateOpacity();

    //TODO createImage util method to remove duplication
    _leaflet2.default.extend(this._image, {
      galleryimg: 'no',
      onselectstart: _leaflet2.default.Util.falseFn,
      onmousemove: _leaflet2.default.Util.falseFn,
      onload: _leaflet2.default.bind(this._onImageLoad, this),
      src: this._url
    });
  },
  setPolygon: function setPolygon(polygon) {
    this._polygon = polygon;
    this._bounds = polygon.getBounds();
  },
  applyTransform: function applyTransform(tx) {
    if (tx) {
      if (this._lastTx) {
        tx = this._lastTx.clone(tx).applyTransform(tx);
      }

      var transform = [tx.getCSSTranslateString(this._origLeft), tx.getCSSTransformString(true)].join(" ");
      this._image.style[_leaflet2.default.DomUtil.TRANSFORM] = transform;
      this._tx = tx;

      this._image._leaflet_pos = tx._applyPts(this._origLeft);
    } else {
      this._lastTx = this._tx;
    }
  },
  _animateZoom: function _animateZoom() {
    this._bounds = this._polygon.getBounds();
    _leaflet2.default.ImageOverlay.prototype._animateZoom.apply(this, arguments);
  },
  _reset: function _reset() {
    var image = this._image,
        topLeft = this._map.latLngToLayerPoint(this._polygon.getBounds().getNorthWest()),
        size = this._map.latLngToLayerPoint(this._polygon.getBounds().getSouthEast())._subtract(topLeft);

    this._origLeft = topLeft;
    image.style.width = size.x + 'px';
    image.style.height = size.y + 'px';
    image.style.transformOrigin = '0 0 0';

    _leaflet2.default.DomUtil.setPosition(image, topLeft);
    delete this._lastTx;
  }
});