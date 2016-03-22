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

     this.on("dragend", function() {
       this._origLatLng = this.getLatLng();
     });

     var marker = this;
     group.on("edit", function(event) {
       event.state ? marker.dragging.enable() : marker.dragging.disable();
     });
  },
  applyTransform: function(tx) {
    if(tx) {
      this.setLatLng(tx.apply(this._origLatLng));
    } else {
      this._origLatLng = this.getLatLng();
    }
  }
});
