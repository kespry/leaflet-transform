import L from "leaflet";
import affineFit from "affinefit";
import nudged from "nudged";
import { Matrix } from "matrixmath";

export default L.Class.extend({
  includes: L.Mixin.Events,

  options: {
    opacity: 1,
  },

  initialize: function (url, bounds, options) {
    this._bounds = L.latLngBounds(bounds);

    L.setOptions(this, options);
    this.setUrl(url);
    this.setControlPoints(options.controlPoints);
  },

  onAdd: function (map) {
    this._map = map;
    this._el = this._createElement();
    this._getPane().appendChild(this._el);

    this._request = this._startLoadingSVG();

    map.on("viewreset", this._reset, this);
    map.on("zoomend", this._zoomEnd, this);

    this._reset();
  },

  onRemove: function (map) {
    if (this._request) {
      this._request.abort();
    }
    this._el.remove();
    this._el = null;

    map.off("viewreset", this._reset, this);
    map.off("zoomend", this._zoomEnd, this);
  },

  setUrl: function (url) {
    if (url !== this._url) {
      this._url = url;
      if (this._el) {
        this._empty();
        this._request = this._startLoadingSVG();
      }
    }
    return this;
  },

  setOpacity: function (opacity) {
    this.options.opacity = opacity;
    this._updateOpacity();
    return this;
  },

  setControlPoints: function(controlPoints) {
    this.controlPoints = controlPoints || { source: [], destination: [] };
    this._updateLayer();
    return this;
  },

  /**
   * Applies the inverse transform on a point.
   */
  inverseTransformPoint: function(point) {
    const projection = (latlng) => this._map.latLngToLayerPoint(latlng);
    const matrix = this._getTransformMatrix(projection);
    if (matrix) {
      const inverse = matrix.clone().invert();
      return this._transformPoint(inverse, point);
    }
    return point;
  },

  /**
   * Applies the inverse transform on a latlng point.
   */
  inverseTransformLatLng: function(latlng) {
    const point = this._map.latLngToLayerPoint(latlng);
    const transformed = this.inverseTransformPoint(point);
    return this._map.layerPointToLatLng([transformed.x, transformed.y]);
  },

  _zoomEnd: function() {
    this._updateLayer();
  },

  addTo: function (map) {
    map.addLayer(this);
    return this;
  },

  _getPane: function() {
    return this._map.getPanes().overlayPane;
  },

  _empty: function() {
    while (this._el.lastChild) {
      this._el.removeChild(this._el.lastChild);
    }
  },

  _createElement: function() {
    const el = L.DomUtil.create("object", "leaflet-image-layer leaflet-zoom-hide");
    el.style.pointerEvents = "none";
    el.style.opacity = "0";
    el.style.transition = "opacity .25s";
    return el;
  },

  _startLoadingSVG: function() {
    const request = new XMLHttpRequest();
    request.onload = () => {
      this._setSVGContent(request.responseText);
    };
    request.onerror = () => {
      this.fire("error");
    };
    request.open("GET", this._url);
    request.send();
    return request;
  },

  _setSVGContent: function(svg) {
    const svgBlob = new Blob([svg], { type: "image/svg+xml" });
    if (this._el) {
      this._el.data = URL.createObjectURL(svgBlob);
      // We don't need to cleanup this event handler. It will be automatically removed when
      // the element is removed from the DOM (in onRemove).
      this._el.onload = () => {
        this._svg = this._el.contentDocument.getElementsByTagName("svg")[0];
        if (this._svg) {
          this._svg.style.width = this._svg.style.height = "100%";
          this.fire("load");
          this._updateLayer();
        } else {
          // No SVG element means there was a parsing error.
          this.fire("error");
        }
      };
    }
  },

  /**
   * Update the layer and position it for the specified zoom and center. If zoom/center aren't
   * specified, the map's current values will be used instead.
   */
  _updateLayer: function(zoom, center) {
    if (this._map && this._svg) {
      zoom = zoom || this._map.getZoom();
      center = center || this._map.getCenter();
      this._updateLineScale(zoom);
      this._applyTransform(zoom, center);
      this._updateOpacity();
    }
  },

  _updateLineScale: function(zoom) {
    var scale = Math.pow(2, zoom - 20);
    var stroke = this.options.stroke ? this.options.stroke : 1;
    this._svg.style.fontSize = `${stroke / scale}em`;
  },

  _getOrigin: function(projection) {
    return projection(this._bounds.getNorthWest());
  },

  _reset: function () {
    const layer   = this._el;
    const topLeft = this._map.latLngToLayerPoint(this._bounds.getNorthWest());
    const size = this._map.latLngToLayerPoint(this._bounds.getSouthEast())._subtract(topLeft);

    L.DomUtil.setPosition(layer, topLeft);

    layer.style.width  = `${size.x}px`;
    layer.style.height = `${size.y}px`;
  },

  _ptToArr: ({ x, y }) => ([x, y]),

  _projectControlPoints: function(points, projection, origin) {
    var projected = points.map(projection).map(this._ptToArr);
    if (origin) {
      projected = this._subtractOrigin(projected, origin);
    }
    return projected;
  },

  _subtractOrigin: function(points, origin) {
    return points.map(([x, y]) => ([x - origin.x, y - origin.y]));
  },

  _updateOpacity: function () {
    L.DomUtil.setOpacity(this._el, this.options.opacity);
  },

  _transformPoint: function(matrix, point) {
    const pointVector = new Matrix(3, 1);
    pointVector.setData([point.x, point.y, 1]);

    const [x, y, _] = matrix.clone().multiply(pointVector).toArray();
    return { x, y };
  },

  _getTransformMatrix: function(projection, origin) {
    const { source, destination } = this.controlPoints;
    var sourcePoints = this._projectControlPoints(source, projection, origin);
    var destinationPoints = this._projectControlPoints(destination, projection, origin);

    var transform;
    var matrix = new Matrix(3, 3);
    if (sourcePoints.length >= 3) {
      // When we have 3 or more control points, use the affineFit library which produces better transforms.
      transform = affineFit(sourcePoints, destinationPoints);
      matrix.setData([
        //    a                  c                  e
        transform.M[0][3], transform.M[1][3], transform.M[2][3],
        //    b                  d                  f
        transform.M[0][4], transform.M[1][4], transform.M[2][4],
        0, 0, 1,
      ]);
    } else {
      // When we have less than 3 control points, use Nudged which accepts any number of points.
      transform = nudged.estimate("TSR", sourcePoints, destinationPoints);
      const { a, b, c, d, e, f } = transform.getMatrix();
      matrix.setData([
        a, c, e,
        b, d, f,
        0, 0, 1,
      ]);
    }
    return matrix;
  },

  _getCSSTransformMatrix: function(matrix) {
    //     [   a     ,    b     ,    c     ,    d     ,    e     ,    f     ]
    return [matrix[0], matrix[3], matrix[1], matrix[4], matrix[2], matrix[5]];
  },

  _applyTransform: function(zoom, center) {
    const projection = (latlng) => this._map._latLngToNewLayerPoint(latlng, zoom, center);
    const origin = this._getOrigin(projection);
    const matrix = this._getTransformMatrix(projection, origin);
    if(matrix) {
      const cssMatrix = this._getCSSTransformMatrix(matrix);
      var translateStr = L.DomUtil.getTranslateString(origin);
      var matrixStr = `matrix(${cssMatrix.join(",")})`;

      this._el.style.transform = `${translateStr} ${matrixStr}`;
      this._el.style.transformOrigin = "0 0 0";
    }
  },

  getMercatorTransform: function() {
    var projection = (latLng) => {
      var { x, y } = L.Projection.SphericalMercator.project(latLng);
      return {
        x: x * L.Projection.Mercator.R_MAJOR,
        y: y * L.Projection.Mercator.R_MAJOR,
      };
    };

    const origin = this._getOrigin(projection);
    const matrix = this._getTransformMatrix(projection, origin);
    if (matrix) {
      const corners = [
        this._bounds.getNorthWest(),
        this._bounds.getNorthEast(),
        this._bounds.getSouthEast(),
        this._bounds.getSouthWest(),
      ];
      return {
        bounds: corners.map(projection).map(this._ptToArr),
        transform: this._getCSSTransformMatrix(matrix),
      };
    }
  },
});
