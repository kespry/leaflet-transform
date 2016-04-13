import L from 'leaflet';

export default L.Class.extend({
  includes: [L.Mixin.Events],

  initialize: function(pdf2svg) {
    this._pdf2svg = pdf2svg;
    this._svg = this._createElement();
  },

  load: function(url) {
    this._url = url;
    this._isLoading = true;

    this._svg.addEventListener = function() {
      this._isLoading = false;
      this.fire('load');
    }.bind(this);

    this._svg.src = this._pdf2svg + encodeURIComponent(url);
  },

  render: function() { },

  getElement: function() {
    return this._svg;
  },

  _createElement: function() {
    return L.DomUtil.create('img', 'leaflet-svg-layer');
  }
});
