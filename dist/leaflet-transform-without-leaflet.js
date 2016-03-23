(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _leaflet = (window.L);

var _leaflet2 = _interopRequireDefault(_leaflet);

var _TransformPolygonWithImageOverlay = require('./feature/TransformPolygonWithImageOverlay');

var _TransformPolygonWithImageOverlay2 = _interopRequireDefault(_TransformPolygonWithImageOverlay);

var _TransformImageOverlay = require('./feature/TransformImageOverlay');

var _TransformImageOverlay2 = _interopRequireDefault(_TransformImageOverlay);

var _TransformPolygonWithMarkers = require('./feature/TransformPolygonWithMarkers');

var _TransformPolygonWithMarkers2 = _interopRequireDefault(_TransformPolygonWithMarkers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_leaflet2.default.TransformPolygonWithImageOverlay = _TransformPolygonWithImageOverlay2.default;
_leaflet2.default.TransformImageOverlay = _TransformImageOverlay2.default;
_leaflet2.default.TransformPolygonWithMarkers = _TransformPolygonWithMarkers2.default;

window.L = _leaflet2.default;

},{"./feature/TransformImageOverlay":14,"./feature/TransformPolygonWithImageOverlay":15,"./feature/TransformPolygonWithMarkers":16}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _leaflet = (window.L);

var _leaflet2 = _interopRequireDefault(_leaflet);

var _PolyGroup = require('../../edit/handler/PolyGroup');

var _PolyGroup2 = _interopRequireDefault(_PolyGroup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DoubleBorderPolygon = _leaflet2.default.Polygon.extend({
  _initPath: function _initPath() {
    this._container = this._createElement("g");
    this._primaryPath = this._path = this._createElement("path");
    this._secondaryPath = this._createElement("path");

    if (this.options.className) {
      _leaflet2.default.DomUtil.addClass(this._path, this.options.className);
      _leaflet2.default.DomUtil.addClass(this._secondaryPath, this.options.className);
    }

    this._container.appendChild(this._secondaryPath);
    this._container.appendChild(this._primaryPath);
  }
});

var reserved = "____";
function drawDoublePath(method) {
  return function () {
    // Backup old values.
    var options = this.options;
    var path = this._path;

    // Primary path.
    this._path = this._primaryPath;
    this.options = (0, _assign2.default)({}, options, this.options.primary);
    DoubleBorderPolygon.prototype[reserved + method].apply(this, arguments);

    // Secondary path.
    this._path = this._secondaryPath;
    this.options = (0, _assign2.default)({}, options, this.options.secondary);
    DoubleBorderPolygon.prototype[reserved + method].apply(this, arguments);

    // Restore old values.
    this._path = path;
    this.options = options;
  };
}

["_initStyle", "_updateStyle", "_updatePath"].forEach(function (method) {
  DoubleBorderPolygon.prototype[reserved + method] = DoubleBorderPolygon.prototype[method];
  DoubleBorderPolygon.prototype[method] = drawDoublePath(method);
});

DoubleBorderPolygon.addInitHook(function () {
  this.editing = new _PolyGroup2.default(this);

  if (this.options.editable) {
    this.editing.enable();
  }
});

exports.default = DoubleBorderPolygon;

},{"../../edit/handler/PolyGroup":6,"babel-runtime/core-js/object/assign":undefined}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _leaflet = (window.L);

var _leaflet2 = _interopRequireDefault(_leaflet);

var _SimplePolyGroup = require('../../edit/handler/SimplePolyGroup');

var _SimplePolyGroup2 = _interopRequireDefault(_SimplePolyGroup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HiddenPath = _leaflet2.default.Polygon.extend({
  options: {
    opacity: 0,
    fillOpacity: 0
  }
});

HiddenPath.addInitHook(function () {
  this.editing = new _SimplePolyGroup2.default(this);

  if (this.options.editable) {
    this.editing.enable();
  }
});

exports.default = HiddenPath;

},{"../../edit/handler/SimplePolyGroup":7}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _leaflet = (window.L);

var _leaflet2 = _interopRequireDefault(_leaflet);

var _SimpleShape = require('./SimpleShape');

var _SimpleShape2 = _interopRequireDefault(_SimpleShape);

var _AffineTransform = require('../../ext/AffineTransform');

var _LineMarker = require('../../ext/LineMarker');

var _LineMarker2 = _interopRequireDefault(_LineMarker);

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

	_createMoveMarker: function _createMoveMarker() {
		this._moveMarker = this._createMarker(this._getCenter(), this.options.moveIcon);
	},

	_createResizeMarker: function _createResizeMarker() {
		var corners = this._getCorners();

		this._resizeMarkers = [];

		for (var i = 0, l = corners.length; i < l; i++) {
			this._resizeMarkers.push(this._createMarker(corners[i], this.options.resizeIcon));
			this._resizeMarkers[i]._cornerIndex = i;
		}
	},

	_createRotateMarker: function _createRotateMarker() {
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
	},

	_onMarkerDragStart: function _onMarkerDragStart(e) {
		_SimpleShape2.default.prototype._onMarkerDragStart.call(this, e);

		this._origLatLngs = this._shape.getLatLngs();
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

	_move: function _move(newCenter) {
		var tx = new _AffineTransform.Transform(this._map, this.projectionMethods).move(this._origCenter, newCenter);
		this._shape.setLatLngs(tx.apply(this._origLatLngs));
		this._repositionAllMarkers();

		return tx;
	},

	_resize: function _resize(latlng) {
		var tx = new _AffineTransform.Transform(this._map, this.projectionMethods).resize(this._oppositeCorner, this._currentCorner, latlng);
		this._shape.setLatLngs(tx.apply(this._origLatLngs));
		this._repositionAllMarkers();

		return tx;
	},

	_rotate: function _rotate(latlng) {
		var tx = new _AffineTransform.Transform(this._map, this.projectionMethods).rotateFrom(this._origAngle - Math.PI / 2, this._origCenter, latlng);
		this._angle = this._origAngle + tx.getAngle();
		this._shape.setLatLngs(tx.apply(this._origLatLngs));
		this._repositionAllMarkers();

		return tx;
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

},{"../../ext/AffineTransform":10,"../../ext/LineMarker":11,"./SimpleShape":8}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _leaflet = (window.L);

var _leaflet2 = _interopRequireDefault(_leaflet);

var _Path = require('./Path');

var _Path2 = _interopRequireDefault(_Path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Poly = _Path2.default.extend({
	_initMarkers: function _initMarkers() {
		_Path2.default.prototype._initMarkers.call(this);
		this._createEdgeMarkers();
	},

	_createEdgeMarkers: function _createEdgeMarkers() {
		this._markers = [];

		var latlngs = this._shape._latlngs,
		    i,
		    j,
		    len,
		    marker;

		// TODO refactor holes implementation in Polygon to support it here

		for (i = 0, len = latlngs.length; i < len; i++) {

			marker = this._createEdgeMarker(latlngs[i], i);
			marker.on('click', this._onMarkerClick, this);
			this._markers.push(marker);
		}

		var markerLeft, markerRight;

		for (i = 0, j = len - 1; i < len; j = i++) {
			if (i === 0 && !(_leaflet2.default.Polygon && this._shape instanceof _leaflet2.default.Polygon)) {
				continue;
			}

			markerLeft = this._markers[j];
			markerRight = this._markers[i];

			this._createMiddleMarker(markerLeft, markerRight);
			this._updatePrevNext(markerLeft, markerRight);
		}
	},

	_createEdgeMarker: function _createEdgeMarker(latlng, index) {
		var marker = new _leaflet2.default.Marker(latlng, {
			draggable: true,
			icon: this.options.edgeIcon
		});

		marker._origLatLng = latlng;
		marker._index = index;

		marker.on('drag', this._onEdgeMarkerDrag, this);
		marker.on('dragend', this._fireEdit, this);

		this._markerGroup.addLayer(marker);

		return marker;
	},

	_removeMarker: function _removeMarker(marker) {
		var i = marker._index;

		this._markerGroup.removeLayer(marker);
		this._markers.splice(i, 1);
		this._shape.spliceLatLngs(i, 1);
		this._updateIndexes(i, -1);
		this._repositionAllMarkers();

		marker.off('drag', this._onEdgeMarkerDrag, this).off('dragend', this._fireEdit, this).off('click', this._onMarkerClick, this);
	},

	_onEdgeMarkerDrag: function _onEdgeMarkerDrag(e) {
		var marker = e.target;

		_leaflet2.default.extend(marker._origLatLng, marker._latlng);

		if (marker._middleLeft) {
			marker._middleLeft.setLatLng(this._getMiddleLatLng(marker._prev, marker));
		}
		if (marker._middleRight) {
			marker._middleRight.setLatLng(this._getMiddleLatLng(marker, marker._next));
		}
		this._shape.getLatLngs()[marker._index] = marker._latlng;
		this._shape.redraw();
		this._repositionAllMarkers();
	},

	_onMarkerClick: function _onMarkerClick(e) {
		var minPoints = _leaflet2.default.Polygon && this._shape instanceof _leaflet2.default.Polygon ? 4 : 3,
		    marker = e.target;

		// If removing this point would create an invalid polyline/polygon don't remove
		if (this._shape._latlngs.length < minPoints) {
			return;
		}

		// remove the marker
		this._removeMarker(marker);

		// update prev/next links of adjacent markers
		this._updatePrevNext(marker._prev, marker._next);

		// remove ghost markers near the removed marker
		if (marker._middleLeft) {
			this._markerGroup.removeLayer(marker._middleLeft);
		}
		if (marker._middleRight) {
			this._markerGroup.removeLayer(marker._middleRight);
		}

		// create a ghost marker in place of the removed one
		if (marker._prev && marker._next) {
			this._createMiddleMarker(marker._prev, marker._next);
		} else if (!marker._prev) {
			marker._next._middleLeft = null;
		} else if (!marker._next) {
			marker._prev._middleRight = null;
		}

		this._fireEdit();
	},

	_updateIndexes: function _updateIndexes(index, delta) {
		this._markerGroup.eachLayer(function (marker) {
			if (marker._index > index) {
				marker._index += delta;
			}
		});
	},

	_createMiddleMarker: function _createMiddleMarker(marker1, marker2) {
		var latlng = this._getMiddleLatLng(marker1, marker2),
		    marker = this._createEdgeMarker(latlng),
		    onClick,
		    onDragStart,
		    _onDragEnd;

		marker.setOpacity(0.6);

		marker1._middleRight = marker2._middleLeft = marker;

		onDragStart = function onDragStart() {
			var i = marker2._index;

			marker._index = i;

			marker.off('click', onClick, this).on('click', this._onMarkerClick, this);

			latlng.lat = marker.getLatLng().lat;
			latlng.lng = marker.getLatLng().lng;
			this._shape.spliceLatLngs(i, 0, latlng);
			this._markers.splice(i, 0, marker);

			marker.setOpacity(1);

			this._updateIndexes(i, 1);
			marker2._index++;
			this._updatePrevNext(marker1, marker);
			this._updatePrevNext(marker, marker2);

			this._shape.fire('editstart');
		};

		_onDragEnd = function onDragEnd() {
			marker.off('dragstart', onDragStart, this);
			marker.off('dragend', _onDragEnd, this);

			this._createMiddleMarker(marker1, marker);
			this._createMiddleMarker(marker, marker2);
		};

		onClick = function onClick() {
			onDragStart.call(this);
			_onDragEnd.call(this);
			this._fireEdit();
		};

		marker.on('click', onClick, this).on('dragstart', onDragStart, this).on('dragend', _onDragEnd, this);

		this._markerGroup.addLayer(marker);
	},

	_updatePrevNext: function _updatePrevNext(marker1, marker2) {
		if (marker1) {
			marker1._next = marker2;
		}
		if (marker2) {
			marker2._prev = marker1;
		}
	},

	_getMiddleLatLng: function _getMiddleLatLng(marker1, marker2) {
		var map = this._shape._map,
		    p1 = map.project(marker1.getLatLng()),
		    p2 = map.project(marker2.getLatLng());

		return map.unproject(p1._add(p2)._divideBy(2));
	},

	_repositionAllMarkers: function _repositionAllMarkers() {
		_Path2.default.prototype._repositionAllMarkers.call(this);

		// reposition edge markers
		for (var i = 0; i < this._markers.length; i++) {
			var i1 = i,
			    i2 = (i + 1) % this._markers.length;
			var marker1 = this._markers[i1];
			var marker2 = this._markers[i2];
			marker1.setLatLng(this._shape._latlngs[i1]);
			marker2.setLatLng(this._shape._latlngs[i2]);
			if (marker1._middleRight) {
				marker1._middleRight.setLatLng(this._getMiddleLatLng(marker1, marker2));
			}
		}
	}

});

_leaflet2.default.Polyline.addInitHook(function () {
	this.editing = new Poly(this);

	if (this.options.editable) {
		this.editing.enable();
	}

	this.on('add', function () {
		if (this.editing && this.editing.enabled()) {
			this.editing.addHooks();
		}
	});

	this.on('remove', function () {
		if (this.editing && this.editing.enabled()) {
			this.editing.removeHooks();
		}
	});
});

exports.default = Poly;

},{"./Path":4}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _leaflet = (window.L);

var _leaflet2 = _interopRequireDefault(_leaflet);

var _Poly = require('./Poly');

var _Poly2 = _interopRequireDefault(_Poly);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PolyGroup = _Poly2.default.extend({
  includes: [_leaflet2.default.Mixin.Events],

  _onMarkerDragEnd: function _onMarkerDragEnd(e) {
    _Poly2.default.prototype._onMarkerDragEnd.call(this, e);
    this._updateTransformLayers();
  },

  _updateTransformLayers: function _updateTransformLayers(tx) {
    for (var i = 0; i < this._shape._transformLayers.length; i++) {
      var layer = this._shape._transformLayers[i];
      layer.applyTransform(tx);
    }
  }
});

["_move", "_resize", "_rotate"].forEach(function (mouseEvent) {
  PolyGroup.prototype[mouseEvent] = function (pt) {
    var tx = _Poly2.default.prototype[mouseEvent].apply(this, arguments);
    this._updateTransformLayers(tx);
  };
});

_leaflet2.default.Polygon.include({
  addTransformLayer: function addTransformLayer(layer) {
    this._transformLayers.push(layer);
  }
});

_leaflet2.default.Polygon.addInitHook(function () {
  this._transformLayers = [];
});

exports.default = PolyGroup;

},{"./Poly":5}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _leaflet = (window.L);

var _leaflet2 = _interopRequireDefault(_leaflet);

var _Path = require('./Path');

var _Path2 = _interopRequireDefault(_Path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SimplePolyGroup = _Path2.default.extend({
  includes: [_leaflet2.default.Mixin.Events],

  _onMarkerDragEnd: function _onMarkerDragEnd(e) {
    _Path2.default.prototype._onMarkerDragEnd.call(this, e);
    this._updateTransformLayers();

    var current = this._boundsPoint(this._shape.getLatLngs());
    var orig = this._boundsPoint(this._initLatLngs);
    this.fire("done", {
      offset: _leaflet2.default.latLng(current.lat - orig.lat, current.lng - orig.lng),
      current: this._boundsPoint(this._shape.getLatLngs()),
      tx: this._tx
    });
  },

  _boundsPoint: function _boundsPoint(latLngs) {
    return _leaflet2.default.latLngBounds(latLngs).getNorthWest();
  },

  _updateTransformLayers: function _updateTransformLayers(tx) {
    for (var i = 0; i < this._shape._transformLayers.length; i++) {
      var layer = this._shape._transformLayers[i];
      layer.applyTransform(tx);
    }
  }
});

["_move", "_resize", "_rotate"].forEach(function (mouseEvent) {
  SimplePolyGroup.prototype[mouseEvent] = function (pt) {
    this._tx = _Path2.default.prototype[mouseEvent].apply(this, arguments);
    this._updateTransformLayers(this._tx);
  };
});

_leaflet2.default.Polygon.include({
  addTransformLayer: function addTransformLayer(layer) {
    this._transformLayers.push(layer);
  }
});

_leaflet2.default.Polygon.addInitHook(function () {
  this._transformLayers = [];
});

exports.default = SimplePolyGroup;

},{"./Path":4}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _leaflet = (window.L);

var _leaflet2 = _interopRequireDefault(_leaflet);

var _MarkerExt = require('../../ext/MarkerExt');

var _MarkerExt2 = _interopRequireDefault(_MarkerExt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SimpleShape = _leaflet2.default.Handler.extend({
	options: {
		moveIcon: new _leaflet2.default.DivIcon({
			iconSize: new _leaflet2.default.Point(8, 8),
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
			transform = transform.toLowerCase();
			this['_create' + transform.charAt(0).toUpperCase() + transform.slice(1) + 'Marker']();
		}.bind(this));
	},

	_createRotateMarker: function _createRotateMarker() {
		// Children override
	},

	_createMoveMarker: function _createMoveMarker() {
		// Children override
	},

	_createResizeMarker: function _createResizeMarker() {
		// Children override
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
			this._move(latlng);
		} else if (marker === this._rotateMarker) {
			this._rotate(latlng);
		} else {
			this._resize(latlng);
		}
		this._shape.redraw();
	},

	_onMarkerDragEnd: function _onMarkerDragEnd(e) {
		var marker = e.target;
		marker.setOpacity(1);

		this._fireEdit();
	},

	_move: function _move() {
		// Children override
	},

	_resize: function _resize() {
		// Children override
	},

	_rotate: function _rotate() {
		// Children override
	}
});

exports.default = SimpleShape;

},{"../../ext/MarkerExt":12}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _leaflet = (window.L);

var _leaflet2 = _interopRequireDefault(_leaflet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _leaflet2.default.ImageOverlay.extend({
  initialize: function initialize(polygon, options) {
    this._url = options.url;
    this._bounds = polygon.getBounds();
    _leaflet2.default.setOptions(this, options);
    this._polygon = polygon;
  },
  applyTransform: function applyTransform(tx) {
    if (tx) {
      if (this._lastTx) {
        tx = this._lastTx.clone(tx).applyTransform(tx);
      }

      var transform = [tx.getCSSTranslateString(this._origLeft), tx.getCSSTransformString(true)].join(" ");
      this._image.style[_leaflet2.default.DomUtil.TRANSFORM] = transform;
      this._tx = tx;
    } else {
      this._lastTx = this._tx;
    }
  },
  _animateZoom: function _animateZoom() {
    this._bounds = this._polygon.getBounds();
    _leaflet2.default.ImageOverlay.prototype._animateZoom.apply(this, arguments);
  },
  _reset: function _reset() {
    var image = this._image,
        topLeft = this._map.latLngToLayerPoint(this._polygon.getBounds().getNorthWest()),
        size = this._map.latLngToLayerPoint(this._polygon.getBounds().getSouthEast())._subtract(topLeft);

    this._origLeft = topLeft;
    image.style.width = size.x + 'px';
    image.style.height = size.y + 'px';
    image.style.transformOrigin = '0 0 0';

    _leaflet2.default.DomUtil.setPosition(image, topLeft);
  }
});

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Transform = exports.SetProjections = undefined;

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _leaflet = (window.L);

var _leaflet2 = _interopRequireDefault(_leaflet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var floating = '(\\-?[\\d\\.e]+)',
    commaSpace = '\\,?\\s*',
    cssMatrixRegex = new RegExp("matrix\\(" + new Array(5).fill(floating + commaSpace).join('') + floating + "\\)");

var identity = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
var SetProjections = {
    _setProjections: function _setProjections(methods) {
        var self = this;
        methods = methods || {};

        function convert(method) {
            return function (pt) {
                if (_leaflet2.default.Util.isArray(pt)) {
                    var result = [],
                        i,
                        length = pt.length;
                    for (i = 0; i < length; i++) {
                        result.push(self._map[method](pt[i]));
                    }
                    return result;
                } else {
                    return self._map[method](pt);
                }
            };
        }

        function emptyFn(x) {
            return x;
        }
        this._pre = methods.pre ? convert(methods.pre) : emptyFn;
        this._post = methods.post ? convert(methods.post) : emptyFn;
    }
};

function copy(o) {
    var output, v, key;
    output = Array.isArray(o) ? [] : {};
    for (key in o) {
        v = o[key];
        output[key] = (typeof v === 'undefined' ? 'undefined' : (0, _typeof3.default)(v)) === "object" ? copy(v) : v;
    }
    return output;
}

var Transform = _leaflet2.default.Class.extend({
    includes: [SetProjections],

    initialize: function initialize(map, options) {
        this._array = identity;
        this._angle = 0;
        this._map = map;
        this._options = options;
        this._setProjections(options);
    },

    toCSSMatrix: function toCSSMatrix(fromArray, pruneTranslation) {
        var fromArray = fromArray || this._array;

        return [fromArray[0][0] || identity[0][0], fromArray[1][0] || identity[1][0], fromArray[0][1] || identity[0][1], fromArray[1][1] || identity[1][1], pruneTranslation ? 0 : fromArray[0][2] || identity[0][2], pruneTranslation ? 0 : fromArray[1][2] || identity[1][2]];
    },

    _arrayFromCSSMatrix: function _arrayFromCSSMatrix(fromArray) {
        return [[fromArray[0] || identity[0][0], fromArray[2] || identity[0][1], fromArray[4] || identity[0][2]], [fromArray[1] || identity[1][0], fromArray[3] || identity[1][1], fromArray[5] || identity[1][2]], [identity[2][0], identity[2][1], identity[2][2]]];
    },

    _parseCSSMatrix: function _parseCSSMatrix(str) {
        var parsedCSSMatrix = cssMatrixRegex.exec(str);

        if (parsedCSSMatrix) {
            parsedCSSMatrix.shift();
            return this._arrayFromCSSMatrix(parsedCSSMatrix.map(function (item) {
                return parseFloat(item);
            }));
        } else {
            return identity;
        }
    },

    applyTransform: function applyTransform(tx) {
        this._array = this._multiply(tx._array, this._array);

        return this;
    },

    createFrom: function createFrom() {
        return new Transform(this._map, this._setProjections(this._options));
    },

    clone: function clone() {
        var tx = new Transform(this._map, this._setProjections(this._options));
        tx._array = copy(this._array);
        tx.angle = this._angle;

        return tx;
    },

    getCSSTranslateString: function getCSSTranslateString(point) {
        return _leaflet2.default.DomUtil.getTranslateString(this._applyPts(point));
    },

    getCSSTransformString: function getCSSTransformString(pruneTranslation, origin) {
        return "matrix(" + this.toCSSMatrix(this._array, pruneTranslation).join(',') + ")";
    },

    _applyCSSTransformString: function _applyCSSTransformString(transformString) {
        return this._multiply(this._parseCSSMatrix(transformString), this._array);
    },

    scale: function scale(sx, sy) {
        this._array = this._multiply([[sx, 0, 0], [0, sy, 0], [0, 0, 1]], this._array);
        return this;
    },

    translate: function translate(dx, dy) {
        this._array = this._multiply([[1, 0, dx], [0, 1, dy], [0, 0, 1]], this._array);
        return this;
    },

    rotate: function rotate(angle) {
        var cos = Math.cos(angle),
            sin = Math.sin(angle);
        this._array = this._multiply([[cos, -sin, 0], [sin, cos, 0], [0, 0, 1]], this._array);
        this._angle += angle;
        return this;
    },

    move: function move(pt1, pt2) {
        pt1 = this._pre(pt1);
        pt2 = this._pre(pt2);
        return this.translate(pt2.x - pt1.x, pt2.y - pt1.y);
    },

    rotateFrom: function rotateFrom(fromAngle, origin, pt) {
        var origin = this._pre(origin);
        pt = this._pre(pt);
        var angle = Math.atan2(pt.y - origin.y, pt.x - origin.x);
        return this.translate(-origin.x, -origin.y).rotate(angle - fromAngle).translate(origin.x, origin.y);
    },

    resize: function resize(origin, pt1, pt2) {
        var origin = this._pre(origin);

        pt1 = this._pre(pt1);
        pt2 = this._pre(pt2);

        // translate so the opposite corner becomes the new origin
        this.translate(-origin.x, -origin.y);

        // resizing by moving corner pt1 to pt2 is now a simple scale operation along x and y-axis
        var f = this._applyPts(pt1);
        var t = this._applyPts(pt2);
        var scaleX = t.x / f.x;
        var scaleY = t.y / f.y;

        // guard against zero-division or too small values
        if (!isFinite(scaleX) || Math.abs(scaleX) < 1E-7) {
            scaleX = 1;
        }
        if (!isFinite(scaleY) || Math.abs(scaleY) < 1E-7) {
            scaleY = 1;
        }

        return this.scale(scaleX, scaleY).translate(origin.x, origin.y);
    },

    getAngle: function getAngle() {
        return this._angle;
    },

    apply: function apply(pts) {
        return this._post(this._applyPts(this._pre(pts)));
    },

    _applyPts: function _applyPts(pts) {
        if (_leaflet2.default.Util.isArray(pts)) {
            var result = [],
                i,
                length = pts.length;
            for (i = 0; i < length; i++) {
                result.push(this._applyPts(pts[i]));
            }
            return result;
        } else {
            var xyz = this._applyXYZ([pts.x, pts.y, 1]);
            return _leaflet2.default.point(xyz[0], xyz[1]);
        }
    },

    _applyXYZ: function _applyXYZ(xyz) {
        var result = [],
            i,
            j;
        for (i = 0; i < 3; i++) {
            result[i] = 0;
            for (j = 0; j < 3; j++) {
                result[i] += this._array[i][j] * xyz[j];
            }
        }
        return result;
    },

    _multiply: function _multiply(m1, m2) {
        var result = [],
            i,
            j,
            k;
        for (i = 0; i < 3; i++) {
            result[i] = [];
            for (j = 0; j < 3; j++) {
                result[i][j] = 0;
                for (k = 0; k < 3; k++) {
                    result[i][j] += m1[i][k] * m2[k][j];
                }
            }
        }
        return result;
    }
});

exports.SetProjections = SetProjections;
exports.Transform = Transform;

},{"babel-runtime/helpers/typeof":undefined}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _leaflet = (window.L);

var _leaflet2 = _interopRequireDefault(_leaflet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _leaflet2.default.Polyline.extend({
    initialize: function initialize(latLng, dx, dy, options) {
        _leaflet2.default.Polyline.prototype.initialize.call(this, [latLng, latLng], options);
        this._dx = dx;
        this._dy = dy;
    },

    setLatLng: function setLatLng(latLng) {
        this.setLatLngs([latLng, latLng]);
        this.redraw();
    },

    setMoveTo: function setMoveTo(dx, dy) {
        this._dx = dx;
        this._dy = dy;
        this.redraw();
    },

    _simplifyPoints: function _simplifyPoints() {
        if (this._parts && this._parts.length != 0) {
            var pt1 = this._parts[0][0];
            // displace point 2
            var pt2 = _leaflet2.default.point(pt1.x + this._dx, pt1.y + this._dy);
            this._parts[0] = [pt1, pt2];
        }
        _leaflet2.default.Polyline.prototype._simplifyPoints.call(this);
    }
});

},{}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _leaflet = (window.L);

var _leaflet2 = _interopRequireDefault(_leaflet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _leaflet2.default.Marker.extend({
    options: {
        dx: 0,
        dy: 0
    },

    initialize: function initialize(latlng, options) {
        _leaflet2.default.Marker.prototype.initialize.call(this, latlng, options);
        this._dx = this.options.dx;
        this._dy = this.options.dy;
    },

    setOffset: function setOffset(dx, dy) {
        this._dx = dx;
        this._dy = dy;
        this.update();
    },

    _setPos: function _setPos(pos) {
        pos.x += this._dx;
        pos.y += this._dy;
        _leaflet2.default.Marker.prototype._setPos.call(this, pos);
    }
});

},{}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _leaflet = (window.L);

var _leaflet2 = _interopRequireDefault(_leaflet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _leaflet2.default.Marker.extend({
  options: {
    draggable: true
  },
  initialize: function initialize(latlng, options, group) {
    _leaflet2.default.Marker.prototype.initialize.apply(this, arguments);

    this._origLatLng = latlng;

    this.on("add", function () {
      if (group.editing.state) {
        this.dragging.enable();
      } else {
        this.dragging.disable();
      }
    });

    this.on("dragend", function () {
      this._origLatLng = this.getLatLng();
    });

    var marker = this;
    group.on("edit", function (event) {
      event.state ? marker.dragging.enable() : marker.dragging.disable();
    });
  },
  applyTransform: function applyTransform(tx) {
    if (tx) {
      this.setLatLng(tx.apply(this._origLatLng));
    } else {
      this._origLatLng = this.getLatLng();
    }
  }
});

},{}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _leaflet = (window.L);

var _leaflet2 = _interopRequireDefault(_leaflet);

var _ImageOverlay = require('../edit/layer/ImageOverlay');

var _ImageOverlay2 = _interopRequireDefault(_ImageOverlay);

var _HiddenPath = require('../draw/handler/HiddenPath');

var _HiddenPath2 = _interopRequireDefault(_HiddenPath);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _leaflet2.default.FeatureGroup.extend({
  initialize: function initialize(polygon, options) {
    this._layers = {};

    if (polygon) {
      this._polygon = new _HiddenPath2.default(polygon.coordinates[0].map(function (coord) {
        return _leaflet2.default.latLng(coord[1], coord[0]);
      }), options.polygon);

      this.addLayer(this._polygon);
    }

    this._imageOverlay = new _ImageOverlay2.default(this._polygon, options);
    this.addLayer(this._imageOverlay);

    this._polygon.addTransformLayer(this._imageOverlay);

    var group = this;
    this.editing = {
      enable: function enable() {
        group._polygon.editing.enable();
      },
      disable: function disable() {
        group._polygon.editing.disable();
      },
      on: group._polygon.editing.on.bind(group._polygon.editing),
      off: group._polygon.editing.off.bind(group._polygon.editing)
    };
  },

  setUrl: function setUrl(url) {
    this._imageOverlay.setUrl(url);
  }
});

},{"../draw/handler/HiddenPath":3,"../edit/layer/ImageOverlay":9}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _TransformPolygonWithMarkers = require('./TransformPolygonWithMarkers');

var _TransformPolygonWithMarkers2 = _interopRequireDefault(_TransformPolygonWithMarkers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _TransformPolygonWithMarkers2.default.extend({
  initialize: function initialize(polygon, markers, options) {
    _TransformPolygonWithMarkers2.default.prototype.initialize.apply(this, arguments);

    this._imageOverlay = new L.Edit.ImageOverlay(this._polygon, options.image);
    this.addLayer(this._imageOverlay);

    this._polygon.addTransformLayer(this._imageOverlay);
  }
});

},{"./TransformPolygonWithMarkers":16}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _leaflet = (window.L);

var _leaflet2 = _interopRequireDefault(_leaflet);

var _DoubleBorderPolygon = require('../draw/handler/DoubleBorderPolygon');

var _DoubleBorderPolygon2 = _interopRequireDefault(_DoubleBorderPolygon);

var _TransformMarker = require('../ext/TransformMarker');

var _TransformMarker2 = _interopRequireDefault(_TransformMarker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _leaflet2.default.FeatureGroup.extend({
  includes: [_leaflet2.default.Mixin.Events],
  initialize: function initialize(polygon, markers, options) {
    this.options = options;
    this._layers = {};

    if (polygon) {
      this._polygon = new _DoubleBorderPolygon2.default(polygon.coordinates[0].map(function (coord) {
        return _leaflet2.default.latLng(coord[1], coord[0]);
      }), this.options.polygon);

      this.addLayer(this._polygon);
    }

    var group = this;
    if (markers) {
      this._markers = _leaflet2.default.geoJson(markers, {
        pointToLayer: function pointToLayer(geojson, latlng) {
          var marker = new _TransformMarker2.default(latlng, group.options.markers, group);
          group._polygon.addTransformLayer(marker);

          marker.on('dragend', group.onDoneEditing.bind(group));

          return marker;
        }
      });

      this.addLayer(this._markers);
    }

    this._polygon.on('edit', group.onDoneEditing.bind(group));

    this.editing = {
      state: false,
      enable: function enable() {
        group.editing.state = true;
        group._polygon.editing.enable();
        group.fire("edit", { state: true });
      },
      disable: function disable() {
        group.editing.state = false;
        group._polygon.editing.disable();
        group.fire("edit", { state: false });
      },
      on: group.on.bind(group),
      off: group.off.bind(group)
    };
  },
  onDoneEditing: function onDoneEditing() {
    var changes = {};
    if (this._polygon) changes.polygon = this._polygon.toGeoJSON().geometry;
    if (this._markers) changes.markers = this._markers.toGeoJSON().features.pop().geometry;

    this.fire('done', changes);
  },

  onAdd: function onAdd() {
    _leaflet2.default.FeatureGroup.prototype.onAdd.apply(this, arguments);
    this.fire("add");
  }
});

},{"../draw/handler/DoubleBorderPolygon":2,"../ext/TransformMarker":13}]},{},[1]);
