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
   * Override this method and subtract origin so that tiles are positioned relative to
   * the container.
   */
  _getTilePos: function _getTilePos(tilePoint) {
    var origin = this._getOrigin(this._mapProjection.bind(this));
    var pos = proto._getTilePos.call(this, tilePoint);
    pos = pos.subtract(origin);
    return pos;
  },

  /**
   * Sets the correct size on the tile layer container as if it were a regular layer.
   */
  _resizeLayer: function _resizeLayer() {
    var bounds = this.options.bounds;

    var nw = this._mapProjection(bounds.getNorthWest());
    var se = this._mapProjection(bounds.getSouthEast());
    var size = se.subtract(nw);

    this._tileContainer.style.width = size.x + "px";
    this._tileContainer.style.height = size.y + "px";
  },

  /**
   * Update the layer and position it based on the current control points.
   */
  _updateLayerTransform: function _updateLayerTransform() {
    if (this._map) {
      this._applyTransform();
    }
  },

  _mapProjection: function _mapProjection(latlng) {
    return this._map.latLngToLayerPoint(latlng);
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

  _applyTransform: function _applyTransform() {
    var projection = this._mapProjection.bind(this);
    var origin = this._getOrigin(projection);
    var matrix = this._getTransformMatrix(projection, projection, origin);
    if (matrix) {
      var cssMatrix = this._getCSSTransformMatrix(matrix);
      var translateStr = _leaflet2.default.DomUtil.getTranslateString(origin);
      var matrixStr = "matrix(" + cssMatrix.join(",") + ")";

      this._tileContainer.style.transform = translateStr + " " + matrixStr;
      this._tileContainer.style.transformOrigin = "0 0 0";
    }
  }
});