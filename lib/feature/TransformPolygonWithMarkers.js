'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _leaflet = require('leaflet');

var _leaflet2 = _interopRequireDefault(_leaflet);

var _DoubleBorderPolygon = require('../draw/handler/DoubleBorderPolygon');

var _DoubleBorderPolygon2 = _interopRequireDefault(_DoubleBorderPolygon);

var _TransformMarker = require('../ext/TransformMarker');

var _TransformMarker2 = _interopRequireDefault(_TransformMarker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _leaflet2.default.FeatureGroup.extend({
  includes: [_leaflet2.default.Mixin.Events],
  initialize: function initialize(polygon, markers, options) {
    this.options = options;
    this._layers = {};

    this.update(polygon, markers, true);

    var group = this;
    this.editing = {
      state: false,
      enable: function enable() {
        group.editing.state = true;
        group._polygon.editing.enable();
        group.fire("edit", { state: true });
        group._polygon._map.on('contextmenu', group._addMarker, group);
      },
      disable: function disable() {
        group.editing.state = false;
        group._polygon.editing.disable();
        group.fire("edit", { state: false });
        group._polygon._map.off('contextmenu', group._addMarker, group);
      },
      on: group.on.bind(group),
      off: group.off.bind(group)
    };
  },

  _addMarker: function _addMarker(e) {
    if (this._markers) {
      var marker = new _TransformMarker2.default(e.latlng, this.options.markers, this);
      this._polygon.addTransformLayer(marker);

      this._markers.eachLayer(function (layer) {
        layer.addLayer(marker);
      });

      this.onDoneEditing();
      e.originalEvent.preventDefault();
    }
  },

  _removeMarker: function _removeMarker(e) {
    this._markers.eachLayer(function (layer) {
      layer.removeLayer(e.target);
    });

    this.onDoneEditing();
    e.originalEvent.preventDefault();
  },

  update: function update(polygon, markers, init) {
    if (polygon) this._createPolygon(polygon);
    if (markers) {
      if (!this.options.markers.hidden) {
        this._createMarkers(markers);
        this.addLayer(this._markers);
      } else {
        this._uninitializedMarkers = markers;
      }
      if (!init) this._createMarkers(markers);
    }
  },

  _createPolygon: function _createPolygon(polygon) {
    if (this._polygon) {
      this.removeLayer(this._polygon);
      this._polygon.off('edit', this.onDoneEditing, this);
      delete this._polygon;
    }
    this._polygon = new _DoubleBorderPolygon2.default(polygon.coordinates[0].map(function (coord) {
      return _leaflet2.default.latLng(coord[1], coord[0]);
    }), this.options.polygon);

    this.addLayer(this._polygon);
    this._polygon.on('edit', this.onDoneEditing, this);
  },

  _createMarkers: function _createMarkers(markers) {
    if (this._markers) {
      this.removeLayer(this._markers);
      delete this._markers;
    }

    var group = this;
    this._markers = _leaflet2.default.geoJson(markers, {
      pointToLayer: function pointToLayer(geojson, latlng) {
        var marker = new _TransformMarker2.default(latlng, group.options.markers, group);
        group._polygon.addTransformLayer(marker);

        return marker;
      }
    });
  },

  onDoneEditing: function onDoneEditing() {
    var changes = {};
    if (this._polygon) changes.polygon = this._polygon.toGeoJSON().geometry;
    if (this._markers) changes.markers = this._markers.toGeoJSON().features.pop().geometry;

    this.fire('done', changes);
  },
  onAdd: function onAdd() {
    _leaflet2.default.FeatureGroup.prototype.onAdd.apply(this, arguments);
    this.fire("add");
  },
  toggleMarkers: function toggleMarkers(visibility) {
    if (!this._markers && this._uninitializedMarkers) {
      this._createMarkers(this._uninitializedMarkers);
    }
    if (!this._markers) return;
    if (visibility && !this.hasLayer(this._markers)) {
      this.addLayer(this._markers);
    } else if (!visibility) {
      this.removeLayer(this._markers);
    }
  }
});