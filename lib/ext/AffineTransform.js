'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _leaflet = require('leaflet');

var _leaflet2 = _interopRequireDefault(_leaflet);

var floating = '(\\-?[\\d\\.e]+)',
    commaSpace = '\\,?\\s*',
    cssMatrixRegex = new RegExp("matrix\\(" + new Array(5).fill(floating + commaSpace).join('') + floating + "\\)");

var identity = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
var SetProjections = {
    _setProjections: function _setProjections(methods) {
        var self = this;
        methods = methods || {};

        function convert(method) {
            return function (pt) {
                if (_leaflet2['default'].Util.isArray(pt)) {
                    var result = [],
                        i,
                        length = pt.length;
                    for (i = 0; i < length; i++) {
                        result.push(self._map[method](pt[i]));
                    }
                    return result;
                } else {
                    return self._map[method](pt);
                }
            };
        }

        function emptyFn(x) {
            return x;
        }
        this._pre = methods.pre ? convert(methods.pre) : emptyFn;
        this._post = methods.post ? convert(methods.post) : emptyFn;
    }
};

function copy(o) {
    var output, v, key;
    output = Array.isArray(o) ? [] : {};
    for (key in o) {
        v = o[key];
        output[key] = typeof v === "object" ? copy(v) : v;
    }
    return output;
}

var Transform = _leaflet2['default'].Class.extend({
    includes: [SetProjections],

    initialize: function initialize(map, options) {
        this._array = identity;
        this._angle = 0;
        this._map = map;
        this._options = options;
        this._setProjections(options);
    },

    toCSSMatrix: function toCSSMatrix(fromArray, pruneTranslation) {
        var fromArray = fromArray || this._array;

        return [fromArray[0][0] || identity[0][0], fromArray[1][0] || identity[1][0], fromArray[0][1] || identity[0][1], fromArray[1][1] || identity[1][1], pruneTranslation ? 0 : fromArray[0][2] || identity[0][2], pruneTranslation ? 0 : fromArray[1][2] || identity[1][2]];
    },

    _arrayFromCSSMatrix: function _arrayFromCSSMatrix(fromArray) {
        return [[fromArray[0] || identity[0][0], fromArray[2] || identity[0][1], fromArray[4] || identity[0][2]], [fromArray[1] || identity[1][0], fromArray[3] || identity[1][1], fromArray[5] || identity[1][2]], [identity[2][0], identity[2][1], identity[2][2]]];
    },

    _parseCSSMatrix: function _parseCSSMatrix(str) {
        var parsedCSSMatrix = cssMatrixRegex.exec(str);

        if (parsedCSSMatrix) {
            parsedCSSMatrix.shift();
            return this._arrayFromCSSMatrix(parsedCSSMatrix.map(function (item) {
                return parseFloat(item);
            }));
        } else {
            return identity;
        }
    },

    applyTransform: function applyTransform(tx) {
        this._array = this._multiply(tx._array, this._array);

        return this;
    },

    createFrom: function createFrom() {
        return new Transform(this._map, this._setProjections(this._options));
    },

    clone: function clone() {
        var tx = new Transform(this._map, this._setProjections(this._options));
        tx._array = copy(this._array);
        tx.angle = this._angle;

        return tx;
    },

    getCSSTranslateString: function getCSSTranslateString(point) {
        return _leaflet2['default'].DomUtil.getTranslateString(this._applyPts(point));
    },

    getCSSTransformString: function getCSSTransformString(pruneTranslation, origin) {
        return "matrix(" + this.toCSSMatrix(this._array, pruneTranslation).join(',') + ")";
    },

    _applyCSSTransformString: function _applyCSSTransformString(transformString) {
        return this._multiply(this._parseCSSMatrix(transformString), this._array);
    },

    scale: function scale(sx, sy) {
        this._array = this._multiply([[sx, 0, 0], [0, sy, 0], [0, 0, 1]], this._array);
        return this;
    },

    translate: function translate(dx, dy) {
        this._array = this._multiply([[1, 0, dx], [0, 1, dy], [0, 0, 1]], this._array);
        return this;
    },

    rotate: function rotate(angle) {
        var cos = Math.cos(angle),
            sin = Math.sin(angle);
        this._array = this._multiply([[cos, -sin, 0], [sin, cos, 0], [0, 0, 1]], this._array);
        this._angle += angle;
        return this;
    },

    move: function move(pt1, pt2) {
        pt1 = this._pre(pt1);
        pt2 = this._pre(pt2);
        return this.translate(pt2.x - pt1.x, pt2.y - pt1.y);
    },

    rotateFrom: function rotateFrom(fromAngle, origin, pt) {
        var origin = this._pre(origin);
        pt = this._pre(pt);
        var angle = Math.atan2(pt.y - origin.y, pt.x - origin.x);
        return this.translate(-origin.x, -origin.y).rotate(angle - fromAngle).translate(origin.x, origin.y);
    },

    resize: function resize(origin, pt1, pt2) {
        var origin = this._pre(origin);

        pt1 = this._pre(pt1);
        pt2 = this._pre(pt2);

        // translate so the opposite corner becomes the new origin
        this.translate(-origin.x, -origin.y);

        // resizing by moving corner pt1 to pt2 is now a simple scale operation along x and y-axis
        var f = this._applyPts(pt1);
        var t = this._applyPts(pt2);
        var scaleX = t.x / f.x;
        var scaleY = t.y / f.y;

        // guard against zero-division or too small values
        if (!isFinite(scaleX) || Math.abs(scaleX) < 1E-7) {
            scaleX = 1;
        }
        if (!isFinite(scaleY) || Math.abs(scaleY) < 1E-7) {
            scaleY = 1;
        }

        return this.scale(scaleX, scaleY).translate(origin.x, origin.y);
    },

    getAngle: function getAngle() {
        return this._angle;
    },

    apply: function apply(pts) {
        return this._post(this._applyPts(this._pre(pts)));
    },

    _applyPts: function _applyPts(pts) {
        if (_leaflet2['default'].Util.isArray(pts)) {
            var result = [],
                i,
                length = pts.length;
            for (i = 0; i < length; i++) {
                result.push(this._applyPts(pts[i]));
            }
            return result;
        } else {
            var xyz = this._applyXYZ([pts.x, pts.y, 1]);
            return _leaflet2['default'].point(xyz[0], xyz[1]);
        }
    },

    _applyXYZ: function _applyXYZ(xyz) {
        var result = [],
            i,
            j;
        for (i = 0; i < 3; i++) {
            result[i] = 0;
            for (j = 0; j < 3; j++) {
                result[i] += this._array[i][j] * xyz[j];
            }
        }
        return result;
    },

    _multiply: function _multiply(m1, m2) {
        var result = [],
            i,
            j,
            k;
        for (i = 0; i < 3; i++) {
            result[i] = [];
            for (j = 0; j < 3; j++) {
                result[i][j] = 0;
                for (k = 0; k < 3; k++) {
                    result[i][j] += m1[i][k] * m2[k][j];
                }
            }
        }
        return result;
    }
});

exports.SetProjections = SetProjections;
exports.Transform = Transform;