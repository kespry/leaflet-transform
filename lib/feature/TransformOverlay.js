'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _leaflet = require('leaflet');

var _leaflet2 = _interopRequireDefault(_leaflet);

var _Overlay = require('../layer/Overlay.js');

var _Overlay2 = _interopRequireDefault(_Overlay);

var _HiddenPath = require('../draw/handler/HiddenPath');

var _HiddenPath2 = _interopRequireDefault(_HiddenPath);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _leaflet2.default.FeatureGroup.extend({
  initialize: function initialize(bounds, options) {
    this._layers = {};
    options = options || {};

    this._polygon = this._createPathGeometry(bounds, options.path);

    this.addLayer(this._polygon);

    this._overlay = new _Overlay2.default(this._polygon, {
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
    return new _HiddenPath2.default(this._pathFromBounds(bounds));
  },

  _pathFromBounds: function _pathFromBounds(bounds) {
    var latLngBounds = _leaflet2.default.latLngBounds(bounds);
    return [latLngBounds.getSouthWest(), latLngBounds.getNorthWest(), latLngBounds.getNorthEast(), latLngBounds.getSouthEast()];
  }
});