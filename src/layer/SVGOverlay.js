import L from 'leaflet';

export default L.Class.extend({
	includes: L.Mixin.Events,

	options: {
		opacity: 1
	},

	initialize: function (url, bounds, options) { // (String, LatLngBounds, Object)
		this._url = url;
		this._bounds = L.latLngBounds(bounds);

		L.setOptions(this, options);
	},

	onAdd: function (map) {
		this._map = map;

		if (!this._el) {
			this._initImage();
		}

		map._panes.overlayPane.appendChild(this._el);

		map.on('viewreset', this._reset, this);

		if (map.options.zoomAnimation && L.Browser.any3d) {
			map.on('zoomanim', this._animateZoom, this);
		}

		this._reset();
	},

	onRemove: function (map) {
		map.getPanes().overlayPane.removeChild(this._el);

		map.off('viewreset', this._reset, this);

		if (map.options.zoomAnimation) {
			map.off('zoomanim', this._animateZoom, this);
		}
	},

	addTo: function (map) {
		map.addLayer(this);
		return this;
	},

	setOpacity: function (opacity) {
		this.options.opacity = opacity;
		this._updateOpacity();
		return this;
	},

	// TODO remove bringToFront/bringToBack duplication from TileLayer/Path
	bringToFront: function () {
		if (this._el) {
			this._map._panes.overlayPane.appendChild(this._el);
		}
		return this;
	},

	bringToBack: function () {
		var pane = this._map._panes.overlayPane;
		if (this._el) {
			pane.insertBefore(this._el, pane.firstChild);
		}
		return this;
	},

	setUrl: function (url) {
		this._url = url;
		this._el.src = this._url;
	},

	getAttribution: function () {
		return this.options.attribution;
	},

	_initImage: function () {
		this._el = L.DomUtil.create('iframe', 'leaflet-image-layer');
    this._el.frameBorder = "0";
    this._el.style.pointerEvents = "none";

		if (this._map.options.zoomAnimation && L.Browser.any3d) {
			L.DomUtil.addClass(this._el, 'leaflet-zoom-animated');
		} else {
			L.DomUtil.addClass(this._el, 'leaflet-zoom-hide');
		}

		this._updateOpacity();

		//TODO createImage util method to remove duplication
		L.extend(this._el, {
			galleryimg: 'no',
			onselectstart: L.Util.falseFn,
			onmousemove: L.Util.falseFn,
			onload: L.bind(this._onImageLoad, this),
			src: this._url
		});
	},

	_animateZoom: function (e) {
		var map = this._map,
		    image = this._el,
		    scale = map.getZoomScale(e.zoom),
		    nw = this._bounds.getNorthWest(),
		    se = this._bounds.getSouthEast(),

		    topLeft = map._latLngToNewLayerPoint(nw, e.zoom, e.center),
		    size = map._latLngToNewLayerPoint(se, e.zoom, e.center)._subtract(topLeft),
		    origin = topLeft._add(size._multiplyBy((1 / 2) * (1 - 1 / scale)));

		image.style[L.DomUtil.TRANSFORM] =
		        L.DomUtil.getTranslateString(origin) + ' scale(' + scale + ') ';
	},

  getOrigin: function() {
    return this._map.latLngToLayerPoint(this._bounds.getNorthWest());
  },

	_reset: function () {
		var image   = this._el,
		    topLeft = this._map.latLngToLayerPoint(this._bounds.getNorthWest()),
		    size = this._map.latLngToLayerPoint(this._bounds.getSouthEast())._subtract(topLeft);

		L.DomUtil.setPosition(image, topLeft);

		image.style.width  = size.x + 'px';
		image.style.height = size.y + 'px';
	},

	_onImageLoad: function () {
		this._el.contentWindow.document.children[0].style.width = '100%';
		this._el.contentWindow.document.children[0].style.height = '100%';
		this.fire('load');
	},

	addStyle: function(rule) {
		if(!this._style) {
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

	_updateOpacity: function () {
		L.DomUtil.setOpacity(this._el, this.options.opacity);
	}
});
