'use strict';

var _leaflet = require('leaflet');

var _leaflet2 = _interopRequireDefault(_leaflet);

var _TransformImageOverlay = require('../feature/TransformImageOverlay');

var _TransformImageOverlay2 = _interopRequireDefault(_TransformImageOverlay);

var _data = require('./data');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var layers = [];
var markerObjects = [];

_data.images.forEach(function (image) {
  layers.push(_leaflet2.default.tileLayer(image.ortho_tile_options.baseUrl + "/{z}/{x}/{y}.png", {
    minZoom: image.ortho_tile_options.minZoom,
    maxNativeZoom: image.ortho_tile_options.maxNativeZoom,
    maxZoom: 25,
    tms: true,
    bounds: image.ortho_tile_options.boounds
  }));
});

_data.markers.forEach(function (marker) {
  var transformImage = new _TransformImageOverlay2.default(marker.geojson, {
    polygon: {
      handler: {
        transforms: ['move', 'resize', 'rotate']
      }
    },
    url: '/cropped.png'
  });

  markerObjects.push(transformImage);

  transformImage.editing.on('done', function (changes) {
    console.log('done editing!', changes);
  });
});

var map = new _leaflet2.default.Map('map', { layers: layers, center: new _leaflet2.default.LatLng(_data.sites[0].center_lat, _data.sites[0].center_lng), zoom: 20 });
markerObjects.forEach(function (marker) {
  marker.addTo(map);
  marker.editing.enable();
});