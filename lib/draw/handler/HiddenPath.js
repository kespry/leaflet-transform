'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _leaflet = require('leaflet');

var _leaflet2 = _interopRequireDefault(_leaflet);

var _editHandlerSimplePolyGroup = require('../../edit/handler/SimplePolyGroup');

var _editHandlerSimplePolyGroup2 = _interopRequireDefault(_editHandlerSimplePolyGroup);

var HiddenPath = _leaflet2['default'].Polygon.extend({
  options: {
    opacity: 0,
    fillOpacity: 0
  }
});

HiddenPath.addInitHook(function () {
  this.editing = new _editHandlerSimplePolyGroup2['default'](this);

  if (this.options.editable) {
    this.editing.enable();
  }
});

exports['default'] = HiddenPath;
module.exports = exports['default'];