'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (options) {
  var proxy = new DragProxy(options.el);
  proxy._map = this._map;
  proxy.enable();

  return proxy;
};

var _leaflet = require('leaflet');

var _leaflet2 = _interopRequireDefault(_leaflet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DragProxy = _leaflet2.default.Draggable.extend({
  getLatLng: function getLatLng() {
    return this._map.layerPointToLatLng(this._newPos);
  },
  setLatLng: function setLatLng() {},
  _updatePosition: function _updatePosition() {
    this.fire('drag');
  },
  setOpacity: function setOpacity() {}
});

;