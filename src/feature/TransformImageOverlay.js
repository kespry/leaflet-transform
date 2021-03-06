import L from 'leaflet';
import ImageOverlay from '../edit/layer/ImageOverlay';
import HiddenPathPolygon from '../draw/handler/HiddenPath';

export default L.FeatureGroup.extend({
  initialize: function(polygon, options) {
    this._layers = {};
    options = options || {};

    this._imageOverlay = new ImageOverlay(options);

    if(polygon) {
      var enabledTransforms = options.polygon && options.polygon.handler && options.polygon.handler.transforms ? options.polygon.handler.transforms : [];
      var i = enabledTransforms.indexOf('move');
      if(i != -1) {
        enabledTransforms[i] = { type: 'move', proxy: true, el: this._imageOverlay._image };
      }

      if(enabledTransforms.length) {
        options.polygon.handler.transforms = enabledTransforms;
      }

      this._polygon = new HiddenPathPolygon(polygon.coordinates[0].map(function(coord) {
        return L.latLng(coord[1], coord[0]);
      }), options.polygon);

      this._imageOverlay.setPolygon(this._polygon);
      this._polygon.addTransformLayer(this._imageOverlay);
      this.addLayer(this._polygon);
    }

    this.addLayer(this._imageOverlay);

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

  setUrl: function(url) {
    this._imageOverlay.setUrl(url);
  }
});
