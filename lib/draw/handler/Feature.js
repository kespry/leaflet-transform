'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _leaflet = require('leaflet');

var _leaflet2 = _interopRequireDefault(_leaflet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Feature = _leaflet2.default.Handler.extend({
	includes: _leaflet2.default.Mixin.Events,

	initialize: function initialize(map, options) {
		this._map = map;
		this._container = map._container;
		this._overlayPane = map._panes.overlayPane;
		this._popupPane = map._panes.popupPane;

		// Merge default shapeOptions options with custom shapeOptions
		if (options && options.shapeOptions) {
			options.shapeOptions = _leaflet2.default.Util.extend({}, this.options.shapeOptions, options.shapeOptions);
		}
		_leaflet2.default.setOptions(this, options);
	},

	enable: function enable() {
		if (this._enabled) {
			return;
		}

		_leaflet2.default.Handler.prototype.enable.call(this);
		this.fire('enabled', { handler: this.type });
		this._map.fire('draw:drawstart', { layerType: this.type });
	},

	disable: function disable() {
		if (!this._enabled) {
			return;
		}

		_leaflet2.default.Handler.prototype.disable.call(this);
		this._map.fire('draw:drawstop', { layerType: this.type });
		this.fire('disabled', { handler: this.type });
	},

	addHooks: function addHooks() {
		var map = this._map;

		if (map) {
			_leaflet2.default.DomUtil.disableTextSelection();

			map.getContainer().focus();
			this._tooltip = new _leaflet2.default.Tooltip(this._map);
			_leaflet2.default.DomEvent.on(this._container, 'keyup', this._cancelDrawing, this);
		}
	},

	removeHooks: function removeHooks() {
		if (this._map) {
			_leaflet2.default.DomUtil.enableTextSelection();

			this._tooltip.dispose();
			this._tooltip = null;
			_leaflet2.default.DomEvent.off(this._container, 'keyup', this._cancelDrawing, this);
		}
	},

	setOptions: function setOptions(options) {
		_leaflet2.default.setOptions(this, options);
	},

	_fireCreatedEvent: function _fireCreatedEvent(layer) {
		this._map.fire('draw:created', { layer: layer, layerType: this.type });
	},

	// Cancel drawing when the escape key is pressed
	_cancelDrawing: function _cancelDrawing(e) {
		if (e.keyCode === 27) {
			this.disable();
		}
	}
});

exports.default = Feature;