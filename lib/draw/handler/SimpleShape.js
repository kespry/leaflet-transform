'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _leaflet = require('leaflet');

var _leaflet2 = _interopRequireDefault(_leaflet);

var _Feature = require('./Feature');

var _Feature2 = _interopRequireDefault(_Feature);

var SimpleShape = _leaflet2['default'].Draw.Feature.extend({
	options: {
		repeatMode: false
	},

	initialize: function initialize(map, options) {
		this._endLabelText = _leaflet2['default'].drawLocal.draw.handlers.simpleshape.tooltip.end;

		_Feature2['default'].prototype.initialize.call(this, map, options);
	},

	addHooks: function addHooks() {
		_Feature2['default'].prototype.addHooks.call(this);

		if (this._map) {
			this._mapDraggable = this._map.dragging.enabled();

			if (this._mapDraggable) {
				this._map.dragging.disable();
			}

			//TODO refactor: move cursor to styles
			this._container.style.cursor = 'crosshair';

			this._tooltip.updateContent({ text: this._initialLabelText });

			this._map.on('mousedown', this._onMouseDown, this).on('mousemove', this._onMouseMove, this);
		}
	},

	removeHooks: function removeHooks() {
		_Feature2['default'].prototype.removeHooks.call(this);
		if (this._map) {
			if (this._mapDraggable) {
				this._map.dragging.enable();
			}

			//TODO refactor: move cursor to styles
			this._container.style.cursor = '';

			this._map.off('mousedown', this._onMouseDown, this).off('mousemove', this._onMouseMove, this);

			_leaflet2['default'].DomEvent.off(document, 'mouseup', this._onMouseUp, this);

			// If the box element doesn't exist they must not have moved the mouse, so don't need to destroy/return
			if (this._shape) {
				this._map.removeLayer(this._shape);
				delete this._shape;
			}
		}
		this._isDrawing = false;
	},

	_getTooltipText: function _getTooltipText() {
		return {
			text: this._endLabelText
		};
	},

	_onMouseDown: function _onMouseDown(e) {
		this._isDrawing = true;
		this._startLatLng = e.latlng;

		_leaflet2['default'].DomEvent.on(document, 'mouseup', this._onMouseUp, this).preventDefault(e.originalEvent);
	},

	_onMouseMove: function _onMouseMove(e) {
		var latlng = e.latlng;

		this._tooltip.updatePosition(latlng);
		if (this._isDrawing) {
			this._tooltip.updateContent(this._getTooltipText());
			this._drawShape(latlng);
		}
	},

	_onMouseUp: function _onMouseUp() {
		if (this._shape) {
			this._fireCreatedEvent();
		}

		this.disable();
		if (this.options.repeatMode) {
			this.enable();
		}
	}
});

exports['default'] = SimpleShape;
module.exports = exports['default'];