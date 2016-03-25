import L from 'leaflet';
import MarkerExt from '../../ext/MarkerExt';

const SimpleShape = L.Handler.extend({
	options: {
		moveIcon: new L.DivIcon({
			iconSize: new L.Point(8, 8),
			className: 'leaflet-div-icon leaflet-editing-icon leaflet-edit-move'
		}),
		resizeIcon: new L.DivIcon({
			iconSize: new L.Point(8, 8),
			className: 'leaflet-div-icon leaflet-editing-icon leaflet-edit-resize'
		}),
		rotateIcon : new L.DivIcon({
			iconSize : new L.Point(8, 8),
			className : 'leaflet-div-icon leaflet-editing-icon leaflet-edit-rotate'
		}),
		edgeIcon : new L.DivIcon({
			iconSize: new L.Point(8, 8),
			className: 'leaflet-div-icon leaflet-editing-icon'
		}),
		transforms: ['move', 'rotate', 'resize']
	},

	initialize: function(shape, options) {
		this._shape = shape;
		L.Util.setOptions(this, options);
		var handlerOptions = this._shape.options.handler || {};
		L.Util.setOptions(this, handlerOptions);
	},

	addHooks: function() {
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

	removeHooks: function() {
		var shape = this._shape;

		shape.setStyle(shape.options.original);

		if (shape._map) {
			if(this._moveMarker) this._unbindMarker(this._moveMarker);
			if(this._rotateMarker) this._unbindMarker(this._rotateMarker);

			if(this._resizeMarkers) {
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

	updateMarkers: function() {
		this._markerGroup.clearLayers();
		this._initMarkers();
	},

	_initMarkers: function() {
		if (!this._markerGroup) {
			this._markerGroup = new L.LayerGroup();
		}

		this.options.transforms.forEach(function(transform) {
			typeof(transform) === 'object' ?
				this.transforms.ui[transform.type.toLowerCase()].call(this, transform)
					: this.transforms.ui[transform.toLowerCase()].call(this);
		}.bind(this));
	},

	// children override
	transforms: {
		ui: {
			move: function() {},
			resize: function() {},
			rotate: function() {},
		},

		events: {
			move: function() {},
			resize: function() {},
			rotate: function() {},
		}
	},

	_createMarker: function (latlng, icon, dx, dy) {
		if(dx === undefined) {
			dx = 0;
			dy = 0;
		}
		var marker = new MarkerExt(latlng, {
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

	_bindMarker: function(marker) {
		marker
			.on('dragstart', this._onMarkerDragStart, this)
			.on('drag', this._onMarkerDrag, this)
			.on('dragend', this._onMarkerDragEnd, this);
	},

	_unbindMarker: function(marker) {
		marker
			.off('dragstart', this._onMarkerDragStart, this)
			.off('drag', this._onMarkerDrag, this)
			.off('dragend', this._onMarkerDragEnd, this);
	},

	_onMarkerDragStart: function(e) {
		var marker = e.target;
		marker.setOpacity(0);

		this._shape.fire('editstart');
	},

	_fireEdit: function() {
		this._shape.edited = true;
		this._shape.fire('edit');
	},

	_onMarkerDrag: function(e) {
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

	_onMarkerDragEnd: function(e) {
		var marker = e.target;
		marker.setOpacity(1);

		this._fireEdit();
	}
});

export default SimpleShape;
