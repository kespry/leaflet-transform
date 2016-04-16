import L from 'leaflet';
import SVGOverlay from '../layer/SVGOverlay';
import nudged from 'nudged';

export default L.FeatureGroup.extend({
  options: {
    domainControlPointIcon: new L.DivIcon({
			iconSize: new L.Point(8, 8),
			className: 'leaflet-div-icon map-control'
		}),
		rangeControlPointIcon: new L.DivIcon({
			iconSize: new L.Point(8, 8),
			className: 'leaflet-div-icon image-control'
		})
  },
  initialize: function(bounds, options) {
    this._layers = {};
    this._bounds = bounds;
    L.Util.setOptions(this, options);

    this._overlays = {
      domain: new SVGOverlay(options.url, bounds, options),
      range: new SVGOverlay(options.url, bounds, options)
    };

    this.controlPoints = {
      domain: [],
      range: []
    };

    this.createAlignmentUI(options.el);
  },

  onAdd: function(map) {
    if(map === this.options.domain) {
      map.addLayer(this._overlays.domain);
    } else if(map === this.options.range) {
      map.addLayer(this._overlays.range);
    }

    map.on('zoomend', function() {
      if(this.controlPoints.domain.length && this.controlPoints.range.length) {
        this.updateTransformEstimate();
      }
    }.bind(this));
    return L.FeatureGroup.prototype.onAdd.apply(this, arguments);
  },

  createAlignmentUI: function(el) {
    var container = document.createElement('div');
    container.className = 'controls';

    var addControlPoint = document.createElement('button');
    addControlPoint.innerHTML = 'Add Control Point';
    addControlPoint.addEventListener('click', this.addControlPoint.bind(this));

    container.appendChild(addControlPoint);
    el.appendChild(container);
  },

  addControlPoint: function(e) {
    this.options.domain._container.style.cursor = 'crosshair';

    var self = this;
    var controlPointHandlers = {
      domain: function(e) {
        // domain point
        var domainPoint = L.marker(e.latlng, {
          icon: self.options.domainControlPointIcon,
          clickable: true,
          draggable: true
        });
        self.controlPoints.domain.push(domainPoint);

        domainPoint.on('drag', function() {
          self.updateTransformEstimate();
        });
        domainPoint.addTo(self.options.domain);

        // range point
        var pt = self._map.latLngToLayerPoint(e.latlng), estimatedPoint;


        if(self.transform) {
          //debugger;
          estimatedPoint = self.transform.transform([pt.x, pt.y]);
        }

        console.log('estimated point!!', estimatedPoint);

        var estimatedLatLng = estimatedPoint ? self._map.layerPointToLatLng(L.point(estimatedPoint)) : e.latlng;

        var rangePoint = L.marker(estimatedLatLng, {
          icon: self.options.rangeControlPointIcon,
          clickable: true,
          draggable: true
        });
        self.controlPoints.range.push(rangePoint);

        rangePoint.on('drag', function() {
          self.updateTransformEstimate();
        });

        rangePoint.addTo(self.options.range);

        self.options.domain.off('click', controlPointHandlers.domain);
        //self.options.range.on('click', controlPointHandlers.range);

        self.options.domain._container.style.cursor = 'default';
        //self.options.range._container.style.cursor = 'crosshair';

        if(self.controlPoints.domain.length && self.controlPoints.range.length) {
          self.updateTransformEstimate();
        }
      },

      range: function(e) {
        // create map control point
        var controlPoint = L.marker(e.latlng, {
          icon: self.options.mapControlPointIcon,
          clickable: true,
          draggable: true
        });
        self.controlPoints.map.push(controlPoint);

        controlPoint.on('drag', function() {
          self.updateTransformEstimate();
        });

        controlPoint.addTo(self._map);

        this.options.range.off('click', controlPointHandlers.range);
        self.options.range._container.style.cursor = 'default';

        if(self.controlPoints.domain.length && self.controlPoints.range.length) {
          self.updateTransformEstimate();
        }
      }
    };

    this.options.domain.once('click', controlPointHandlers.domain);

    e.preventDefault();
    e.stopPropagation();
  },

  projectControlPoints: function(points) {
    var self = this;

    return points.map(function(pointMarker) {
      var pt = self._map.latLngToLayerPoint(pointMarker.getLatLng());
      return [pt.x, pt.y];
    });
  },

  updateTransformEstimate: function() {
    console.log('domain', this.projectControlPoints(this.controlPoints.domain), 'range', this.projectControlPoints(this.controlPoints.range));
    var transform = nudged.estimate('TSR', this.projectControlPoints(this.controlPoints.domain), this.projectControlPoints(this.controlPoints.range));
    var matrix = transform.getMatrix();
    //var cssMatrix = [matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f];
    var cssMatrix = [transform.s, transform.r, -transform.r, transform.s, transform.tx, transform.ty];
    var cssTransformStr = L.DomUtil.getTranslateString(this._overlays.range.getOrigin()) + ' matrix(' + cssMatrix.join(', ') + ')';
    //console.log(matrix, cssMatrix, cssTransformStr);
    this._overlays.range._image.style.transform = cssTransformStr;
    this._overlays.range._image.style.transformOrigin = '0 0 0';
    this.transform = transform;
  }
});
