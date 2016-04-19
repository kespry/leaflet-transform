'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _leaflet = require('leaflet');

var _leaflet2 = _interopRequireDefault(_leaflet);

exports['default'] = _leaflet2['default'].Polyline.extend({
    initialize: function initialize(latLng, dx, dy, options) {
        _leaflet2['default'].Polyline.prototype.initialize.call(this, [latLng, latLng], options);
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
            var pt2 = _leaflet2['default'].point(pt1.x + this._dx, pt1.y + this._dy);
            this._parts[0] = [pt1, pt2];
        }
        _leaflet2['default'].Polyline.prototype._simplifyPoints.call(this);
    }
});
module.exports = exports['default'];