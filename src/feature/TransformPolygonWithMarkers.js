import L from 'leaflet';
import DoubleBorderPolygon from '../draw/handler/DoubleBorderPolygon';
import TransformMarker from '../ext/TransformMarker';

export default L.FeatureGroup.extend({
  includes: [L.Mixin.Events],
  initialize: function(polygon, markers, options) {
    this.options = options;
    this._layers = {};

    this.update(polygon, markers);

    var group = this;
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

  update: function(polygon, markers) {
    if(polygon) this._createPolygon(polygon);
    if(markers) this._createMarkers(markers);
  },

  _createPolygon: function(polygon) {
    if(this._polygon) {
      this.removeLayer(this._polygon);
      this._polygon.off('edit', this.onDoneEditing, this);
      delete this._polygon;
    }
    this._polygon = new DoubleBorderPolygon(polygon.coordinates[0].map(function(coord) {
      return L.latLng(coord[1], coord[0]);
    }), this.options.polygon);

    this.addLayer(this._polygon);
    this._polygon.on('edit', this.onDoneEditing, this);
  },

  _createMarkers: function(markers) {
    if(this._markers) {
      this.removeLayer(this._markers);
      // TODO: check for memory leak in dragend listener
      delete this._markers;
    }

    var group = this;
    this._markers = L.geoJson(markers, {
      pointToLayer: function(geojson, latlng) {
        var marker = new TransformMarker(latlng, group.options.markers, group);
        group._polygon.addTransformLayer(marker);

        marker.on('dragend', group.onDoneEditing.bind(group));

        return marker;
      }
    });

    if(!this.options.markers.hidden) this.addLayer(this._markers);
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
  },
  toggleMarkers: function(visibility) {
    if(!this._markers) return;
    if(visibility && !this.hasLayer(this._markers)) {
      this.addLayer(this._markers);
    } else if(!visibility) {
      this.removeLayer(this._markers);
    }
  }
});
