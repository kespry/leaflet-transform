import L from 'leaflet';

const DragProxy = L.Draggable.extend({
  getLatLng: function() {
    return this._map.layerPointToLatLng(this._newPos);
  },
  setLatLng: function() {},
  _updatePosition: function() {
    this.fire('drag');
  },
  setOpacity: function() {}
});

export default function(options) {
  var proxy = new DragProxy(options.el);
  proxy._map = this._map;
  proxy.enable();

  return proxy;
};
