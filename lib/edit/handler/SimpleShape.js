'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _leaflet = require('leaflet');

var _leaflet2 = _interopRequireDefault(_leaflet);

var _MarkerExt = require('../../ext/MarkerExt');

var _MarkerExt2 = _interopRequireDefault(_MarkerExt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SimpleShape = _leaflet2.default.Handler.extend({
	options: {
		moveIcon: new _leaflet2.default.DivIcon({
			iconSize: new _leaflet2.default.Point(12, 12),
			className: 'leaflet-div-icon leaflet-editing-icon leaflet-edit-move'
		}),
		resizeIcon: new _leaflet2.default.DivIcon({
			iconSize: new _leaflet2.default.Point(8, 8),
			className: 'leaflet-div-icon leaflet-editing-icon leaflet-edit-resize'
		}),
		rotateIcon: new _leaflet2.default.DivIcon({
			iconSize: new _leaflet2.default.Point(8, 8),
			className: 'leaflet-div-icon leaflet-editing-icon leaflet-edit-rotate'
		}),
		edgeIcon: new _leaflet2.default.DivIcon({
			iconSize: new _leaflet2.default.Point(8, 8),
			className: 'leaflet-div-icon leaflet-editing-icon'
		}),
		transforms: ['move', 'rotate', 'resize']
	},

	initialize: function initialize(shape, options) {
		this._shape = shape;
		_leaflet2.default.Util.setOptions(this, options);
		var handlerOptions = this._shape.options.handler || {};
		_leaflet2.default.Util.setOptions(this, handlerOptions);
	},

	addHooks: function addHooks() {
		var shape = this._shape;

		shape.setStyle(shape.options.editing);

		if (shape._map) {
			this._map = shape._map;

			if (!this._markerGroup) {
				this._initMarkers();
			}
			this._map.addLayer(this._markerGroup);
		}
	},

	removeHooks: function removeHooks() {
		var shape = this._shape;

		shape.setStyle(shape.options.original);

		if (shape._map) {
			if (this._moveMarker) this._unbindMarker(this._moveMarker);
			if (this._rotateMarker) this._unbindMarker(this._rotateMarker);

			if (this._resizeMarkers) {
				for (var i = 0, l = this._resizeMarkers.length; i < l; i++) {
					this._unbindMarker(this._resizeMarkers[i]);
				}
				this._resizeMarkers = null;
			}

			this._map.removeLayer(this._markerGroup);
			delete this._markerGroup;
		}

		this._map = null;
	},

	updateMarkers: function updateMarkers() {
		this._markerGroup.clearLayers();
		this._initMarkers();
	},

	_initMarkers: function _initMarkers() {
		if (!this._markerGroup) {
			this._markerGroup = new _leaflet2.default.LayerGroup();
		}

		this.options.transforms.forEach(function (transform) {
			(typeof transform === 'undefined' ? 'undefined' : (0, _typeof3.default)(transform)) === 'object' ? this.transforms.ui[transform.type.toLowerCase()].call(this, transform) : this.transforms.ui[transform.toLowerCase()].call(this);
		}.bind(this));
	},

	// children override
	transforms: {
		ui: {
			move: function move() {},
			resize: function resize() {},
			rotate: function rotate() {}
		},

		events: {
			move: function move() {},
			resize: function resize() {},
			rotate: function rotate() {}
		}
	},

	_createMarker: function _createMarker(latlng, icon, dx, dy) {
		if (dx === undefined) {
			dx = 0;
			dy = 0;
		}
		var marker = new _MarkerExt2.default(latlng, {
			draggable: true,
			icon: icon,
			zIndexOffset: 10,
			dx: dx,
			dy: dy
		});

		this._bindMarker(marker);

		this._markerGroup.addLayer(marker);

		return marker;
	},

	_bindMarker: function _bindMarker(marker) {
		marker.on('dragstart', this._onMarkerDragStart, this).on('drag', this._onMarkerDrag, this).on('dragend', this._onMarkerDragEnd, this);
	},

	_unbindMarker: function _unbindMarker(marker) {
		marker.off('dragstart', this._onMarkerDragStart, this).off('drag', this._onMarkerDrag, this).off('dragend', this._onMarkerDragEnd, this);
	},

	_onMarkerDragStart: function _onMarkerDragStart(e) {
		var marker = e.target;
		marker.setOpacity(0);

		this._shape.fire('editstart');
	},

	_fireEdit: function _fireEdit() {
		this._shape.edited = true;
		this._shape.fire('edit');
	},

	_onMarkerDrag: function _onMarkerDrag(e) {
		var marker = e.target,
		    latlng = marker.getLatLng();

		if (marker === this._moveMarker) {
			this.transforms.events.move.call(this, latlng);
		} else if (marker === this._rotateMarker) {
			this.transforms.events.rotate.call(this, latlng);
		} else {
			this.transforms.events.resize.call(this, latlng);
		}
		this._shape.redraw();
	},

	_onMarkerDragEnd: function _onMarkerDragEnd(e) {
		var marker = e.target;
		marker.setOpacity(1);

		this._fireEdit();
	}
});

exports.default = SimpleShape;