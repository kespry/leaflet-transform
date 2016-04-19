'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _TransformPolygonWithMarkers = require('./TransformPolygonWithMarkers');

var _TransformPolygonWithMarkers2 = _interopRequireDefault(_TransformPolygonWithMarkers);

exports['default'] = _TransformPolygonWithMarkers2['default'].extend({
  initialize: function initialize(polygon, markers, options) {
    _TransformPolygonWithMarkers2['default'].prototype.initialize.apply(this, arguments);

    this._imageOverlay = new L.Edit.ImageOverlay(this._polygon, options.image);
    this.addLayer(this._imageOverlay);

    this._polygon.addTransformLayer(this._imageOverlay);
  }
});
module.exports = exports['default'];