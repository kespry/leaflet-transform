import L from 'leaflet';
import DoubleBorderPolygon from '../draw/handler/DoubleBorderPolygon';
import TransformMarker from '../ext/TransformMarker';

export default L.FeatureGroup.extend({
  includes: [L.Mixin.Events],
  initialize: function(polygon, markers, options) {
    this.options = options;
    this._layers = {};

    if(polygon) {
      this._polygon = new DoubleBorderPolygon(polygon.coordinates[0].map(function(coord) {
        return L.latLng(coord[1], coord[0]);
      }), this.options.polygon);

      this.addLayer(this._polygon);
    }

    var group = this;
    if(markers) {
      this._markers = L.geoJson(markers, {
        pointToLayer: function(geojson, latlng) {
          var basePoint = new TransformMarker(latlng, group.options.basePoints, group);
          group._polygon.addTransformLayer(basePoint);

          basePoint.on('dragend', group.onDoneEditing.bind(group));

          return basePoint;
        }
      });

      this.addLayer(this._markers);
    }

    this._polygon.on('edit', group.onDoneEditing.bind(group));

    this.editing = {
      state: false,
      enable: function() {
        group.editing.state = true;
        group._polygon.editing.enable();
        group.fire("edit", { state: true });
      },
      disable: function() {
        group.editing.state = false;
        group._polygon.editing.disable();
        group.fire("edit", { state: false });
      },
      on: group.on.bind(group),
      off: group.off.bind(group)
    };
  },
  onDoneEditing: function() {
    var changes = {};
    if(this._polygon) changes.polygon = this._polygon.toGeoJSON().geometry;
    if(this._markers) changes.markers = this._markers.toGeoJSON().features.pop().geometry;

    this.fire('done', changes);
  },

  onAdd: function() {
    L.FeatureGroup.prototype.onAdd.apply(this, arguments);
    this.fire("add");
  }
});
