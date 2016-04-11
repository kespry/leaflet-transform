import L from 'leaflet';
import DoubleMixin from "./DoubleMixin";

export default L.Polyline.extend({
  parentClass: L.Polyline,
  includes: DoubleMixin,
});
