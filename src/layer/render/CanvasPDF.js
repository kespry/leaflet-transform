import L from 'leaflet';

export default L.Class.extend({
  includes: [L.Mixin.Events],

  initialize: function(pdfReader) {
    this._pdfReader = pdfReader;
    this._canvas = this._createElement();
  },

  load: function(url) {
    this._url = url;
    this._isLoading = true;

    this._pdfReader.getDocument(url).then(function(_document) {
      this._document = _document;
      this._isLoading = false;
      this.fire('load');
    }.bind(this));
  },

  render: function(pageNumber, size) {
    var self = this;

    if(this._document) {
      this._document.getPage(pageNumber).then(function(page) {
        var viewport = page.getViewport(1);

        var scaleX = 1, scaleY = 1;
        if(size) {
          scaleX =  size.x / viewport.width;
          scaleY =  size.y / viewport.height;
        }

        self._canvas.el.width = size.x;
        self._canvas.el.height = size.y;

        var scaledViewport = page.getViewport(1);
        var opts = {
          canvasContext: self._canvas.ctx,
          viewport: scaledViewport,
          transform: [scaleX, 0, 0, scaleY, 0, 0]
        };

        page.render(opts).then(function(done) {
          self.fire('render', pageNumber);
        });
      });
    } else {
      this.once('load', function() {
        self.render.call(self, pageNumber, size);
      });

      if(!this._isLoading) this.load(this._url);
    }
  },

  getElement: function() {
    return this._canvas.el;
  },

  _createElement: function() {
    var canvas = L.DomUtil.create('canvas', 'leaflet-canvas-layer');
    return { el: canvas, ctx: canvas.getContext('2d') };
  }
});
