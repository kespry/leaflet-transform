#!/usr/bin/env node

var fs        = require('fs'),
    tempfile  = require('tempfile'),
    Canvas    = require('Canvas'),
    Image     = Canvas.Image,
    gdal      = require('gdal');

var args = process.argv.slice(2);
var rasterDSM = gdal.open(args[0]);
rasterDSM.bands.forEach(function(band) {
  var rawBuffer = new ArrayBuffer((band.size.x * band.size.y) * 4);
  var bandData = new Float32Array(rawBuffer);
  var bandData8 = new Uint8Array(rawBuffer);

  band.pixels.read(0, 0, band.size.x, band.size.y, bandData);

  var heightMap = new Canvas(band.size.x, band.size.y),
      ctx       = heightMap.getContext('2d'),
      imageData = ctx.createImageData(band.size.x, band.size.y);

  imageData.data.set(bandData8);
  ctx.putImageData(imageData, 0, 0);

  var png = tempfile('.png');
  fs.writeFileSync(png, heightMap.toBuffer());
  console.log(png);
});
