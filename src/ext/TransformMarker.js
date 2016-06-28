import L from 'leaflet';

export default L.Marker.extend({
  options: {
    draggable: true
  },
  initialize: function(latlng, options, group) {
     L.Marker.prototype.initialize.apply(this, arguments);

     this._origLatLng = latlng;
     this._group = group;

     this.on("add", function() {
      this._bindEvents();
     }, this);

     this.on("remove", function() {
      this._unbindEvents();
     }, this);
  },
  _bindEvents: function() {
    this.on("remove", this._toggleEditState, this);
    
    if(this._group) {
      this._group.on("edit", this._toggleEditState, this);
      this.on("dragend", this._group.onDoneEditing, this._group);
      this.on("contextmenu", this._group._removeMarker, this._group);
    }

    this._toggleEditState();
  },
  _unbindEvents: function() {
    this.off("remove", this._toggleEditState, this);
    
    if(this._group) {
      this._group.off("edit", this._toggleEditState, this);
      this.off("dragend", this._group.onDoneEditing, this._group);
      this.off("contextmenu", this._group._removeMarker, this._group);   
    }
  },
  _toggleEditState: function(event) {
    var state = event && event.state ? event.state : this._group.editing.state;
    if(this.dragging) state ? this.dragging.enable() : this.dragging.disable();
  },
  applyTransform: function(tx) {
    if(tx) {
      this.setLatLng(tx.apply(this._origLatLng));
    } else {
      this._origLatLng = this.getLatLng();
    }
  }
});
