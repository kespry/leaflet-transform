import L from 'leaflet';

export default L.Class.extend({
	includes: [L.Mixin.Events],

	options: {
		opacity: 1
	},

	initialize: function (polygon, options) {
    this._polygon = polygon;
		this._bounds = L.latLngBounds(polygon.getBounds());
		L.setOptions(this, options);
	},

	onAdd: function (map) {
		this._map = map;

		if (!this._el) {
			this._initRenderer();
		}

		map._panes.overlayPane.appendChild(this._el);

		map.on('viewreset', this._reset, this);

		if (map.options.zoomAnimation && L.Browser.any3d) {
			map.on('zoomanim', this._animateZoom, this);
		}

		map.on('zoomend', this._zoomEnd, this);

		this._pixelOrigin = this._map.getPixelOrigin();
  	this._wgsOrigin = L.latLng([0, 0]);
    this._wgsInitialShift = this._map.latLngToLayerPoint(this._wgsOrigin);
    this._zoom = this._map.getZoom();
		this._zoom2 = this._map.getZoom();
    this._shift = L.point(0, 0);
    this._scale = 1;

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

	bringToFront: function () {
		if (this._el) {
			this._map._panes.overlayPane.appendChild(this._image);
		}
		return this;
	},

	bringToBack: function () {
		var pane = this._map._panes.overlayPane;
		if (this._image) {
			pane.insertBefore(this._image, pane.firstChild);
		}
		return this;
	},

	_initRenderer: function() {
		this._renderer = this.options.renderer;
    this._renderer.load(this.options.url);

    this._pageNumber = 1;

    this._el = this._renderer.getElement();
    L.DomUtil.addClass(this._el, 'leaflet-zoom-hide');

		this._updateOpacity();
	},

  applyTransform: function(tx) {
    if(tx) {
      if(this._lastTx) {
				//	tx.translate(this._shift.x, this._shift.y);
				if(this.hasZoomed) {
					console.log('has zoomed!!');
        	tx = this._lastTx.clone().translate(this._shift.x, this._shift.y).applyTransform(tx);
				} else {
					tx = this._lastTx.clone().applyTransform(tx);
				}
      }

      var transform =
        [tx.getCSSTranslateString(this._origLeft), tx.getCSSTransformString(true)].join(" ");
          this._el.style[L.DomUtil.TRANSFORM] = transform;
        this._tx = tx;

        this._el._leaflet_pos = tx._applyPts(this._origLeft);
    } else {
			if(this.hasZoomed) {
				console.log('translating back...');
				//this._lastTx.translate(-this._shift.x, -this._shift.y);
			}
			this.hasZoomed = false;
      this._lastTx = this._tx;
    }
  },

	_animateZoom: function (e) {
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

	  _undef: function(a){ return typeof a == "undefined" },

	_zoomEnd: function(evt) {
		var newZoom = this._undef(evt.zoom) ? this._map._zoom : evt.zoom; // "viewreset" event in Leaflet has not zoom/center parameters like zoomanim
    this._zoomDiff = newZoom - this._zoom;
    this._scale = Math.pow(2, this._zoomDiff);

		this._zoom = newZoom;

		//
		var newZoom2 = this._undef(evt.zoom) ? this._map._zoom : evt.zoom; // "viewreset" event in Leaflet has not zoom/center parameters like zoomanim
		this._zoomDiff2 = newZoom2 - this._zoom2;
		this._scale2 = Math.pow(2, this._zoomDiff2);





		//

		console.log(this._scale);
		console.log('origin!!!!', this._wgsOrigin);
		this._shift = this._map.latLngToLayerPoint(this._wgsOrigin)
				 ._subtract(this._wgsInitialShift.multiplyBy(this._scale2));

				 console.log('shift!!', this._shift);


		var topLeft = this._map.latLngToLayerPoint(this._polygon.getBounds().getNorthWest());

		console.log('orig', this._origLeft, 'new', topLeft);
		this.hasZoomed = true;
		if(this._lastTx) {
			this._lastTx.scale(this._scale, this._scale);
			//this._lastTx.translate(this._origLeft.x - topLeft.x, this._origLeft.y - topLeft.y);
			var tx = this._lastTx.clone();
			//tx.translate(100, 100);
			var currentOrigin = this._map.latLngToLayerPoint(this._map.getBounds().getNorthWest());
			console.log('orig', this._origOrigin);
			console.log('current', currentOrigin);
			tx.translate(this._shift.x, this._shift.y);
			//this._el.style.transformOrigin = this.

			var transform =
				[tx.getCSSTranslateString(this._origLeft), tx.getCSSTransformString(true)].join(" ");
					this._el.style[L.DomUtil.TRANSFORM] = transform;
				//this._tx = tx;

				this._el._leaflet_pos = tx._applyPts(topLeft);
				//this._origLeft = topLeft;
			}
	},

	_reset: function () {
		var el   = this._el,
		    topLeft = this._map.latLngToLayerPoint(this._polygon.getBounds().getNorthWest()),
		    size = this._map.latLngToLayerPoint(this._polygon.getBounds().getSouthEast())._subtract(topLeft);

		console.log('reset called!', topLeft);





		if(this._lastTx) {

		} else {
				this._origOrigin = this._map.latLngToLayerPoint(this._map.getBounds().getNorthWest());
				this._origLeft = topLeft;
				el.style.transformOrigin = '0 0 0';
			L.DomUtil.setPosition(el, topLeft);
			el.style.width  = size.x + 'px';
			el.style.height = size.y + 'px';
		}




		this._renderer.render(this._pageNumber, size);
	},

	_updateOpacity: function () {
		L.DomUtil.setOpacity(this._el, this.options.opacity);
	}
});
