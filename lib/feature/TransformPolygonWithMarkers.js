'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _leaflet = require('leaflet');

var _leaflet2 = _interopRequireDefault(_leaflet);

var _drawHandlerDoubleBorderPolygon = require('../draw/handler/DoubleBorderPolygon');

var _drawHandlerDoubleBorderPolygon2 = _interopRequireDefault(_drawHandlerDoubleBorderPolygon);

var _extTransformMarker = require('../ext/TransformMarker');

var _extTransformMarker2 = _interopRequireDefault(_extTransformMarker);

exports['default'] = _leaflet2['default'].FeatureGroup.extend({
  includes: [_leaflet2['default'].Mixin.Events],
  initialize: function initialize(polygon, markers, options) {
    this.options = options;
    this._layers = {};

    if (polygon) {
      this._polygon = new _drawHandlerDoubleBorderPolygon2['default'](polygon.coordinates[0].map(function (coord) {
        return _leaflet2['default'].latLng(coord[1], coord[0]);
      }), this.options.polygon);

      this.addLayer(this._polygon);
    }

    var group = this;
    if (markers) {
      this._markers = _leaflet2['default'].geoJson(markers, {
        pointToLayer: function pointToLayer(geojson, latlng) {
          var marker = new _extTransformMarker2['default'](latlng, group.options.markers, group);
          group._polygon.addTransformLayer(marker);

          marker.on('dragend', group.onDoneEditing.bind(group));

          return marker;
        }
      });

      this.addLayer(this._markers);
    }

    this._polygon.on('edit', group.onDoneEditing.bind(group));

    this.editing = {
      state: false,
      enable: function enable() {
        group.editing.state = true;
        group._polygon.editing.enable();
        group.fire("edit", { state: true });
      },
      disable: function disable() {
        group.editing.state = false;
        group._polygon.editing.disable();
        group.fire("edit", { state: false });
      },
      on: group.on.bind(group),
      off: group.off.bind(group)
    };
  },
  onDoneEditing: function onDoneEditing() {
    var changes = {};
    if (this._polygon) changes.polygon = this._polygon.toGeoJSON().geometry;
    if (this._markers) changes.markers = this._markers.toGeoJSON().features.pop().geometry;

    this.fire('done', changes);
  },

  onAdd: function onAdd() {
    _leaflet2['default'].FeatureGroup.prototype.onAdd.apply(this, arguments);
    this.fire("add");
  }
});
module.exports = exports['default'];