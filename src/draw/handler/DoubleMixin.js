import L from 'leaflet';
import EditPolyGroup from '../../edit/handler/PolyGroup';

const DoubleMixin = L.Class.extend({
  initialize: function() {
    this.parentClass.prototype.initialize.apply(this, arguments);
    var self = this;
    ["_initStyle", "_updateStyle", "_updatePath"].forEach(function(method) {
      self[method] = drawDoublePath.call(self, method);
    });
  },

  _initPath: function() {
    this._container = this._createElement("g");
    this._primaryPath = this._path = this._createElement("path");
    this._secondaryPath = this._createElement("path");

    if (this.options.className) {
      L.DomUtil.addClass(this._path, this.options.className);
      L.DomUtil.addClass(this._secondaryPath, this.options.className);
    }

    this._container.appendChild(this._secondaryPath);
    this._container.appendChild(this._primaryPath);
  }
});

function drawDoublePath(method) {
  return function() {
    // Backup old values.
    var options = this.options;
    var path = this._path;

    // Primary path.
    this._path = this._primaryPath;
    this.options = Object.assign({}, options, this.options.primary);
    this.parentClass.prototype[method].apply(this, arguments);

    // Secondary path.
    this._path = this._secondaryPath;
    this.options = Object.assign({}, options, this.options.secondary);
    this.parentClass.prototype[method].apply(this, arguments);

    // Restore old values.
    this._path = path;
    this.options = options;
  }
}

// ["_initStyle", "_updateStyle", "_updatePath"].forEach(function(method) {
//   // DoubleMixin.prototype[reserved + method] = DoubleMixin.prototype[method];
//   DoubleMixin.prototype[method] = drawDoublePath(method);
// });

DoubleMixin.addInitHook(function () {
  this.editing = new EditPolyGroup(this);

	if (this.options.editable) {
		this.editing.enable();
	}
});

export default DoubleMixin.prototype;
