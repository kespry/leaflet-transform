'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _leaflet = require('leaflet');

var _leaflet2 = _interopRequireDefault(_leaflet);

var _layerOverlayJs = require('../layer/Overlay.js');

var _layerOverlayJs2 = _interopRequireDefault(_layerOverlayJs);

var _drawHandlerHiddenPath = require('../draw/handler/HiddenPath');

var _drawHandlerHiddenPath2 = _interopRequireDefault(_drawHandlerHiddenPath);

exports['default'] = _leaflet2['default'].FeatureGroup.extend({
  initialize: function initialize(bounds, options) {
    this._layers = {};
    options = options || {};

    this._polygon = this._createPathGeometry(bounds, options.path);

    this.addLayer(this._polygon);

    this._overlay = new _layerOverlayJs2['default'](this._polygon, {
      renderer: options.renderer.type,
      url: options.url
    });
    this._polygon.addTransformLayer(this._overlay);
    this.addLayer(this._overlay);

    console.log('added poly!');

    var group = this;
    this.editing = {
      enable: function enable() {
        group._polygon.editing.enable();
      },
      disable: function disable() {
        group._polygon.editing.disable();
      },
      on: group._polygon.editing.on.bind(group._polygon.editing),
      off: group._polygon.editing.off.bind(group._polygon.editing)
    };
  },

  _createPathGeometry: function _createPathGeometry(bounds) {
    return new _drawHandlerHiddenPath2['default'](this._pathFromBounds(bounds));
  },

  _pathFromBounds: function _pathFromBounds(bounds) {
    var latLngBounds = _leaflet2['default'].latLngBounds(bounds);
    return [latLngBounds.getSouthWest(), latLngBounds.getNorthWest(), latLngBounds.getNorthEast(), latLngBounds.getSouthEast()];
  }
});
module.exports = exports['default'];