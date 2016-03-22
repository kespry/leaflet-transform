import L from 'leaflet';
import Path from './Path';

const SimplePolyGroup = Path.extend({
  includes: [L.Mixin.Events],

  _onMarkerDragEnd: function(e) {
    Path.prototype._onMarkerDragEnd.call(this, e);
    this._updateTransformLayers();

    var current = this._boundsPoint(this._shape.getLatLngs());
    var orig = this._boundsPoint(this._initLatLngs);
    this.fire("done", {
      offset: L.latLng(current.lat - orig.lat, current.lng - orig.lng),
      current: this._boundsPoint(this._shape.getLatLngs()),
      tx: this._tx
    });
  },

  _boundsPoint: function(latLngs) {
    return L.latLngBounds(latLngs).getNorthWest();
  },

  _updateTransformLayers: function(tx) {
    for(var i = 0; i < this._shape._transformLayers.length; i++) {
      var layer = this._shape._transformLayers[i];
      layer.applyTransform(tx);
    }
  }
});

["_move", "_resize", "_rotate"].forEach(function(mouseEvent) {
  SimplePolyGroup.prototype[mouseEvent] = function(pt) {
    this._tx = Path.prototype[mouseEvent].apply(this, arguments);
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

export default SimplePolyGroup;
