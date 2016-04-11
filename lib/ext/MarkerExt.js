'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _leaflet = require('leaflet');

var _leaflet2 = _interopRequireDefault(_leaflet);

exports['default'] = _leaflet2['default'].Marker.extend({
    options: {
        dx: 0,
        dy: 0
    },

    initialize: function initialize(latlng, options) {
        _leaflet2['default'].Marker.prototype.initialize.call(this, latlng, options);
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
        _leaflet2['default'].Marker.prototype._setPos.call(this, pos);
    }
});
module.exports = exports['default'];