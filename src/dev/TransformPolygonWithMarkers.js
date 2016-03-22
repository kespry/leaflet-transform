import L from 'leaflet';
import TransformPolygonWithMarkers from '../feature/TransformPolygonWithMarkers';
import { sites, images, markers } from './data';

var layers = [];
var markerObjects = [];

images.forEach(function(image) {
  layers.push(L.tileLayer(image.ortho_tile_options.baseUrl + "/{z}/{x}/{y}.png", {
    minZoom: image.ortho_tile_options.minZoom,
    maxNativeZoom: image.ortho_tile_options.maxNativeZoom,
    maxZoom: 25,
    tms: true,
    bounds: image.ortho_tile_options.boounds
  }));
});

markers.forEach(function(marker) {
  var polyWithMarkers = new TransformPolygonWithMarkers(marker.geojson, marker.base_points, {
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
    basePoints: {
      icon: L.divIcon({
        className: "polygon-marker",
        iconSize: [20, 20]
      })
    }
  });

  markerObjects.push(polyWithMarkers);

  polyWithMarkers.on('done', function(changes) {
    console.log('done editing!', changes);
  });
});

var map = new L.Map('map', {layers: layers, center: new L.LatLng(sites[0].center_lat, sites[0].center_lng), zoom: 20});
markerObjects.forEach(function(marker) {
  marker.addTo(map);
  marker.editing.enable();
});
