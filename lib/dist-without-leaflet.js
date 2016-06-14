'use strict';

var _leaflet = require('leaflet');

var _leaflet2 = _interopRequireDefault(_leaflet);

var _TransformPolygonWithImageOverlay = require('./feature/TransformPolygonWithImageOverlay');

var _TransformPolygonWithImageOverlay2 = _interopRequireDefault(_TransformPolygonWithImageOverlay);

var _TransformImageOverlay = require('./feature/TransformImageOverlay');

var _TransformImageOverlay2 = _interopRequireDefault(_TransformImageOverlay);

var _TransformPolygonWithMarkers = require('./feature/TransformPolygonWithMarkers');

var _TransformPolygonWithMarkers2 = _interopRequireDefault(_TransformPolygonWithMarkers);

var _DoubleBorderPolygon = require('./draw/handler/DoubleBorderPolygon');

var _DoubleBorderPolygon2 = _interopRequireDefault(_DoubleBorderPolygon);

var _PointAlignmentOverlay = require('./layer/PointAlignmentOverlay');

var _PointAlignmentOverlay2 = _interopRequireDefault(_PointAlignmentOverlay);

var _HeightMapLayer = require('./layer/HeightMapLayer');

var _HeightMapLayer2 = _interopRequireDefault(_HeightMapLayer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_leaflet2.default.TransformPolygonWithImageOverlay = _TransformPolygonWithImageOverlay2.default;
_leaflet2.default.TransformImageOverlay = _TransformImageOverlay2.default;
_leaflet2.default.TransformPolygonWithMarkers = _TransformPolygonWithMarkers2.default;
_leaflet2.default.DoubleBorderPolygon = _DoubleBorderPolygon2.default;
_leaflet2.default.PointAlignmentOverlay = _PointAlignmentOverlay2.default;
_leaflet2.default.HeightMapLayer = _HeightMapLayer2.default;