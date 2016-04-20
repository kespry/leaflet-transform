"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _leaflet = require("leaflet");

var _leaflet2 = _interopRequireDefault(_leaflet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _leaflet2.default.Marker.extend({
  options: {
    draggable: true
  },
  initialize: function initialize(latlng, options, group) {
    _leaflet2.default.Marker.prototype.initialize.apply(this, arguments);

    this._origLatLng = latlng;

    this.on("add", function () {
      if (group.editing.state) {
        this.dragging.enable();
      } else {
        this.dragging.disable();
      }
    });

    this.on("dragend", function () {
      this._origLatLng = this.getLatLng();
    });

    var marker = this;
    group.on("edit", function (event) {
      event.state ? marker.dragging.enable() : marker.dragging.disable();
    });
  },
  applyTransform: function applyTransform(tx) {
    if (tx) {
      this.setLatLng(tx.apply(this._origLatLng));
    } else {
      this._origLatLng = this.getLatLng();
    }
  }
});