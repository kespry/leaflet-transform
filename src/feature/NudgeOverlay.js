import L from 'leaflet';
import SVGOverlay from '../layer/SVGOverlay';
import nudged from 'nudged';
import Matrix from 'transformation-matrix-js';
import affineFit from 'affinefit';

const m = Matrix.Matrix;

function pastelColors() {
  var r = (Math.round(Math.random()* 127) + 150).toString(16);
  var g = (Math.round(Math.random()* 127) + 150).toString(16);
  var b = (Math.round(Math.random()* 127) + 150).toString(16);
  return '#' + r + g + b;
}

export default L.FeatureGroup.extend({
  options: {
    domainControlPointIcon: new L.DivIcon({
			iconSize: new L.Point(10, 10),
			className: 'leaflet-div-icon domain'
		}),
		rangeControlPointIcon: new L.DivIcon({
			iconSize: new L.Point(10, 10),
			className: 'leaflet-div-icon range'
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

  _undef: function(a){ return typeof a == "undefined" },
  onAdd: function(map) {
    var self = this;

    var zoomStart = function(e) {
      console.log(e);
      if(this === self.options.domain) {
        self.options.range.setZoom(e.zoom);
      }
    };

    var zoomEnd = function(e) {
      var state;

      if(this === self.options.domain) {
        state = self._zoomState.domain;
        //console.log('set zoom!', e.target.zoom);

      } else {
        state = self._zoomState.range;
      }
      console.log(state);
      var evt = e.target;
      var newZoom = self._undef(evt.zoom) ? this.getZoom() : evt.zoom;
      state.zoomDiff = newZoom - state.zoom;
      state.scale = Math.pow(2, state.zoomDiff);
      state.unitsPerMeter = 256 * Math.pow(2, this.getZoom()) / 40075017;



      console.log('scale!!', state.scale, state.zoomDiff, newZoom, evt, this);
      console.log('zoom', this.getZoom());

      var stroke = self.options.stroke ? self.options.stroke * 2 : 1.5;
      if(this === self.options.domain) {
        self._overlays.domain.addStyle(`path { stroke-width: ${stroke / state.scale}px !important; }`);
      } else {
        self._overlays.range.addStyle(`path { stroke-width: ${stroke / state.scale}px !important; }`);
      }



      if(self.controlPoints.domain.length && self.controlPoints.range.length) {
        self.updateTransformEstimate();
      }
    };

    this._zoomState = this._zoomState || {
      domain: {},
      range: {}
    };

    if(map === this.options.domain) {
      map.addLayer(this._overlays.domain);
      this._domainMap = map;
      //this._domainMap.on('zoomanim', zoomStart.bind(this._domainMap));
      this._domainMap.on('zoomend', zoomEnd.bind(this._domainMap));

      this._zoomState.domain = {
        zoom: map.getZoom(),
        scale: Math.pow(2, map.getZoom()),
        unitsPerMeter: 256 * Math.pow(2, map.getZoom()) / 40075017
      };

      var stroke = self.options.stroke || 1;
      this._overlays.domain.on('load', function() {
        this._overlays.domain.addStyle(`path { stroke-width: ${stroke}px !important; }`);
      }.bind(this));
    } else if(map === this.options.range) {
      map.addLayer(this._overlays.range);
      this._rangeMap = map;
      //this._rangeMap.on('zoomanim', zoomStart.bind(this._rangeMap));
      this._rangeMap.on('zoomend', zoomEnd.bind(this._rangeMap));

      this._zoomState.range = {
        zoom: map.getZoom(),
        scale: Math.pow(2, map.getZoom()),
        unitsPerMeter: 256 * Math.pow(2, map.getZoom()) / 40075017
      };

      this._overlays.range._el.style.display = 'none';
        var stroke = self.options.stroke || 1;
      this._overlays.range.on('load', function() {
        this._overlays.range.addStyle(`path { stroke-width: ${stroke}px !important; }`);
      }.bind(this));

      this.fire('add', { el: this._overlays.range._el });
    }




    return L.FeatureGroup.prototype.onAdd.apply(this, arguments);
  },

  createAlignmentUI: function(el) {
    var container = document.createElement('div');
    container.className = 'controls';

    var addControlPoint = document.createElement('button');
    addControlPoint.innerHTML = 'Start Alignment';
    addControlPoint.addEventListener('click', this.addControlPoint.bind(this));

    container.appendChild(addControlPoint);
    el.appendChild(container);
  },

  addControlPoint: function(e) {
    this.options.domain._container.style.cursor = 'crosshair';
    this.options.range._container.style.cursor = 'crosshair';

    //addControlPoint.innerHTML = 'Start Alignment';

    var self = this;
    var controlPointHandlers = {
      domain: function(e) {
        // domain point
        var controlPoint = L.marker(e.latlng, {
          icon: self.options.domainControlPointIcon,
          clickable: true,
          draggable: true
        });
        self.controlPoints.domain.push(controlPoint);

        controlPoint.on('drag', function() {
          self.updateTransformEstimate();
        });
        controlPoint.on('add', function() {
          controlPoint._icon.style.backgroundColor = pastelColors();
        });
        controlPoint.addTo(self.options.domain);

        if(self.controlPoints.domain.length && self.controlPoints.range.length) {
          self.updateTransformEstimate();
        }
      },

      range: function(e) {
        // create map control point
        var controlPoint = L.marker(e.latlng, {
          icon: self.options.rangeControlPointIcon,
          clickable: true,
          draggable: true
        });
        self.controlPoints.range.push(controlPoint);

        controlPoint.on('drag', function() {
          self.updateTransformEstimate();
        });
        controlPoint.on('add', function() {
          controlPoint._icon.style.backgroundColor = self.controlPoints.domain[self.controlPoints.range.length - 1]._icon.style.backgroundColor;
        });
        controlPoint.addTo(self.options.range);


        if(self.controlPoints.domain.length && self.controlPoints.range.length) {
          self.updateTransformEstimate();
        }
      }
    };

    this.options.domain.on('click', controlPointHandlers.domain);
    this.options.range.on('click', controlPointHandlers.range);

    e.preventDefault();
    e.stopPropagation();
  },

  projectControlPoints: function(points) {
    var self = this;

    var origin = this._overlays.range.getOrigin();
    return points.map(function(pointMarker) {
      var pt = self._map.latLngToLayerPoint(pointMarker.getLatLng());
      return [pt.x - origin.x, pt.y - origin.y];
    });
  },

  toObj: function(points) {
    return points.map(function(pt) {
      return {x: pt[0], y: pt[1]};
    });
  },

  updateTransformEstimate: function() {
    var domainPoints = this.projectControlPoints(this.controlPoints.domain);
    var rangePoints = this.projectControlPoints(this.controlPoints.range);

    if(domainPoints.length >= 3 && rangePoints.length >= 3) {
      this._overlays.range._el.style.display = 'block';
    console.log(domainPoints, rangePoints);
    //var transform2;
    var transform = affineFit(domainPoints, rangePoints);
    //if(domainPoints.length >= 3 && rangePoints.length >= 3) {
    //  transform2 = m.fromTriangles(this.toObj(domainPoints), this.toObj(rangePoints));
    //  console.log(transform2);
    //}
    //var transform = nudged.estimate('TSR', domainPoints, rangePoints);
    //var matrix = transform.getMatrix();
    //var cssMatrix = [transform.s, transform.r, -transform.r, transform.s, transform.tx, transform.ty];
      if(transform) {
        //console.log('transform!!', transform);
        window.transform = transform;
        //console.log('transform2!!!', transform2);
        var cssStr = 'matrix(' + [transform.M[0][3], transform.M[0][4], transform.M[1][3], transform.M[1][4], transform.M[2][3], transform.M[2][4]].join(',') + ')';
        console.log('transform!!', cssStr);
        var cssTransformStr = L.DomUtil.getTranslateString(this._overlays.range.getOrigin()) + ' ' + cssStr;

        this._overlays.range._el.style.transform = cssTransformStr;
        this._overlays.range._el.style.transformOrigin = '0 0 0';
        //this.transform = transform;
      }
    }
  }
});
