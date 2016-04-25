'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _leaflet = require('leaflet');

var _leaflet2 = _interopRequireDefault(_leaflet);

var _featureTransformPolygonWithImageOverlay = require('./feature/TransformPolygonWithImageOverlay');

var _featureTransformPolygonWithImageOverlay2 = _interopRequireDefault(_featureTransformPolygonWithImageOverlay);

var _featureTransformImageOverlay = require('./feature/TransformImageOverlay');

var _featureTransformImageOverlay2 = _interopRequireDefault(_featureTransformImageOverlay);

var _featureTransformPolygonWithMarkers = require('./feature/TransformPolygonWithMarkers');

var _featureTransformPolygonWithMarkers2 = _interopRequireDefault(_featureTransformPolygonWithMarkers);

var _drawHandlerDoubleBorderPolygon = require('./draw/handler/DoubleBorderPolygon');

var _drawHandlerDoubleBorderPolygon2 = _interopRequireDefault(_drawHandlerDoubleBorderPolygon);

_leaflet2['default'].TransformPolygonWithImageOverlay = _featureTransformPolygonWithImageOverlay2['default'];
_leaflet2['default'].TransformImageOverlay = _featureTransformImageOverlay2['default'];
_leaflet2['default'].TransformPolygonWithMarkers = _featureTransformPolygonWithMarkers2['default'];
_leaflet2['default'].DoubleBorderPolygon = _drawHandlerDoubleBorderPolygon2['default'];

window.L = _leaflet2['default'];