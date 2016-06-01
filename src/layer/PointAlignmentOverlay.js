import L from "leaflet";
import affineFit from "affinefit";
import nudged from "nudged";
import { Matrix } from "matrixmath";

const proto = L.TileLayer.prototype;
const TRANSLATE_REGEX = /translate(3d)?\(.+?\)/gi;
const MATRIX_REGEX = /matrix\(.+?\)/gi;
const SCALE_REGEX = /scale\(.+?\)/gi;

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
   * Override this method to record the previous zoom.
   */
  _animateZoom: function(e) {
    this._prevZoom = this._map.getZoom();
    proto._animateZoom.call(this, e);
  },

  /**
   * Override this method and subtract origin so that tiles are positioned relative to
   * the container.
   */
  _getTilePos: function(tilePoint) {
    const origin = this._getOrigin(this._mapProjection.bind(this));
    var pos = proto._getTilePos.call(this, tilePoint);
    return pos.subtract(origin);
  },

  /**
   * Override this method to load tiles correctly. The issue was that leaflet only loads tiles that
   * are visible in the map's viewport. Since our tiles are transformed, if the original
   * bounds of the tiles aren't visible, leaflet won't load them (even though the transformed bounds
   * are visible).
   */
  _addTilesFromCenterOut: function(pixelBounds) {
    const inversed = this._inverseTransformPixelBounds(pixelBounds);
    proto._addTilesFromCenterOut.call(this, inversed);
  },

  /**
   * Same as above.
   */
  _removeOtherTiles: function(pixelBounds) {
    const inversed = this._inverseTransformPixelBounds(pixelBounds);
    proto._removeOtherTiles.call(this, inversed);
  },

  _inverseTransformPixelBounds: function(pixelBounds) {
    const bounds = this._pixelToLatLngBounds(pixelBounds);
    const inversedBounds = L.latLngBounds([
      this.inverseTransformLatLng(bounds.getNorthWest()),
      this.inverseTransformLatLng(bounds.getSouthEast()),
    ]);
    return this._latLngToPixelBounds(inversedBounds);
  },

  _pixelToLatLngBounds: function(pixelBounds) {
    const tileSize = this._getTileSize();
    const nwPoint = pixelBounds.min.multiplyBy(tileSize);
    const sePoint = pixelBounds.max.multiplyBy(tileSize);
    return L.latLngBounds(this._map.unproject(nwPoint), this._map.unproject(sePoint));
  },

  _latLngToPixelBounds: function(bounds) {
    const tileSize = this._getTileSize();
    const nwPoint = this._map.project(bounds.getNorthWest());
    const sePoint = this._map.project(bounds.getSouthEast());
    return new L.Bounds(
      nwPoint.divideBy(tileSize).subtract([1, 1]).floor(),
      sePoint.divideBy(tileSize).add([1, 1]).round()
    );
  },

  /**
   * Sets the correct size on the tile layer container as if it were a regular layer.
   */
  _resizeLayer: function() {
    const { bounds } = this.options;
    const nw = this._mapProjection(bounds.getNorthWest());
    const se = this._mapProjection(bounds.getSouthEast());
    const size = se.subtract(nw);

    const translate = L.DomUtil.getTranslateString(nw);
    this._updateElemTransform(this._tileContainer, { translate });
    this._tileContainer.style.transformOrigin = "0 0 0";

    this._tileContainer.style.width  = `${size.x}px`;
    this._tileContainer.style.height = `${size.y}px`;
    if (this._bgBuffer) {
      this._bgBuffer.style.width  = `${size.x}px`;
      this._bgBuffer.style.height = `${size.y}px`;
    }
  },

  /**
   * Update the layer and position it based on the current control points.
   */
  _updateLayerTransform: function() {
    if (this._map) {
      const projection = this._mapProjection.bind(this);
      this._applyTransform(this._tileContainer, projection);
      if (this._shouldApplyPrevZoomTransform()) {
        const prevZoomProjection = this._zoomProjection.bind(this, this._prevZoom);
        this._applyTransform(this._bgBuffer, prevZoomProjection);
      }
    }
  },

  _shouldApplyPrevZoomTransform: function() {
    return this._prevZoom && this._bgBuffer && this._bgBuffer.children.length > 0;
  },

  _mapProjection: function(latlng) {
    return this._map.latLngToLayerPoint(latlng);
  },

  _zoomProjection: function(zoom, latlng) {
    return this._map._latLngToNewLayerPoint(latlng, zoom, this._map.getCenter());
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

  _applyTransform: function(elem, projection) {
    const origin = this._getOrigin(projection);
    const transformMatrix = this._getTransformMatrix(projection, projection, origin);
    if(transformMatrix) {
      const cssMatrix = this._getCSSTransformMatrix(transformMatrix);
      const matrix = `matrix(${cssMatrix.join(",")})`;
      this._updateElemTransform(elem, { matrix });
    }
  },

  _updateElemTransform: function(elem, { translate, scale, matrix }) {
    const changes = [
      [TRANSLATE_REGEX, translate],
      [SCALE_REGEX, scale],
      [MATRIX_REGEX, matrix],
    ];
    const newTransform = changes.reduce(
      (transform, [regex, newValue]) => this._replaceTransform(transform, regex, newValue),
      elem.style.transform || ""
    );
    elem.style.transform = newTransform;
  },

  _replaceTransform: function(transform, regex, newValue) {
    if (newValue) {
      return transform.replace(regex, "") + " " + newValue;
    }
    return transform;
  },
});
