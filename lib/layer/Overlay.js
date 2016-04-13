'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _leaflet = require('leaflet');

var _leaflet2 = _interopRequireDefault(_leaflet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _leaflet2.default.Class.extend({
	includes: [_leaflet2.default.Mixin.Events],

	options: {
		opacity: 1
	},

	initialize: function initialize(polygon, options) {
		this._polygon = polygon;
		this._bounds = _leaflet2.default.latLngBounds(polygon.getBounds());
		_leaflet2.default.setOptions(this, options);
	},

	onAdd: function onAdd(map) {
		this._map = map;

		if (!this._el) {
			this._initRenderer();
		}

		map._panes.overlayPane.appendChild(this._el);

		map.on('viewreset', this._reset, this);

		if (map.options.zoomAnimation && _leaflet2.default.Browser.any3d) {
			map.on('zoomanim', this._animateZoom, this);
		}

		map.on('zoomend', this._zoomEnd, this);

		this._reset();
	},

	onRemove: function onRemove(map) {
		map.getPanes().overlayPane.removeChild(this._el);

		map.off('viewreset', this._reset, this);

		if (map.options.zoomAnimation) {
			map.off('zoomanim', this._animateZoom, this);
		}
	},

	addTo: function addTo(map) {
		map.addLayer(this);
		return this;
	},

	setOpacity: function setOpacity(opacity) {
		this.options.opacity = opacity;
		this._updateOpacity();
		return this;
	},

	bringToFront: function bringToFront() {
		if (this._el) {
			this._map._panes.overlayPane.appendChild(this._image);
		}
		return this;
	},

	bringToBack: function bringToBack() {
		var pane = this._map._panes.overlayPane;
		if (this._image) {
			pane.insertBefore(this._image, pane.firstChild);
		}
		return this;
	},

	_initRenderer: function _initRenderer() {
		this._renderer = this.options.renderer;
		this._renderer.load(this.options.url);

		this._pageNumber = 1;

		this._el = this._renderer.getElement();
		_leaflet2.default.DomUtil.addClass(this._el, 'leaflet-zoom-hide');

		this._updateOpacity();
	},

	applyTransform: function applyTransform(tx) {
		if (tx) {
			if (this._lastTx) {
				tx = this._lastTx.clone(tx).applyTransform(tx);
			}

			var transform = [tx.getCSSTranslateString(this._origLeft), tx.getCSSTransformString(true)].join(" ");
			this._el.style[_leaflet2.default.DomUtil.TRANSFORM] = transform;
			this._tx = tx;

			this._el._leaflet_pos = tx._applyPts(this._origLeft);
		} else {
			this._lastTx = this._tx;
		}
	},

	_animateZoom: function _animateZoom(e) {
		/*var map = this._map,
      el = this._el,
      scale = map.getZoomScale(e.zoom),
      nw = this._bounds.getNorthWest(),
      se = this._bounds.getSouthEast(),
  	    topLeft = map._latLngToNewLayerPoint(nw, e.zoom, e.center),
      size = map._latLngToNewLayerPoint(se, e.zoom, e.center)._subtract(topLeft),
      origin = topLeft._add(size._multiplyBy((1 / 2) * (1 - 1 / scale)));
  	el.style[L.DomUtil.TRANSFORM] =
          L.DomUtil.getTranslateString(origin) + ' scale(' + scale + ') ';*/

	},

	_undef: function _undef(a) {
		return typeof a == "undefined";
	},

	_zoomEnd: function _zoomEnd(e) {
		/*var newZoom = this._undef(ev.zoom) ? this._map._zoom : ev.zoom;
  this._zoomDiff = newZoom - this._zoom;
  	this._scale = Math.pow(2, this._zoomDiff);
  	var shift = this._map.latLngToLayerPoint(this._origLeft)
  	._subtract(this._origLeftPx.multiplyBy(this._scale));
  	console.log('zoom end!', newZoom, this._zoomDiff, this._scale, shift);*/

		//console.log('last zoom', this._lastZoom, 'current zoom', this._map.getZoom());
		//var scale = this._map.getZoomScale(this._lastZoom);
		//console.log('called zoom end!', scale);

		//this._lastZoom = this._map.getZoom();
	},

	_reset: function _reset() {
		var el = this._el,
		    topLeft = this._map.latLngToLayerPoint(this._polygon.getBounds().getNorthWest()),
		    size = this._map.latLngToLayerPoint(this._polygon.getBounds().getSouthEast())._subtract(topLeft);

		el.style.width = size.x + 'px';
		el.style.height = size.y + 'px';

		this._origLeft = topLeft;
		//this._origLeftPx =  this._map.latLngToLayerPoint(this._wgsOrigin);
		el.style.transformOrigin = '0 0 0';

		var tx = this._lastTx;

		if (tx) {
			var transform = [tx.getCSSTranslateString(this._origLeft), tx.getCSSTransformString(false)].join(" ");
			this._el.style[_leaflet2.default.DomUtil.TRANSFORM] = transform;
			this._el._leaflet_pos = tx._applyPts(this._origLeft);
			//  delete this._lastTx;
		} else {
				_leaflet2.default.DomUtil.setPosition(el, topLeft);
			}

		if (!this._zoom) this._zoom = this._map.getZoom();
		this._renderer.render(this._pageNumber, size);
	},

	_updateOpacity: function _updateOpacity() {
		_leaflet2.default.DomUtil.setOpacity(this._el, this.options.opacity);
	}
});