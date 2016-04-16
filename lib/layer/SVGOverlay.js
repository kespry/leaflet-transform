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

		if (!this._image) {
			this._initImage();
		}

		map._panes.overlayPane.appendChild(this._image);

		map.on('viewreset', this._reset, this);

		if (map.options.zoomAnimation && _leaflet2.default.Browser.any3d) {
			map.on('zoomanim', this._animateZoom, this);
		}

		this._reset();
	},

	onRemove: function onRemove(map) {
		map.getPanes().overlayPane.removeChild(this._image);

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
		if (this._image) {
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

	setUrl: function setUrl(url) {
		this._url = url;
		this._image.src = this._url;
	},

	getAttribution: function getAttribution() {
		return this.options.attribution;
	},

	_initImage: function _initImage() {
		this._image = _leaflet2.default.DomUtil.create('img', 'leaflet-image-layer');

		if (this._map.options.zoomAnimation && _leaflet2.default.Browser.any3d) {
			_leaflet2.default.DomUtil.addClass(this._image, 'leaflet-zoom-animated');
		} else {
			_leaflet2.default.DomUtil.addClass(this._image, 'leaflet-zoom-hide');
		}

		this._updateOpacity();

		//TODO createImage util method to remove duplication
		_leaflet2.default.extend(this._image, {
			galleryimg: 'no',
			onselectstart: _leaflet2.default.Util.falseFn,
			onmousemove: _leaflet2.default.Util.falseFn,
			onload: _leaflet2.default.bind(this._onImageLoad, this),
			src: this._url
		});
	},

	_animateZoom: function _animateZoom(e) {
		var map = this._map,
		    image = this._image,
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
		var image = this._image,
		    topLeft = this._map.latLngToLayerPoint(this._bounds.getNorthWest()),
		    size = this._map.latLngToLayerPoint(this._bounds.getSouthEast())._subtract(topLeft);

		_leaflet2.default.DomUtil.setPosition(image, topLeft);

		image.style.width = size.x + 'px';
		image.style.height = size.y + 'px';
	},

	_onImageLoad: function _onImageLoad() {
		this.fire('load');
	},

	_updateOpacity: function _updateOpacity() {
		_leaflet2.default.DomUtil.setOpacity(this._image, this.options.opacity);
	}
});