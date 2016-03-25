'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _leaflet = require('leaflet');

var _leaflet2 = _interopRequireDefault(_leaflet);

var _Path = require('./Path');

var _Path2 = _interopRequireDefault(_Path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SimplePolyGroup = _Path2.default.extend({
  includes: [_leaflet2.default.Mixin.Events],

  _onMarkerDragEnd: function _onMarkerDragEnd(e) {
    _Path2.default.prototype._onMarkerDragEnd.call(this, e);
    this._updateTransformLayers();

    var current = this._boundsPoint(this._shape.getLatLngs());
    var orig = this._boundsPoint(this._initLatLngs);
    this.fire("done", {
      offset: _leaflet2.default.latLng(current.lat - orig.lat, current.lng - orig.lng),
      current: this._boundsPoint(this._shape.getLatLngs()),
      tx: this._tx
    });
  },

  _boundsPoint: function _boundsPoint(latLngs) {
    return _leaflet2.default.latLngBounds(latLngs).getNorthWest();
  },

  _updateTransformLayers: function _updateTransformLayers(tx) {
    for (var i = 0; i < this._shape._transformLayers.length; i++) {
      var layer = this._shape._transformLayers[i];
      layer.applyTransform(tx);
    }
  }
});

var transforms = SimplePolyGroup.prototype.transforms;
["move", "resize", "rotate"].forEach(function (mouseEvent) {
  var ev = transforms.events[mouseEvent];
  transforms.events[mouseEvent] = function (pt) {
    this._tx = ev.apply(this, arguments);
    this._updateTransformLayers(this._tx);
  };
});

_leaflet2.default.Polygon.include({
  addTransformLayer: function addTransformLayer(layer) {
    this._transformLayers.push(layer);
  }
});

_leaflet2.default.Polygon.addInitHook(function () {
  this._transformLayers = [];
});

exports.default = SimplePolyGroup;