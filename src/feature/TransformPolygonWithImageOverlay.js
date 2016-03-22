import TransformPolygonWithMarkers from './TransformPolygonWithMarkers';

export default TransformPolygonWithMarkers.extend({
  initialize: function(polygon, basePoints, options) {
    TransformPolygonWithMarkers.prototype.initialize.apply(this, arguments);

    this._imageOverlay = new L.Edit.ImageOverlay(this._polygon, options.image);
    this.addLayer(this._imageOverlay);

    this._polygon.addTransformLayer(this._imageOverlay);
  }
});
