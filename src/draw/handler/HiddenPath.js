import L from 'leaflet';
import SimplePolyGroup from '../../edit/handler/SimplePolyGroup';

const HiddenPath = L.Polygon.extend({
  options: {
    opacity: 0,
    fillOpacity: 0
  }
});

HiddenPath.addInitHook(function() {
  this.editing = new SimplePolyGroup(this);

	if (this.options.editable) {
		this.editing.enable();
	}
});

export default HiddenPath;
