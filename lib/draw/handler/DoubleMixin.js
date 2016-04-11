'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _leaflet = require('leaflet');

var _leaflet2 = _interopRequireDefault(_leaflet);

var _editHandlerPolyGroup = require('../../edit/handler/PolyGroup');

var _editHandlerPolyGroup2 = _interopRequireDefault(_editHandlerPolyGroup);

var DoubleMixin = _leaflet2['default'].Class.extend({
  initialize: function initialize() {
    this.parentClass.prototype.initialize.apply(this, arguments);
    var self = this;
    ["_initStyle", "_updateStyle", "_updatePath"].forEach(function (method) {
      self[method] = drawDoublePath.call(self, method);
    });
  },

  _initPath: function _initPath() {
    this._container = this._createElement("g");
    this._primaryPath = this._path = this._createElement("path");
    this._secondaryPath = this._createElement("path");

    if (this.options.className) {
      _leaflet2['default'].DomUtil.addClass(this._path, this.options.className);
      _leaflet2['default'].DomUtil.addClass(this._secondaryPath, this.options.className);
    }

    this._container.appendChild(this._secondaryPath);
    this._container.appendChild(this._primaryPath);
  }
});

function drawDoublePath(method) {
  return function () {
    // Backup old values.
    var options = this.options;
    var path = this._path;

    // Primary path.
    this._path = this._primaryPath;
    this.options = Object.assign({}, options, this.options.primary);
    this.parentClass.prototype[method].apply(this, arguments);

    // Secondary path.
    this._path = this._secondaryPath;
    this.options = Object.assign({}, options, this.options.secondary);
    this.parentClass.prototype[method].apply(this, arguments);

    // Restore old values.
    this._path = path;
    this.options = options;
  };
}

// ["_initStyle", "_updateStyle", "_updatePath"].forEach(function(method) {
//   // DoubleMixin.prototype[reserved + method] = DoubleMixin.prototype[method];
//   DoubleMixin.prototype[method] = drawDoublePath(method);
// });

DoubleMixin.addInitHook(function () {
  this.editing = new _editHandlerPolyGroup2['default'](this);

  if (this.options.editable) {
    this.editing.enable();
  }
});

exports['default'] = DoubleMixin.prototype;
module.exports = exports['default'];