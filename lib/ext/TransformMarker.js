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
    this._group = group;

    this.on("add", function () {
      this._bindEvents();
    }, this);

    this.on("remove", function () {
      this._unbindEvents();
    }, this);
  },
  _bindEvents: function _bindEvents() {
    this.on("remove", this._toggleEditState, this);

    if (this._group) {
      this._group.on("edit", this._toggleEditState, this);
      this.on("dragend", this._group.onDoneEditing, this._group);
      this.on("contextmenu", this._group._removeMarker, this._group);
    }

    this._toggleEditState();
  },
  _unbindEvents: function _unbindEvents() {
    this.off("remove", this._toggleEditState, this);

    if (this._group) {
      this._group.off("edit", this._toggleEditState, this);
      this.off("dragend", this._group.onDoneEditing, this._group);
      this.off("contextmenu", this._group._removeMarker, this._group);
    }
  },
  _toggleEditState: function _toggleEditState(event) {
    var state = event && event.state ? event.state : this._group.editing.state;
    if (this.dragging) state ? this.dragging.enable() : this.dragging.disable();
  },
  applyTransform: function applyTransform(tx) {
    if (tx) {
      this.setLatLng(tx.apply(this._origLatLng));
    } else {
      this._origLatLng = this.getLatLng();
    }
  }
});