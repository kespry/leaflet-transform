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

var transforms = PolyGroup.prototype.transforms;
["move", "resize", "rotate"].forEach(function(mouseEvent) {
  var ev = transforms.events[mouseEvent];
  transforms.events[mouseEvent] = function(pt) {
    this._tx = ev.apply(this, arguments);
    this._updateTransformLayers(this._tx);
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
