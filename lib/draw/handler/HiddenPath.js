'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _leaflet = require('leaflet');

var _leaflet2 = _interopRequireDefault(_leaflet);

var _SimplePolyGroup = require('../../edit/handler/SimplePolyGroup');

var _SimplePolyGroup2 = _interopRequireDefault(_SimplePolyGroup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HiddenPath = _leaflet2.default.Polygon.extend({
  options: {
    opacity: 0,
    fillOpacity: 0
  }
});

HiddenPath.addInitHook(function () {
  this.editing = new _SimplePolyGroup2.default(this);

  if (this.options.editable) {
    this.editing.enable();
  }
});

exports.default = HiddenPath;