'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _leaflet = require('leaflet');

var _leaflet2 = _interopRequireDefault(_leaflet);

var _editLayerImageOverlay = require('../edit/layer/ImageOverlay');

var _editLayerImageOverlay2 = _interopRequireDefault(_editLayerImageOverlay);

var _drawHandlerHiddenPath = require('../draw/handler/HiddenPath');

var _drawHandlerHiddenPath2 = _interopRequireDefault(_drawHandlerHiddenPath);

exports['default'] = _leaflet2['default'].FeatureGroup.extend({
  initialize: function initialize(polygon, options) {
    this._layers = {};
    options = options || {};

    this._imageOverlay = new _editLayerImageOverlay2['default'](options);

    if (polygon) {
      var enabledTransforms = options.polygon && options.polygon.handler && options.polygon.handler.transforms ? options.polygon.handler.transforms : [];
      var i = enabledTransforms.indexOf('move');
      if (i != -1) {
        enabledTransforms[i] = { type: 'move', proxy: true, el: this._imageOverlay._image };
      }

      if (enabledTransforms.length) {
        options.polygon.handler.transforms = enabledTransforms;
      }

      this._polygon = new _drawHandlerHiddenPath2['default'](polygon.coordinates[0].map(function (coord) {
        return _leaflet2['default'].latLng(coord[1], coord[0]);
      }), options.polygon);

      this._imageOverlay.setPolygon(this._polygon);
      this._polygon.addTransformLayer(this._imageOverlay);
      this.addLayer(this._polygon);
    }

    this.addLayer(this._imageOverlay);

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

  setUrl: function setUrl(url) {
    this._imageOverlay.setUrl(url);
  }
});
module.exports = exports['default'];