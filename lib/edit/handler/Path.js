'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _leaflet = require('leaflet');

var _leaflet2 = _interopRequireDefault(_leaflet);

var _SimpleShape = require('./SimpleShape');

var _SimpleShape2 = _interopRequireDefault(_SimpleShape);

var _AffineTransform = require('../../ext/AffineTransform');

var _LineMarker = require('../../ext/LineMarker');

var _LineMarker2 = _interopRequireDefault(_LineMarker);

var _MoveProxy = require('./MoveProxy');

var _MoveProxy2 = _interopRequireDefault(_MoveProxy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Path = _SimpleShape2.default.extend({
	includes: [_AffineTransform.SetProjections],
	initialize: function initialize() {
		this._setProjections(this.projectionMethods);
		_SimpleShape2.default.prototype.initialize.apply(this, arguments);

		this._shape.on("add", function () {
			this._initLatLngs = this._shape.getLatLngs();
		}.bind(this));
	},

	_onMarkerDragStart: function _onMarkerDragStart(e) {
		_SimpleShape2.default.prototype._onMarkerDragStart.call(this, e);

		this._origLatLngs = this._shape.getLatLngs();
		this._origTopLeft = this._shape.getBounds().getNorthWest();
		this._origCenter = this._getCenter();
		this._origAngle = this._angle;

		var corners = this._getCorners(),
		    marker = e.target,
		    currentCornerIndex = marker._cornerIndex;

		this._oppositeCorner = corners[(currentCornerIndex + 2) % 4];
		this._currentCorner = corners[currentCornerIndex];

		this._toggleCornerMarkers(0, currentCornerIndex);
	},

	_onMarkerDragEnd: function _onMarkerDragEnd(e) {
		this._toggleCornerMarkers(1);
		this._repositionAllMarkers();

		_SimpleShape2.default.prototype._onMarkerDragEnd.call(this, e);
	},

	projectionMethods: {
		pre: "latLngToLayerPoint",
		post: "layerPointToLatLng"
	},

	transforms: {
		ui: {
			move: function move(options) {
				if (options && options.proxy) {
					this._moveMarker = _MoveProxy2.default.call(this, options);

					this.getMovePoint = function () {
						return this._origTopLeft;
					}.bind(this);
					this._bindMarker(this._moveMarker);
				} else {
					this._moveMarker = this._createMarker(this._getCenter(), this.options.moveIcon);
				}
			},
			resize: function resize() {
				var corners = this._getCorners();

				this._resizeMarkers = [];

				for (var i = 0, l = corners.length; i < l; i++) {
					this._resizeMarkers.push(this._createMarker(corners[i], this.options.resizeIcon));
					this._resizeMarkers[i]._cornerIndex = i;
				}
			},
			rotate: function rotate() {
				var center = this._getCenter();

				this._rotateMarker = this._createMarker(center, this.options.rotateIcon, 0, -100);
				this._rotateLine = new _LineMarker2.default(center, 0, -100, {
					dashArray: [10, 7],
					color: 'black',
					weight: 2
				});
				this._angle = 0;

				this._bindMarker(this._rotateLine);
				this._markerGroup.addLayer(this._rotateLine);
			}
		},
		getMovePoint: function getMovePoint() {
			return this._origCenter();
		},
		events: {
			move: function move(newPos) {
				var tx = new _AffineTransform.Transform(this._map, this.projectionMethods).move(this.getMovePoint(), newPos);
				this._shape.setLatLngs(tx.apply(this._origLatLngs));
				this._repositionAllMarkers();

				return tx;
			},
			resize: function resize(latlng) {
				var tx = new _AffineTransform.Transform(this._map, this.projectionMethods).resize(this._oppositeCorner, this._currentCorner, latlng);
				this._shape.setLatLngs(tx.apply(this._origLatLngs));
				this._repositionAllMarkers();

				return tx;
			},
			rotate: function rotate(latlng) {
				var tx = new _AffineTransform.Transform(this._map, this.projectionMethods).rotateFrom(this._origAngle - Math.PI / 2, this._origCenter, latlng);
				this._angle = this._origAngle + tx.getAngle();
				this._shape.setLatLngs(tx.apply(this._origLatLngs));
				this._repositionAllMarkers();

				return tx;
			}
		}
	},

	_getCorners: function _getCorners() {
		var bounds = this._shape.getBounds(),
		    nw = bounds.getNorthWest(),
		    ne = bounds.getNorthEast(),
		    se = bounds.getSouthEast(),
		    sw = bounds.getSouthWest();

		return [nw, ne, se, sw];
	},

	_toggleCornerMarkers: function _toggleCornerMarkers(opacity) {
		if (!this._resizeMarkers) return;
		for (var i = 0, l = this._resizeMarkers.length; i < l; i++) {
			this._resizeMarkers[i].setOpacity(opacity);
		}
	},

	_repositionAllMarkers: function _repositionAllMarkers() {
		var corners = this._getCorners();

		if (this._resizeMarkers) {
			for (var i = 0, l = this._resizeMarkers.length; i < l; i++) {
				this._resizeMarkers[i].setLatLng(corners[i]);
			}
		}

		if (this._moveMarker) {
			this._moveMarker.setLatLng(this._getCenter());
		}

		if (this._rotateMarker) {
			var dx = 100 * Math.sin(this._angle),
			    dy = -100 * Math.cos(this._angle);

			this._rotateMarker.setLatLng(this._getCenter());
			this._rotateMarker.setOffset(dx, dy);

			this._rotateLine.setLatLng(this._getCenter());
			this._rotateLine.setMoveTo(dx, dy);
		}
	},

	_getCenter: function _getCenter() {
		var center = _leaflet2.default.point(0, 0);
		var pts = this._pre(this._shape.getLatLngs());
		for (var i = 0; i < pts.length; i++) {
			center._add(pts[i]);
		}
		return this._post(center._divideBy(pts.length));
	}
});

exports.default = Path;