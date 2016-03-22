'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _leaflet = require('leaflet');

var _leaflet2 = _interopRequireDefault(_leaflet);

var _PolyGroup = require('../../edit/handler/PolyGroup');

var _PolyGroup2 = _interopRequireDefault(_PolyGroup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DoubleBorderPolygon = _leaflet2.default.Polygon.extend({
  _initPath: function _initPath() {
    this._container = this._createElement("g");
    this._primaryPath = this._path = this._createElement("path");
    this._secondaryPath = this._createElement("path");

    if (this.options.className) {
      _leaflet2.default.DomUtil.addClass(this._path, this.options.className);
      _leaflet2.default.DomUtil.addClass(this._secondaryPath, this.options.className);
    }

    this._container.appendChild(this._secondaryPath);
    this._container.appendChild(this._primaryPath);
  }
});

var reserved = "____";
function drawDoublePath(method) {
  return function () {
    // Backup old values.
    var options = this.options;
    var path = this._path;

    // Primary path.
    this._path = this._primaryPath;
    this.options = (0, _assign2.default)({}, options, this.options.primary);
    DoubleBorderPolygon.prototype[reserved + method].apply(this, arguments);

    // Secondary path.
    this._path = this._secondaryPath;
    this.options = (0, _assign2.default)({}, options, this.options.secondary);
    DoubleBorderPolygon.prototype[reserved + method].apply(this, arguments);

    // Restore old values.
    this._path = path;
    this.options = options;
  };
}

["_initStyle", "_updateStyle", "_updatePath"].forEach(function (method) {
  DoubleBorderPolygon.prototype[reserved + method] = DoubleBorderPolygon.prototype[method];
  DoubleBorderPolygon.prototype[method] = drawDoublePath(method);
});

DoubleBorderPolygon.addInitHook(function () {
  this.editing = new _PolyGroup2.default(this);

  if (this.options.editable) {
    this.editing.enable();
  }
});

exports.default = DoubleBorderPolygon;