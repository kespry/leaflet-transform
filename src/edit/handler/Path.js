import L from 'leaflet';
import SimpleShape from './SimpleShape';
import { Transform, SetProjections } from '../../ext/AffineTransform';
import LineMarker from  '../../ext/LineMarker';
import MoveProxy from './MoveProxy';

const Path = SimpleShape.extend({
	includes: [SetProjections],
	initialize: function() {
		this._setProjections(this.projectionMethods);
		SimpleShape.prototype.initialize.apply(this, arguments);

		this._shape.on("add", function() {
			this._initLatLngs = this._shape.getLatLngs();
		}.bind(this));
	},

	_onMarkerDragStart: function (e) {
		SimpleShape.prototype._onMarkerDragStart.call(this, e);

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

	_onMarkerDragEnd: function (e) {
		this._origCenter = this._getCenter();
		this._toggleCornerMarkers(1);
		this._repositionAllMarkers();

		SimpleShape.prototype._onMarkerDragEnd.call(this, e);
	},

	projectionMethods: {
		pre: "latLngToLayerPoint",
		post: "layerPointToLatLng"
	},

	getMovePoint: function() {
		if(!this._origCenter) {
			this._origCenter = this._getCenter();
		}

		return this._origCenter;
	},

	_updateTransformLayers: function() {},

	transforms: {
		ui: {
			move: function(options) {
				if(options && options.proxy) {
					this._moveMarker = MoveProxy.call(this, options);

					this.getMovePoint = function() {
						return this._origTopLeft;
					}.bind(this);
					this._bindMarker(this._moveMarker);
				} else {
					this._moveMarker = this._createMarker(this._getCenter(), this.options.moveIcon);
				}
			},
			resize: function() {
				var corners = this._getCorners();

				this._resizeMarkers = [];

				for (var i = 0, l = corners.length; i < l; i++) {
					this._resizeMarkers.push(this._createMarker(corners[i], this.options.resizeIcon));
					this._resizeMarkers[i]._cornerIndex = i;
				}
			},
			rotate: function() {
				var center = this._getCenter();

				this._rotateMarker = this._createMarker(center, this.options.rotateIcon, 0, -100);
				this._rotateLine = new LineMarker(center, 0, -100, {
					dashArray: [10, 7],
					color: 'black',
					weight: 2
				});
				this._angle = 0;

				this._bindMarker(this._rotateLine);
				this._markerGroup.addLayer(this._rotateLine);
			}
		},
		events: {
			move: function (newPos) {
				var tx = new Transform(this._map, this.projectionMethods).move(this.getMovePoint(), newPos);
				this._shape.setLatLngs(tx.apply(this._origLatLngs));
				this._repositionAllMarkers();

				this._updateTransformLayers(tx);

				return tx;
			},
			resize: function(latlng) {
				var tx = new Transform(this._map, this.projectionMethods).resize(this._oppositeCorner, this._currentCorner, latlng);
				this._shape.setLatLngs(tx.apply(this._origLatLngs));
				delete this._origCenter;
				this._repositionAllMarkers();

				this._updateTransformLayers(tx);

				return tx;
			},
			rotate: function(latlng) {
				var tx = new Transform(this._map, this.projectionMethods).rotateFrom(this._origAngle - Math.PI/2, this._origCenter, latlng);
				this._angle = this._origAngle + tx.getAngle();
				this._shape.setLatLngs(tx.apply(this._origLatLngs));
				this._repositionAllMarkers();

				this._updateTransformLayers(tx);

				return tx;
			},
		}
	},

	_getCorners: function () {
		var bounds = this._shape.getBounds(),
			nw = bounds.getNorthWest(),
			ne = bounds.getNorthEast(),
			se = bounds.getSouthEast(),
			sw = bounds.getSouthWest();

		return [nw, ne, se, sw];
	},

	_toggleCornerMarkers: function (opacity) {
		if (!this._resizeMarkers) return;
		for (var i = 0, l = this._resizeMarkers.length; i < l; i++) {
			this._resizeMarkers[i].setOpacity(opacity);
		}
	},

	_repositionMoveMarker: function() {
		if(this._moveMarker) {
			this._moveMarker.setLatLng(this._getCenter());
		}
	},

	_repositionAllMarkers: function () {
		var corners = this._getCorners();

		if(this._resizeMarkers) {
			for (var i = 0, l = this._resizeMarkers.length; i < l; i++) {
				this._resizeMarkers[i].setLatLng(corners[i]);
			}
		}

		if(this._moveMarker) {
			this._moveMarker.setLatLng(this.getMovePoint());
		}

		if(this._rotateMarker) {
			var dx = 100 * Math.sin(this._angle), dy = -100 * Math.cos(this._angle);

			this._rotateMarker.setLatLng(this._getCenter());
			this._rotateMarker.setOffset(dx, dy);

			this._rotateLine.setLatLng(this._getCenter());
			this._rotateLine.setMoveTo(dx, dy);
		}
	},

	_getCenter : function() {
		var center = L.point(0,0);
		var pts = this._pre(this._shape.getLatLngs());
		for (var i = 0; i < pts.length; i++) {
			center._add(pts[i]);
		}
		return this._post(center._divideBy(pts.length));
	}
});

export default Path;
