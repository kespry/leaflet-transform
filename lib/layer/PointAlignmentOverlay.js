"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _leaflet = require("leaflet");

var _leaflet2 = _interopRequireDefault(_leaflet);

var _affinefit = require("affinefit");

var _affinefit2 = _interopRequireDefault(_affinefit);

var _nudged = require("nudged");

var _nudged2 = _interopRequireDefault(_nudged);

var _matrixmath = require("matrixmath");

exports["default"] = _leaflet2["default"].Class.extend({
  includes: _leaflet2["default"].Mixin.Events,

  options: {
    opacity: 1
  },

  initialize: function initialize(url, bounds, options) {
    this._bounds = _leaflet2["default"].latLngBounds(bounds);

    _leaflet2["default"].setOptions(this, options);
    this.setUrl(url);
    this.setControlPoints(options.controlPoints);
  },

  onAdd: function onAdd(map) {
    this._map = map;
    this._el = this._createElement();
    this._getPane().appendChild(this._el);

    this._request = this._startLoadingSVG();

    map.on("viewreset", this._reset, this);
    map.on("zoomend", this._zoomEnd, this);

    this._reset();
  },

  onRemove: function onRemove(map) {
    if (this._request) {
      this._request.abort();
    }
    this._el.remove();
    this._el = null;

    map.off("viewreset", this._reset, this);
    map.off("zoomend", this._zoomEnd, this);
  },

  setUrl: function setUrl(url) {
    if (url !== this._url) {
      this._url = url;
      if (this._el) {
        this._empty();
        this._request = this._startLoadingSVG();
      }
    }
    return this;
  },

  setOpacity: function setOpacity(opacity) {
    this.options.opacity = opacity;
    this._updateOpacity();
    return this;
  },

  setControlPoints: function setControlPoints(controlPoints) {
    this.controlPoints = controlPoints || { source: [], destination: [] };
    this._updateLayer();
    return this;
  },

  /**
   * Applies the inverse transform on a point.
   */
  inverseTransformPoint: function inverseTransformPoint(point) {
    var _this = this;

    var projection = function projection(latlng) {
      return _this._map.latLngToLayerPoint(latlng);
    };
    var matrix = this._getTransformMatrix(projection);
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
    var point = this._map.latLngToLayerPoint(latlng);
    var transformed = this.inverseTransformPoint(point);
    return this._map.layerPointToLatLng([transformed.x, transformed.y]);
  },

  _zoomEnd: function _zoomEnd() {
    this._updateLayer();
  },

  addTo: function addTo(map) {
    map.addLayer(this);
    return this;
  },

  _getPane: function _getPane() {
    return this._map.getPanes().overlayPane;
  },

  _empty: function _empty() {
    while (this._el.lastChild) {
      this._el.removeChild(this._el.lastChild);
    }
  },

  _createElement: function _createElement() {
    var el = _leaflet2["default"].DomUtil.create("object", "leaflet-image-layer leaflet-zoom-hide");
    el.style.pointerEvents = "none";
    el.style.opacity = "0";
    el.style.transition = "opacity .25s";
    return el;
  },

  _startLoadingSVG: function _startLoadingSVG() {
    var _this2 = this;

    var request = new XMLHttpRequest();
    request.onload = function () {
      _this2._setSVGContent(request.responseText);
    };
    request.onerror = function () {
      _this2.fire("error");
    };
    request.open("GET", this._url);
    request.send();
    return request;
  },

  _setSVGContent: function _setSVGContent(svg) {
    var _this3 = this;

    var svgBlob = new Blob([svg], { type: "image/svg+xml" });
    if (this._el) {
      this._el.data = URL.createObjectURL(svgBlob);
      // We don't need to cleanup this event handler. It will be automatically removed when
      // the element is removed from the DOM (in onRemove).
      this._el.onload = function () {
        _this3._svg = _this3._el.contentDocument.getElementsByTagName("svg")[0];
        if (_this3._svg) {
          _this3._svg.style.width = _this3._svg.style.height = "100%";
          _this3.fire("load");
          _this3._updateLayer();
        } else {
          // No SVG element means there was a parsing error.
          _this3.fire("error");
        }
      };
    }
  },

  /**
   * Update the layer and position it for the specified zoom and center. If zoom/center aren't
   * specified, the map's current values will be used instead.
   */
  _updateLayer: function _updateLayer(zoom, center) {
    if (this._map && this._svg) {
      zoom = zoom || this._map.getZoom();
      center = center || this._map.getCenter();
      this._updateLineScale(zoom);
      this._applyTransform(zoom, center);
      this._updateOpacity();
    }
  },

  _updateLineScale: function _updateLineScale(zoom) {
    var scale = Math.pow(2, zoom - 20);
    var stroke = this.options.stroke ? this.options.stroke : 1;
    this._svg.style.fontSize = stroke / scale + "em";
  },

  _getOrigin: function _getOrigin(projection) {
    return projection(this._bounds.getNorthWest());
  },

  _reset: function _reset() {
    var layer = this._el;
    var topLeft = this._map.latLngToLayerPoint(this._bounds.getNorthWest());
    var size = this._map.latLngToLayerPoint(this._bounds.getSouthEast())._subtract(topLeft);

    _leaflet2["default"].DomUtil.setPosition(layer, topLeft);

    layer.style.width = size.x + "px";
    layer.style.height = size.y + "px";
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
      var _ref22 = _slicedToArray(_ref2, 2);

      var x = _ref22[0];
      var y = _ref22[1];
      return [x - origin.x, y - origin.y];
    });
  },

  _updateOpacity: function _updateOpacity() {
    _leaflet2["default"].DomUtil.setOpacity(this._el, this.options.opacity);
  },

  _transformPoint: function _transformPoint(matrix, point) {
    var pointVector = new _matrixmath.Matrix(3, 1);
    pointVector.setData([point.x, point.y, 1]);

    var _matrix$clone$multiply$toArray = matrix.clone().multiply(pointVector).toArray();

    var _matrix$clone$multiply$toArray2 = _slicedToArray(_matrix$clone$multiply$toArray, 3);

    var x = _matrix$clone$multiply$toArray2[0];
    var y = _matrix$clone$multiply$toArray2[1];
    var _ = _matrix$clone$multiply$toArray2[2];

    return { x: x, y: y };
  },

  _getTransformMatrix: function _getTransformMatrix(projection, origin) {
    var _controlPoints = this.controlPoints;
    var source = _controlPoints.source;
    var destination = _controlPoints.destination;

    var sourcePoints = this._projectControlPoints(source, projection, origin);
    var destinationPoints = this._projectControlPoints(destination, projection, origin);

    var transform;
    var matrix = new _matrixmath.Matrix(3, 3);
    if (sourcePoints.length >= 3) {
      // When we have 3 or more control points, use the affineFit library which produces better transforms.
      transform = (0, _affinefit2["default"])(sourcePoints, destinationPoints);
      matrix.setData([
      //    a                  c                  e
      transform.M[0][3], transform.M[1][3], transform.M[2][3],
      //    b                  d                  f
      transform.M[0][4], transform.M[1][4], transform.M[2][4], 0, 0, 1]);
    } else {
      // When we have less than 3 control points, use Nudged which accepts any number of points.
      transform = _nudged2["default"].estimate("TSR", sourcePoints, destinationPoints);

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

  _applyTransform: function _applyTransform(zoom, center) {
    var _this4 = this;

    var projection = function projection(latlng) {
      return _this4._map._latLngToNewLayerPoint(latlng, zoom, center);
    };
    var origin = this._getOrigin(projection);
    var matrix = this._getTransformMatrix(projection, origin);
    if (matrix) {
      var cssMatrix = this._getCSSTransformMatrix(matrix);
      var translateStr = _leaflet2["default"].DomUtil.getTranslateString(origin);
      var matrixStr = "matrix(" + cssMatrix.join(",") + ")";

      this._el.style.transform = translateStr + " " + matrixStr;
      this._el.style.transformOrigin = "0 0 0";
    }
  },

  getMercatorTransform: function getMercatorTransform() {
    var projection = function projection(latLng) {
      var _L$Projection$SphericalMercator$project = _leaflet2["default"].Projection.SphericalMercator.project(latLng);

      var x = _L$Projection$SphericalMercator$project.x;
      var y = _L$Projection$SphericalMercator$project.y;

      return {
        x: x * _leaflet2["default"].Projection.Mercator.R_MAJOR,
        y: y * _leaflet2["default"].Projection.Mercator.R_MAJOR
      };
    };

    var origin = this._getOrigin(projection);
    var matrix = this._getTransformMatrix(projection, origin);
    if (matrix) {
      var corners = [this._bounds.getNorthWest(), this._bounds.getNorthEast(), this._bounds.getSouthEast(), this._bounds.getSouthWest()];
      return {
        bounds: corners.map(projection).map(this._ptToArr),
        transform: this._getCSSTransformMatrix(matrix)
      };
    }
  }
});
module.exports = exports["default"];