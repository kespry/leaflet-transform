import L from 'leaflet';
import affineFit from 'affinefit';

export default L.Class.extend({
	includes: L.Mixin.Events,

	options: {
		opacity: 1
	},

	initialize: function (url, bounds, options) {
		this._url = url;
		this._bounds = L.latLngBounds(bounds);

    if(options.controlPoints) {
      this.controlPoints = options.controlPoints;
    } else {
      this.controlPoints = {
        source: [],
        destination: []
      };
    }

		L.setOptions(this, options);
	},

	onAdd: function (map) {
		this._map = map;

		if (!this._el) {
			this._initImage();
		}

		map._panes.overlayPane.appendChild(this._el);

		map.on('viewreset', this._reset, this);
    map.on('zoomend', this._zoomEnd, this);

		if (map.options.zoomAnimation && L.Browser.any3d) {
			map.on('zoomanim', this._animateZoom, this);
		}

    this._zoom = map.getZoom();

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

	_initImage: function () {
		this._el = L.DomUtil.create('iframe', 'leaflet-image-layer');

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
			onload: L.bind(this._onLoad, this),
			src: this._url
		});
	},

  _zoomEnd: function(e) {
    var scale = Math.pow(2, this._map.getZoom() - this._zoom);
    this._setLineScale(scale);
    this.updateTransformEstimate();
  },

  _setLineScale: function(scale) {
    var stroke = this.options.stroke ? this.options.stroke : 1;

    var a = document.createElement('a');
    a.href = this._url;

    this._el.contentWindow.postMessage(JSON.stringify({
      command: "setStyle",
      styles: `font-size: ${stroke / scale}em;`
    }), a.origin);
  },

	_animateZoom: function (e) {
		// TODO
	},

  getOrigin: function(projection) {
    return projection(this._bounds.getNorthWest());
  },

	_reset: function () {
		var iframe   = this._el,
		    topLeft = this._map.latLngToLayerPoint(this._bounds.getNorthWest()),
		    size = this._map.latLngToLayerPoint(this._bounds.getSouthEast())._subtract(topLeft);

		L.DomUtil.setPosition(iframe, topLeft);

		iframe.style.width  = size.x + 'px';
		iframe.style.height = size.y + 'px';
	},

	_onLoad: function () {
		this._el.contentWindow.document.children[0].style.width = '100%';
		this._el.contentWindow.document.children[0].style.height = '100%';

    this._setLineScale();
    this.updateTransformEstimate();
		this.fire('load');
	},

  projectControlPoints: function(points, projection) {
    var self = this;

    var origin = this.getOrigin(projection);
    return points.map(function(pointMarker) {
      var pt = projection(pointMarker.getLatLng());
      return [pt.x - origin.x, pt.y - origin.y];
    });
  },

	_updateOpacity: function () {
		L.DomUtil.setOpacity(this._el, this.options.opacity);
	},

  _getCSSTransform: function(transform) {
    return [transform.M[0][3], transform.M[0][4], transform.M[1][3], transform.M[1][4], transform.M[2][3], transform.M[2][4]];
  },

  updateTransformEstimate: function(controlPoints) {
    if(controlPoints) this.controlPoints = controlPoints;

    var pixelCoords = this._map.latLngToLayerPoint;
    var sourcePoints = this.projectControlPoints(this.controlPoints.source, pixelCoords);
    var destinationPoints = this.projectControlPoints(this.controlPoints.destination, pixelCoords);

    if(sourcePoints.length >= 3 && destinationPoints.length >= 3) {
      var transform = affineFit(sourcePoints, destinationPoints);

      if(transform) {
        var cssStr = 'matrix(' + this._getCSSTransform(transform).join(',') + ')';
        var cssTransformStr = L.DomUtil.getTranslateString(this.getOrigin(pixelCoords)) + ' ' + cssStr;

        this._el.style.transform = cssTransformStr;
        this._el.style.transformOrigin = '0 0 0';
      }
    }
  },

  getMercatorTransform: function(controlPoints) {
    if(controlPoints) this.controlPoints = controlPoints;

    var mercatorCoords = L.Projection.SphericalMercator.project;
    var sourcePoints = this.projectControlPoints(this.controlPoints.source, mercatorCoords);
    var destinationPoints = this.projectControlPoints(this.controlPoints.destination, mercatorCoords);

    if(sourcePoints.length >= 3 && destinationPoints.length >= 3) {
      var transform = affineFit(sourcePoints, destinationPoints);
      return this._getCSSTransform(transform);
    }
  }
});
