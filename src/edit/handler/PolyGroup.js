import L from 'leaflet';
import Poly from './Poly';

const PolyGroup = Poly.extend({
  includes: [L.Mixin.Events],

  _onMarkerDragEnd: function(e) {
    Poly.prototype._onMarkerDragEnd.call(this, e);
    this._updateTransformLayers();
  },

  _updateTransformLayers: function(tx) {
    for(var i = 0; i < this._shape._transformLayers.length; i++) {
      var layer = this._shape._transformLayers[i];
      layer.applyTransform(tx);
    }
  }
});

["_move", "_resize", "_rotate"].forEach(function(mouseEvent) {
  PolyGroup.prototype[mouseEvent] = function(pt) {
    var tx = Poly.prototype[mouseEvent].apply(this, arguments);
    this._updateTransformLayers(tx);
  }
});

L.Polygon.include({
  addTransformLayer: function(layer) {
    this._transformLayers.push(layer);
  }
});

L.Polygon.addInitHook(function() {
  this._transformLayers = [];
});

export default PolyGroup;
