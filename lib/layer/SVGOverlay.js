'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _leaflet = require('leaflet');

var _leaflet2 = _interopRequireDefault(_leaflet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _leaflet2.default.Class.extend({
	includes: _leaflet2.default.Mixin.Events,

	options: {
		opacity: 1
	},

	initialize: function initialize(url, bounds, options) {
		// (String, LatLngBounds, Object)
		this._url = url;
		this._bounds = _leaflet2.default.latLngBounds(bounds);

		_leaflet2.default.setOptions(this, options);
	},

	onAdd: function onAdd(map) {
		this._map = map;

		if (!this._el) {
			this._initImage();
		}

		map._panes.overlayPane.appendChild(this._el);

		map.on('viewreset', this._reset, this);

		if (map.options.zoomAnimation && _leaflet2.default.Browser.any3d) {
			map.on('zoomanim', this._animateZoom, this);
		}

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

	// TODO remove bringToFront/bringToBack duplication from TileLayer/Path
	bringToFront: function bringToFront() {
		if (this._el) {
			this._map._panes.overlayPane.appendChild(this._el);
		}
		return this;
	},

	bringToBack: function bringToBack() {
		var pane = this._map._panes.overlayPane;
		if (this._el) {
			pane.insertBefore(this._el, pane.firstChild);
		}
		return this;
	},

	setUrl: function setUrl(url) {
		this._url = url;
		this._el.src = this._url;
	},

	getAttribution: function getAttribution() {
		return this.options.attribution;
	},

	_initImage: function _initImage() {
		this._el = _leaflet2.default.DomUtil.create('iframe', 'leaflet-image-layer');

		if (this._map.options.zoomAnimation && _leaflet2.default.Browser.any3d) {
			_leaflet2.default.DomUtil.addClass(this._el, 'leaflet-zoom-animated');
		} else {
			_leaflet2.default.DomUtil.addClass(this._el, 'leaflet-zoom-hide');
		}

		this._updateOpacity();

		//TODO createImage util method to remove duplication
		_leaflet2.default.extend(this._el, {
			galleryimg: 'no',
			onselectstart: _leaflet2.default.Util.falseFn,
			onmousemove: _leaflet2.default.Util.falseFn,
			onload: _leaflet2.default.bind(this._onImageLoad, this),
			src: this._url
		});
	},

	_animateZoom: function _animateZoom(e) {
		var map = this._map,
		    image = this._el,
		    scale = map.getZoomScale(e.zoom),
		    nw = this._bounds.getNorthWest(),
		    se = this._bounds.getSouthEast(),
		    topLeft = map._latLngToNewLayerPoint(nw, e.zoom, e.center),
		    size = map._latLngToNewLayerPoint(se, e.zoom, e.center)._subtract(topLeft),
		    origin = topLeft._add(size._multiplyBy(1 / 2 * (1 - 1 / scale)));

		image.style[_leaflet2.default.DomUtil.TRANSFORM] = _leaflet2.default.DomUtil.getTranslateString(origin) + ' scale(' + scale + ') ';
	},

	getOrigin: function getOrigin() {
		return this._map.latLngToLayerPoint(this._bounds.getNorthWest());
	},

	_reset: function _reset() {
		var image = this._el,
		    topLeft = this._map.latLngToLayerPoint(this._bounds.getNorthWest()),
		    size = this._map.latLngToLayerPoint(this._bounds.getSouthEast())._subtract(topLeft);

		_leaflet2.default.DomUtil.setPosition(image, topLeft);

		image.style.width = size.x + 'px';
		image.style.height = size.y + 'px';
	},

	_onImageLoad: function _onImageLoad() {
		this._el.contentWindow.document.children[0].style.width = '100%';
		this._el.contentWindow.document.children[0].style.height = '100%';
		this.fire('load');
	},

	addStyle: function addStyle(rule) {
		if (!this._style) {
			this._style = document.createElement('style');
			this._el.contentWindow.document.children[0].appendChild(this._style);
		} else {
			this._el.contentWindow.document.children[0].removeChild(this._style);
			delete this._style;
			this._style = document.createElement('style');
			this._el.contentWindow.document.children[0].appendChild(this._style);
		}

		this._styleIndex = this._styleIndex = 0;
		this._style.sheet.insertRule(rule, this._styleIndex);
		this._styleIndex++;
	},

	_updateOpacity: function _updateOpacity() {
		_leaflet2.default.DomUtil.setOpacity(this._el, this.options.opacity);
	}
});