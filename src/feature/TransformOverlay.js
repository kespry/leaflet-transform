import L from 'leaflet';
import Overlay from '../layer/Overlay.js';
import HiddenPathPolygon from '../draw/handler/HiddenPath';

export default L.FeatureGroup.extend({
  initialize: function(bounds, options) {
    this._layers = {};
    options = options || {};


      this._polygon = this._createPathGeometry(bounds, options.path);

      this.addLayer(this._polygon);


    this._overlay = new Overlay(this._polygon, {
      renderer: options.renderer.type,
      url: options.url
    });
      this._polygon.addTransformLayer(this._overlay);
    this.addLayer(this._overlay);

    console.log('added poly!');

    var group = this;
    this.editing = {
      enable: function() {
        group._polygon.editing.enable();
      },
      disable: function() {
        group._polygon.editing.disable();
      },
      on: group._polygon.editing.on.bind(group._polygon.editing),
      off: group._polygon.editing.off.bind(group._polygon.editing)
    };
  },

  _createPathGeometry: function(bounds) {
    return new HiddenPathPolygon(this._pathFromBounds(bounds));
  },

  _pathFromBounds: function(bounds) {
    var latLngBounds = L.latLngBounds(bounds);
    return [
      latLngBounds.getSouthWest(),
      latLngBounds.getNorthWest(),
      latLngBounds.getNorthEast(),
      latLngBounds.getSouthEast()
    ];
  }
});
