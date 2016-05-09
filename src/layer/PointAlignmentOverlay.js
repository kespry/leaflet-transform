import L from "leaflet";
import affineFit from "affinefit";
import nudged from "nudged";
import { Matrix } from "matrixmath";

const proto = L.TileLayer.prototype;

export default L.TileLayer.extend({

  initialize: function (url, options) {
    proto.initialize.call(this, url, options);
    this.setControlPoints(options.controlPoints);
  },

  setControlPoints: function(controlPoints) {
    this.controlPoints = controlPoints || { source: [], destination: [] };
    if (this._map) {
      this._updateLayerTransform();
    }
    return this;
  },

  /**
   * Applies the inverse transform on a point.
   */
  inverseTransformPoint: function(point) {
    const projection = this._mapProjection.bind(this);
    const matrix = this._getTransformMatrix(projection, projection);
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
    const point = this._mapProjection(latlng);
    const transformed = this.inverseTransformPoint(point);
    return this._map.layerPointToLatLng([transformed.x, transformed.y]);
  },

  _reset: function (e) {
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
  _getTilePos: function(tilePoint) {
    const origin = this._getOrigin(this._mapProjection.bind(this));
    var pos = proto._getTilePos.call(this, tilePoint);
    pos = pos.subtract(origin);
    return pos;
  },

  /**
   * Sets the correct size on the tile layer container as if it were a regular layer.
   */
  _resizeLayer: function() {
    const { bounds } = this.options;
    const nw = this._mapProjection(bounds.getNorthWest());
    const se = this._mapProjection(bounds.getSouthEast());
    const size = se.subtract(nw);

    this._tileContainer.style.width  = `${size.x}px`;
    this._tileContainer.style.height = `${size.y}px`;
  },

  /**
   * Update the layer and position it based on the current control points.
   */
  _updateLayerTransform: function() {
    if (this._map) {
      this._applyTransform();
    }
  },

  _mapProjection: function(latlng) {
    return this._map.latLngToLayerPoint(latlng);
  },

  _getOrigin: function(projection) {
    return projection(this.options.bounds.getNorthWest());
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

  _transformPoint: function(matrix, point) {
    const pointVector = new Matrix(3, 1);
    pointVector.setData([point.x, point.y, 1]);

    const [x, y] = matrix.clone().multiply(pointVector).toArray();
    return { x, y };
  },

  _getTransformMatrix: function(sourceProjection, destinationProjection, origin) {
    const { source, destination } = this.controlPoints;
    var sourcePoints = this._projectControlPoints(source, sourceProjection, origin);
    var destinationPoints = this._projectControlPoints(destination, destinationProjection, origin);

    var transform;
    var matrix = new Matrix(3, 3);
    if (sourcePoints.length >= 3) {
      // When we have 3 or more control points, use the affineFit library which produces better transforms.
      transform = affineFit(sourcePoints, destinationPoints);
      matrix.setData([
        /*      a      */  /*      c      */  /*      e      */
        transform.M[0][3], transform.M[1][3], transform.M[2][3],
        /*      b      */  /*      d      */  /*      f      */
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

  _applyTransform: function() {
    const projection = this._mapProjection.bind(this);
    const origin = this._getOrigin(projection);
    const matrix = this._getTransformMatrix(projection, projection, origin);
    if(matrix) {
      const cssMatrix = this._getCSSTransformMatrix(matrix);
      var translateStr = L.DomUtil.getTranslateString(origin);
      var matrixStr = `matrix(${cssMatrix.join(",")})`;

      this._tileContainer.style.transform = `${translateStr} ${matrixStr}`;
      this._tileContainer.style.transformOrigin = "0 0 0";
    }
  },
});
