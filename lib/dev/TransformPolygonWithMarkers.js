'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _leaflet = require('leaflet');

var _leaflet2 = _interopRequireDefault(_leaflet);

var _featureTransformPolygonWithMarkers = require('../feature/TransformPolygonWithMarkers');

var _featureTransformPolygonWithMarkers2 = _interopRequireDefault(_featureTransformPolygonWithMarkers);

var _data = require('./data');

var layers = [];
var markerObjects = [];

_data.images.forEach(function (image) {
  layers.push(_leaflet2['default'].tileLayer(image.ortho_tile_options.baseUrl + "/{z}/{x}/{y}.png", {
    minZoom: image.ortho_tile_options.minZoom,
    maxNativeZoom: image.ortho_tile_options.maxNativeZoom,
    maxZoom: 25,
    tms: true,
    bounds: image.ortho_tile_options.boounds
  }));
});

_data.markers.forEach(function (marker) {
  var polyWithMarkers = new _featureTransformPolygonWithMarkers2['default'](marker.geojson, marker.base_points, {
    polygon: {
      opacity: 1,
      primary: {
        color: "#fff",
        weight: 3,
        fill: false
      },
      secondary: {
        color: "#333",
        weight: 5,
        fill: false
      },
      handler: {
        transforms: ['move', 'resize', 'rotate']
      }
    },
    markers: {
      icon: _leaflet2['default'].divIcon({
        className: "polygon-marker",
        iconSize: [20, 20]
      })
    }
  });

  markerObjects.push(polyWithMarkers);

  polyWithMarkers.on('done', function (changes) {
    console.log('done editing!', changes);
  });
});

var map = new _leaflet2['default'].Map('map', { layers: layers, center: new _leaflet2['default'].LatLng(_data.sites[0].center_lat, _data.sites[0].center_lng), zoom: 20 });
markerObjects.forEach(function (marker) {
  marker.addTo(map);
  marker.editing.enable();
});