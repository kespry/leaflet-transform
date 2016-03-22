import L from 'leaflet';

export default L.Polyline.extend({
  initialize: function(latLng, dx, dy, options) {
      L.Polyline.prototype.initialize.call(this, [latLng, latLng], options);
      this._dx = dx;
      this._dy = dy;
  },

  setLatLng: function(latLng) {
      this.setLatLngs([latLng, latLng]);
      this.redraw();
  },

  setMoveTo: function(dx, dy) {
      this._dx = dx;
      this._dy = dy;
      this.redraw();
  },

  _simplifyPoints: function() {
      if(this._parts && this._parts.length != 0) {
          var pt1 = this._parts[0][0];
          // displace point 2
          var pt2 =  L.point(pt1.x + this._dx, pt1.y + this._dy);
           this._parts[0] = [pt1, pt2];
      }
      L.Polyline.prototype._simplifyPoints.call(this);
  }
});
