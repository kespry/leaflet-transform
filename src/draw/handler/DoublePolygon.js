import L from 'leaflet';
import DoubleMixin from "./DoubleMixin";

export default L.Polygon.extend({
  parentClass: L.Polygon,
  includes: DoubleMixin,
});
