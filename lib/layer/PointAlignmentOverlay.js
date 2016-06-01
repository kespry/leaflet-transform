"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _leaflet = require("leaflet");

var _leaflet2 = _interopRequireDefault(_leaflet);

var _affinefit = require("affinefit");

var _affinefit2 = _interopRequireDefault(_affinefit);

var _nudged = require("nudged");

var _nudged2 = _interopRequireDefault(_nudged);

var _matrixmath = require("matrixmath");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var proto = _leaflet2.default.TileLayer.prototype;
var TRANSLATE_REGEX = /translate(3d)?\(.+?\)/gi;
var MATRIX_REGEX = /matrix\(.+?\)/gi;
var SCALE_REGEX = /scale\(.+?\)/gi;

exports.default = _leaflet2.default.TileLayer.extend({
  initialize: function initialize(url, options) {
    proto.initialize.call(this, url, options);
    this.setControlPoints(options.controlPoints);
  },

  setControlPoints: function setControlPoints(controlPoints) {
    this.controlPoints = controlPoints || { source: [], destination: [] };
    if (this._map) {
      this._updateLayerTransform();
    }
    return this;
  },

  /**
   * Applies the inverse transform on a point.
   */
  inverseTransformPoint: function inverseTransformPoint(point) {
    var projection = this._mapProjection.bind(this);
    var matrix = this._getTransformMatrix(projection, projection);
    if (matrix) {
      var inverse = matrix.clone().invert();
      return this._transformPoint(inverse, point);
    }
    return point;
  },

  /**
   * Applies the inverse transform on a latlng point.
   */
  inverseTransformLatLng: function inverseTransformLatLng(latlng) {
    var point = this._mapProjection(latlng);
    var transformed = this.inverseTransformPoint(point);
    return this._map.layerPointToLatLng([transformed.x, transformed.y]);
  },

  _reset: function _reset(e) {
    proto._reset.call(this, e);
    if (this._map) {
      this._resizeLayer();
      this._updateLayerTransform();
    }
  },

  /**
   * Override this method to record the previous zoom.
   */
  _animateZoom: function _animateZoom(e) {
    this._prevZoom = this._map.getZoom();
    proto._animateZoom.call(this, e);
  },

  /**
   * Override this method and subtract origin so that tiles are positioned relative to
   * the container.
   */
  _getTilePos: function _getTilePos(tilePoint) {
    var origin = this._getOrigin(this._mapProjection.bind(this));
    var pos = proto._getTilePos.call(this, tilePoint);
    return pos.subtract(origin);
  },

  /**
   * Override this method to load tiles correctly. The issue was that leaflet only loads tiles that
   * are visible in the map's viewport. Since our tiles are transformed, if the original
   * bounds of the tiles aren't visible, leaflet won't load them (even though the transformed bounds
   * are visible).
   */
  _addTilesFromCenterOut: function _addTilesFromCenterOut(pixelBounds) {
    var inversed = this._inverseTransformPixelBounds(pixelBounds);
    proto._addTilesFromCenterOut.call(this, inversed);
  },

  /**
   * Same as above.
   */
  _removeOtherTiles: function _removeOtherTiles(pixelBounds) {
    var inversed = this._inverseTransformPixelBounds(pixelBounds);
    proto._removeOtherTiles.call(this, inversed);
  },

  _inverseTransformPixelBounds: function _inverseTransformPixelBounds(pixelBounds) {
    var bounds = this._pixelToLatLngBounds(pixelBounds);
    var inversedBounds = _leaflet2.default.latLngBounds([this.inverseTransformLatLng(bounds.getNorthWest()), this.inverseTransformLatLng(bounds.getSouthEast())]);
    return this._latLngToPixelBounds(inversedBounds);
  },

  _pixelToLatLngBounds: function _pixelToLatLngBounds(pixelBounds) {
    var tileSize = this._getTileSize();
    var nwPoint = pixelBounds.min.multiplyBy(tileSize);
    var sePoint = pixelBounds.max.multiplyBy(tileSize);
    return _leaflet2.default.latLngBounds(this._map.unproject(nwPoint), this._map.unproject(sePoint));
  },

  _latLngToPixelBounds: function _latLngToPixelBounds(bounds) {
    var tileSize = this._getTileSize();
    var nwPoint = this._map.project(bounds.getNorthWest());
    var sePoint = this._map.project(bounds.getSouthEast());
    return new _leaflet2.default.Bounds(nwPoint.divideBy(tileSize).subtract([1, 1]).floor(), sePoint.divideBy(tileSize).add([1, 1]).round());
  },

  /**
   * Sets the correct size on the tile layer container as if it were a regular layer.
   */
  _resizeLayer: function _resizeLayer() {
    var bounds = this.options.bounds;

    var nw = this._mapProjection(bounds.getNorthWest());
    var se = this._mapProjection(bounds.getSouthEast());
    var size = se.subtract(nw);

    var translate = _leaflet2.default.DomUtil.getTranslateString(nw);
    this._updateElemTransform(this._tileContainer, { translate: translate });
    this._tileContainer.style.transformOrigin = "0 0 0";

    this._tileContainer.style.width = size.x + "px";
    this._tileContainer.style.height = size.y + "px";
    if (this._bgBuffer) {
      this._bgBuffer.style.width = size.x + "px";
      this._bgBuffer.style.height = size.y + "px";
    }
  },

  /**
   * Update the layer and position it based on the current control points.
   */
  _updateLayerTransform: function _updateLayerTransform() {
    if (this._map) {
      var projection = this._mapProjection.bind(this);
      this._applyTransform(this._tileContainer, projection);
      if (this._shouldApplyPrevZoomTransform()) {
        var prevZoomProjection = this._zoomProjection.bind(this, this._prevZoom);
        this._applyTransform(this._bgBuffer, prevZoomProjection);
      }
    }
  },

  _shouldApplyPrevZoomTransform: function _shouldApplyPrevZoomTransform() {
    return this._prevZoom && this._bgBuffer && this._bgBuffer.children.length > 0;
  },

  _mapProjection: function _mapProjection(latlng) {
    return this._map.latLngToLayerPoint(latlng);
  },

  _zoomProjection: function _zoomProjection(zoom, latlng) {
    return this._map._latLngToNewLayerPoint(latlng, zoom, this._map.getCenter());
  },

  _getOrigin: function _getOrigin(projection) {
    return projection(this.options.bounds.getNorthWest());
  },

  _ptToArr: function _ptToArr(_ref) {
    var x = _ref.x;
    var y = _ref.y;
    return [x, y];
  },

  _projectControlPoints: function _projectControlPoints(points, projection, origin) {
    var projected = points.map(projection).map(this._ptToArr);
    if (origin) {
      projected = this._subtractOrigin(projected, origin);
    }
    return projected;
  },

  _subtractOrigin: function _subtractOrigin(points, origin) {
    return points.map(function (_ref2) {
      var _ref3 = _slicedToArray(_ref2, 2);

      var x = _ref3[0];
      var y = _ref3[1];
      return [x - origin.x, y - origin.y];
    });
  },

  _transformPoint: function _transformPoint(matrix, point) {
    var pointVector = new _matrixmath.Matrix(3, 1);
    pointVector.setData([point.x, point.y, 1]);

    var _matrix$clone$multipl = matrix.clone().multiply(pointVector).toArray();

    var _matrix$clone$multipl2 = _slicedToArray(_matrix$clone$multipl, 2);

    var x = _matrix$clone$multipl2[0];
    var y = _matrix$clone$multipl2[1];

    return { x: x, y: y };
  },

  _getTransformMatrix: function _getTransformMatrix(sourceProjection, destinationProjection, origin) {
    var _controlPoints = this.controlPoints;
    var source = _controlPoints.source;
    var destination = _controlPoints.destination;

    var sourcePoints = this._projectControlPoints(source, sourceProjection, origin);
    var destinationPoints = this._projectControlPoints(destination, destinationProjection, origin);

    var transform;
    var matrix = new _matrixmath.Matrix(3, 3);
    if (sourcePoints.length >= 3) {
      // When we have 3 or more control points, use the affineFit library which produces better transforms.
      transform = (0, _affinefit2.default)(sourcePoints, destinationPoints);
      matrix.setData([
      /*      a      */ /*      c      */ /*      e      */
      transform.M[0][3], transform.M[1][3], transform.M[2][3],
      /*      b      */ /*      d      */ /*      f      */
      transform.M[0][4], transform.M[1][4], transform.M[2][4], 0, 0, 1]);
    } else {
      // When we have less than 3 control points, use Nudged which accepts any number of points.
      transform = _nudged2.default.estimate("TSR", sourcePoints, destinationPoints);

      var _transform$getMatrix = transform.getMatrix();

      var a = _transform$getMatrix.a;
      var b = _transform$getMatrix.b;
      var c = _transform$getMatrix.c;
      var d = _transform$getMatrix.d;
      var e = _transform$getMatrix.e;
      var f = _transform$getMatrix.f;

      matrix.setData([a, c, e, b, d, f, 0, 0, 1]);
    }
    return matrix;
  },

  _getCSSTransformMatrix: function _getCSSTransformMatrix(matrix) {
    //     [   a     ,    b     ,    c     ,    d     ,    e     ,    f     ]
    return [matrix[0], matrix[3], matrix[1], matrix[4], matrix[2], matrix[5]];
  },

  _applyTransform: function _applyTransform(elem, projection) {
    var origin = this._getOrigin(projection);
    var transformMatrix = this._getTransformMatrix(projection, projection, origin);
    if (transformMatrix) {
      var cssMatrix = this._getCSSTransformMatrix(transformMatrix);
      var matrix = "matrix(" + cssMatrix.join(",") + ")";
      this._updateElemTransform(elem, { matrix: matrix });
    }
  },

  _updateElemTransform: function _updateElemTransform(elem, _ref4) {
    var _this = this;

    var translate = _ref4.translate;
    var scale = _ref4.scale;
    var matrix = _ref4.matrix;

    var changes = [[TRANSLATE_REGEX, translate], [SCALE_REGEX, scale], [MATRIX_REGEX, matrix]];
    var newTransform = changes.reduce(function (transform, _ref5) {
      var _ref6 = _slicedToArray(_ref5, 2);

      var regex = _ref6[0];
      var newValue = _ref6[1];
      return _this._replaceTransform(transform, regex, newValue);
    }, elem.style.transform || "");
    elem.style.transform = newTransform;
  },

  _replaceTransform: function _replaceTransform(transform, regex, newValue) {
    if (newValue) {
      return transform.replace(regex, "") + " " + newValue;
    }
    return transform;
  }
});