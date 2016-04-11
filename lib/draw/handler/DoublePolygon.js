"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _leaflet = require('leaflet');

var _leaflet2 = _interopRequireDefault(_leaflet);

var _DoubleMixin = require("./DoubleMixin");

var _DoubleMixin2 = _interopRequireDefault(_DoubleMixin);

exports["default"] = _leaflet2["default"].Polygon.extend({
  parentClass: _leaflet2["default"].Polygon,
  includes: _DoubleMixin2["default"]
});
module.exports = exports["default"];