'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _leaflet = require('leaflet');

var _leaflet2 = _interopRequireDefault(_leaflet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _leaflet2.default.Class.extend({
  includes: [_leaflet2.default.Mixin.Events],

  initialize: function initialize(pdf2svg) {
    this._pdf2svg = pdf2svg;
    this._svg = this._createElement();
  },

  load: function load(url) {
    this._url = url;
    this._isLoading = true;

    this._svg.addEventListener = function () {
      this._isLoading = false;
      this.fire('load');
    }.bind(this);

    this._svg.src = this._pdf2svg + encodeURIComponent(url);
  },

  render: function render() {},

  getElement: function getElement() {
    return this._svg;
  },

  _createElement: function _createElement() {
    return _leaflet2.default.DomUtil.create('img', 'leaflet-svg-layer');
  }
});