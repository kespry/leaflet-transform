import L from 'leaflet';

export default L.Marker.extend({
  options: {
    draggable: true
  },
  initialize: function(latlng, options, group) {
     L.Marker.prototype.initialize.apply(this, arguments);

     this._origLatLng = latlng;

     this.on("add", function() {
       if(group.editing.state) {
         this.dragging.enable();
       } else {
         this.dragging.disable();
       }
     });

     this.on("remove", function() {
       group.off("edit", this._toggleEditState, this);
     });

     this.on("dragend", function() {
       this._origLatLng = this.getLatLng();
     });

     group.on("edit", this._toggleEditState, this);
  },
  _toggleEditState: function(event) {
    if(this.dragging) event.state ? this.dragging.enable() : this.dragging.disable();
  },
  applyTransform: function(tx) {
    if(tx) {
      this.setLatLng(tx.apply(this._origLatLng));
    } else {
      this._origLatLng = this.getLatLng();
    }
  }
});
