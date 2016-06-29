(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var gaussJordan = require('./gaussJordan');
var transformation = require('./transformation');

function emptyArray(x, y) {
  return Array(y).fill(0).map(function () {
    return Array(x).fill(0);
  });
}

/**
 * @param {array} q - from points
 * @param {array} p - to points
 */
function affineFit(q, p) {
  if (q.length !== p.length || q.length < 1) {
    console.error('from_pts and to_pts must be of same size.');
    return false;
  }

  var dim = q[0].length; // num of dimensions

  if (q.length < dim) {
    console.error('Too few points => under-determined system.');
    return false;
  }

  // Make an empty (dim) x (dim+1) matrix and fill it
  var c = emptyArray(dim, dim + 1);

  for (var j = 0; j < dim; j++) {
    for (var k = 0; k < dim + 1; k++) {
      for (var i = 0; i < q.length; i++) {
        var qt = q[i].concat(1);
        c[k][j] += qt[k] * p[i][j];
      }
    }
  }

  // Make an empty (dim+1) x (dim+1) matrix and fill it
  var Q = emptyArray(dim + 1, dim + 1);

  q.forEach(function (qi) {
    var qt = qi.concat(1);
    for (var _i = 0; _i < dim + 1; _i++) {
      for (var _j = 0; _j < dim + 1; _j++) {
        Q[_i][_j] += qt[_i] * qt[_j];
      }
    }
  });

  // Augment Q with c and solve Q * a' = c by Gauss-Jordan
  var M = Q.map(function (qi, idx) {
    return qi.concat(c[idx]);
  });

  if (!gaussJordan(M)) {
    console.error('Error: singular matrix. Points are probably coplanar.');
    return false;
  }

  return transformation(M, dim);
}
module.exports = affineFit;
},{"./gaussJordan":2,"./transformation":3}],2:[function(require,module,exports){
'use strict';

/*
   Puts given matrix (2D array) into the Reduced Row Echelon Form.
   Returns True if successful, False if 'm' is singular.
   NOTE: make sure all the matrix items support fractions! Int matrix will NOT work!
   Written by Jarno Elonen in April 2005, released into Public Domain

   Ultra simple linear system solver. Replace this if you need speed.
*/

function gaussJordan(m) {
  var eps = 1e-10; // 1.0 / Math.pow(10, 10)

  var h = m.length;
  var w = m[0].length;
  var c;

  for (var y = 0; y < h; y++) {
    var maxrow = y;
    for (var y2 = y + 1; y2 < h; y2++) {
      // Find max pivot
      if (Math.abs(m[y2][y]) > Math.abs(m[maxrow][y])) {
        maxrow = y2;
      }
    }

    c = m[maxrow];
    m[maxrow] = m[y];
    m[y] = c;

    if (Math.abs(m[y][y]) <= eps) {
      // Singular?
      return false;
    }

    for (var _y = y + 1; _y < h; _y++) {
      // Eliminate column y
      c = m[_y][y] / m[y][y];
      for (var x = y; x < w; x++) {
        m[_y][x] -= m[y][x] * c;
      }
    }
  }

  for (var _y2 = h - 1; _y2 > -1; _y2--) {
    // Backsubstitute
    c = m[_y2][_y2];
    for (var _y3 = 0; _y3 < _y2; _y3++) {
      for (var _x = w - 1; _x > _y2 - 1; _x--) {
        m[_y3][_x] -= m[_y2][_x] * m[_y3][_y2] / c;
      }
    }
    m[_y2][_y2] /= c;
    for (var _x2 = h; _x2 < w; _x2++) {
      // Normalize row y
      m[_y2][_x2] /= c;
    }
  }
  return true;
}
module.exports = gaussJordan;
},{}],3:[function(require,module,exports){
'use strict';

function transformation(M, dim) {
  function transformPoint(pt) {
    var res = Array(dim).fill(0);

    for (var j = 0; j < dim; j++) {
      for (var i = 0; i < dim; i++) {
        res[j] += pt[i] * M[i][j + dim + 1];
      }
      res[j] += M[dim][j + dim + 1];
    }
    return res;
  }
  transformPoint.M = M;
  return transformPoint;
}
module.exports = transformation;
},{}],4:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/get-iterator"), __esModule: true };
},{"core-js/library/fn/get-iterator":11}],5:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/is-iterable"), __esModule: true };
},{"core-js/library/fn/is-iterable":12}],6:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/assign"), __esModule: true };
},{"core-js/library/fn/object/assign":13}],7:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/symbol"), __esModule: true };
},{"core-js/library/fn/symbol":14}],8:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/symbol/iterator"), __esModule: true };
},{"core-js/library/fn/symbol/iterator":15}],9:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _isIterable2 = require("babel-runtime/core-js/is-iterable");

var _isIterable3 = _interopRequireDefault(_isIterable2);

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = (0, _getIterator3.default)(arr), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if ((0, _isIterable3.default)(Object(arr))) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();
},{"babel-runtime/core-js/get-iterator":4,"babel-runtime/core-js/is-iterable":5}],10:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _iterator = require("babel-runtime/core-js/symbol/iterator");

var _iterator2 = _interopRequireDefault(_iterator);

var _symbol = require("babel-runtime/core-js/symbol");

var _symbol2 = _interopRequireDefault(_symbol);

var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default ? "symbol" : typeof obj; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
} : function (obj) {
  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
};
},{"babel-runtime/core-js/symbol":7,"babel-runtime/core-js/symbol/iterator":8}],11:[function(require,module,exports){
require('../modules/web.dom.iterable');
require('../modules/es6.string.iterator');
module.exports = require('../modules/core.get-iterator');
},{"../modules/core.get-iterator":73,"../modules/es6.string.iterator":78,"../modules/web.dom.iterable":80}],12:[function(require,module,exports){
require('../modules/web.dom.iterable');
require('../modules/es6.string.iterator');
module.exports = require('../modules/core.is-iterable');
},{"../modules/core.is-iterable":74,"../modules/es6.string.iterator":78,"../modules/web.dom.iterable":80}],13:[function(require,module,exports){
require('../../modules/es6.object.assign');
module.exports = require('../../modules/_core').Object.assign;
},{"../../modules/_core":22,"../../modules/es6.object.assign":76}],14:[function(require,module,exports){
require('../../modules/es6.symbol');
require('../../modules/es6.object.to-string');
module.exports = require('../../modules/_core').Symbol;
},{"../../modules/_core":22,"../../modules/es6.object.to-string":77,"../../modules/es6.symbol":79}],15:[function(require,module,exports){
require('../../modules/es6.string.iterator');
require('../../modules/web.dom.iterable');
module.exports = require('../../modules/_wks')('iterator');
},{"../../modules/_wks":71,"../../modules/es6.string.iterator":78,"../../modules/web.dom.iterable":80}],16:[function(require,module,exports){
module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};
},{}],17:[function(require,module,exports){
module.exports = function(){ /* empty */ };
},{}],18:[function(require,module,exports){
var isObject = require('./_is-object');
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};
},{"./_is-object":38}],19:[function(require,module,exports){
// false -> Array#indexOf
// true  -> Array#includes
var toIObject = require('./_to-iobject')
  , toLength  = require('./_to-length')
  , toIndex   = require('./_to-index');
module.exports = function(IS_INCLUDES){
  return function($this, el, fromIndex){
    var O      = toIObject($this)
      , length = toLength(O.length)
      , index  = toIndex(fromIndex, length)
      , value;
    // Array#includes uses SameValueZero equality algorithm
    if(IS_INCLUDES && el != el)while(length > index){
      value = O[index++];
      if(value != value)return true;
    // Array#toIndex ignores holes, Array#includes - not
    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
      if(O[index] === el)return IS_INCLUDES || index;
    } return !IS_INCLUDES && -1;
  };
};
},{"./_to-index":64,"./_to-iobject":66,"./_to-length":67}],20:[function(require,module,exports){
// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = require('./_cof')
  , TAG = require('./_wks')('toStringTag')
  // ES3 wrong here
  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function(it, key){
  try {
    return it[key];
  } catch(e){ /* empty */ }
};

module.exports = function(it){
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};
},{"./_cof":21,"./_wks":71}],21:[function(require,module,exports){
var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};
},{}],22:[function(require,module,exports){
var core = module.exports = {version: '2.2.1'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
},{}],23:[function(require,module,exports){
// optional / simple context binding
var aFunction = require('./_a-function');
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};
},{"./_a-function":16}],24:[function(require,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};
},{}],25:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./_fails":30}],26:[function(require,module,exports){
var isObject = require('./_is-object')
  , document = require('./_global').document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};
},{"./_global":31,"./_is-object":38}],27:[function(require,module,exports){
// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');
},{}],28:[function(require,module,exports){
// all enumerable object keys, includes symbols
var getKeys = require('./_object-keys')
  , gOPS    = require('./_object-gops')
  , pIE     = require('./_object-pie');
module.exports = function(it){
  var result     = getKeys(it)
    , getSymbols = gOPS.f;
  if(getSymbols){
    var symbols = getSymbols(it)
      , isEnum  = pIE.f
      , i       = 0
      , key;
    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))result.push(key);
  } return result;
};
},{"./_object-gops":53,"./_object-keys":56,"./_object-pie":57}],29:[function(require,module,exports){
var global    = require('./_global')
  , core      = require('./_core')
  , ctx       = require('./_ctx')
  , hide      = require('./_hide')
  , PROTOTYPE = 'prototype';

var $export = function(type, name, source){
  var IS_FORCED = type & $export.F
    , IS_GLOBAL = type & $export.G
    , IS_STATIC = type & $export.S
    , IS_PROTO  = type & $export.P
    , IS_BIND   = type & $export.B
    , IS_WRAP   = type & $export.W
    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
    , expProto  = exports[PROTOTYPE]
    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
    , key, own, out;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if(own && key in exports)continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function(C){
      var F = function(a, b, c){
        if(this instanceof C){
          switch(arguments.length){
            case 0: return new C;
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if(IS_PROTO){
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library` 
module.exports = $export;
},{"./_core":22,"./_ctx":23,"./_global":31,"./_hide":33}],30:[function(require,module,exports){
module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};
},{}],31:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
},{}],32:[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};
},{}],33:[function(require,module,exports){
var dP         = require('./_object-dp')
  , createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function(object, key, value){
  return dP.f(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};
},{"./_descriptors":25,"./_object-dp":48,"./_property-desc":58}],34:[function(require,module,exports){
module.exports = require('./_global').document && document.documentElement;
},{"./_global":31}],35:[function(require,module,exports){
module.exports = !require('./_descriptors') && !require('./_fails')(function(){
  return Object.defineProperty(require('./_dom-create')('div'), 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./_descriptors":25,"./_dom-create":26,"./_fails":30}],36:[function(require,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./_cof');
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};
},{"./_cof":21}],37:[function(require,module,exports){
// 7.2.2 IsArray(argument)
var cof = require('./_cof');
module.exports = Array.isArray || function isArray(arg){
  return cof(arg) == 'Array';
};
},{"./_cof":21}],38:[function(require,module,exports){
module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};
},{}],39:[function(require,module,exports){
'use strict';
var create         = require('./_object-create')
  , descriptor     = require('./_property-desc')
  , setToStringTag = require('./_set-to-string-tag')
  , IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
require('./_hide')(IteratorPrototype, require('./_wks')('iterator'), function(){ return this; });

module.exports = function(Constructor, NAME, next){
  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
  setToStringTag(Constructor, NAME + ' Iterator');
};
},{"./_hide":33,"./_object-create":47,"./_property-desc":58,"./_set-to-string-tag":60,"./_wks":71}],40:[function(require,module,exports){
'use strict';
var LIBRARY        = require('./_library')
  , $export        = require('./_export')
  , redefine       = require('./_redefine')
  , hide           = require('./_hide')
  , has            = require('./_has')
  , Iterators      = require('./_iterators')
  , $iterCreate    = require('./_iter-create')
  , setToStringTag = require('./_set-to-string-tag')
  , getPrototypeOf = require('./_object-gpo')
  , ITERATOR       = require('./_wks')('iterator')
  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
  , FF_ITERATOR    = '@@iterator'
  , KEYS           = 'keys'
  , VALUES         = 'values';

var returnThis = function(){ return this; };

module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
  $iterCreate(Constructor, NAME, next);
  var getMethod = function(kind){
    if(!BUGGY && kind in proto)return proto[kind];
    switch(kind){
      case KEYS: return function keys(){ return new Constructor(this, kind); };
      case VALUES: return function values(){ return new Constructor(this, kind); };
    } return function entries(){ return new Constructor(this, kind); };
  };
  var TAG        = NAME + ' Iterator'
    , DEF_VALUES = DEFAULT == VALUES
    , VALUES_BUG = false
    , proto      = Base.prototype
    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , $default   = $native || getMethod(DEFAULT)
    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
    , methods, key, IteratorPrototype;
  // Fix native
  if($anyNative){
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
    if(IteratorPrototype !== Object.prototype){
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if(DEF_VALUES && $native && $native.name !== VALUES){
    VALUES_BUG = true;
    $default = function values(){ return $native.call(this); };
  }
  // Define iterator
  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG]  = returnThis;
  if(DEFAULT){
    methods = {
      values:  DEF_VALUES ? $default : getMethod(VALUES),
      keys:    IS_SET     ? $default : getMethod(KEYS),
      entries: $entries
    };
    if(FORCED)for(key in methods){
      if(!(key in proto))redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};
},{"./_export":29,"./_has":32,"./_hide":33,"./_iter-create":39,"./_iterators":42,"./_library":44,"./_object-gpo":54,"./_redefine":59,"./_set-to-string-tag":60,"./_wks":71}],41:[function(require,module,exports){
module.exports = function(done, value){
  return {value: value, done: !!done};
};
},{}],42:[function(require,module,exports){
module.exports = {};
},{}],43:[function(require,module,exports){
var getKeys   = require('./_object-keys')
  , toIObject = require('./_to-iobject');
module.exports = function(object, el){
  var O      = toIObject(object)
    , keys   = getKeys(O)
    , length = keys.length
    , index  = 0
    , key;
  while(length > index)if(O[key = keys[index++]] === el)return key;
};
},{"./_object-keys":56,"./_to-iobject":66}],44:[function(require,module,exports){
module.exports = true;
},{}],45:[function(require,module,exports){
var META     = require('./_uid')('meta')
  , isObject = require('./_is-object')
  , has      = require('./_has')
  , setDesc  = require('./_object-dp').f
  , id       = 0;
var isExtensible = Object.isExtensible || function(){
  return true;
};
var FREEZE = !require('./_fails')(function(){
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function(it){
  setDesc(it, META, {value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  }});
};
var fastKey = function(it, create){
  // return primitive with prefix
  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return 'F';
    // not necessary to add metadata
    if(!create)return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function(it, create){
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return true;
    // not necessary to add metadata
    if(!create)return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function(it){
  if(FREEZE && meta.NEED && isExtensible(it) && !has(it, META))setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY:      META,
  NEED:     false,
  fastKey:  fastKey,
  getWeak:  getWeak,
  onFreeze: onFreeze
};
},{"./_fails":30,"./_has":32,"./_is-object":38,"./_object-dp":48,"./_uid":70}],46:[function(require,module,exports){
'use strict';
// 19.1.2.1 Object.assign(target, source, ...)
var getKeys  = require('./_object-keys')
  , gOPS     = require('./_object-gops')
  , pIE      = require('./_object-pie')
  , toObject = require('./_to-object')
  , IObject  = require('./_iobject')
  , $assign  = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || require('./_fails')(function(){
  var A = {}
    , B = {}
    , S = Symbol()
    , K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function(k){ B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
  var T     = toObject(target)
    , aLen  = arguments.length
    , index = 1
    , getSymbols = gOPS.f
    , isEnum     = pIE.f;
  while(aLen > index){
    var S      = IObject(arguments[index++])
      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
      , length = keys.length
      , j      = 0
      , key;
    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
  } return T;
} : $assign;
},{"./_fails":30,"./_iobject":36,"./_object-gops":53,"./_object-keys":56,"./_object-pie":57,"./_to-object":68}],47:[function(require,module,exports){
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject    = require('./_an-object')
  , dPs         = require('./_object-dps')
  , enumBugKeys = require('./_enum-bug-keys')
  , IE_PROTO    = require('./_shared-key')('IE_PROTO')
  , Empty       = function(){ /* empty */ }
  , PROTOTYPE   = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function(){
  // Thrash, waste and sodomy: IE GC bug
  var iframe = require('./_dom-create')('iframe')
    , i      = enumBugKeys.length
    , gt     = '>'
    , iframeDocument;
  iframe.style.display = 'none';
  require('./_html').appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write('<script>document.F=Object</script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties){
  var result;
  if(O !== null){
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty;
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};
},{"./_an-object":18,"./_dom-create":26,"./_enum-bug-keys":27,"./_html":34,"./_object-dps":49,"./_shared-key":61}],48:[function(require,module,exports){
var anObject       = require('./_an-object')
  , IE8_DOM_DEFINE = require('./_ie8-dom-define')
  , toPrimitive    = require('./_to-primitive')
  , dP             = Object.defineProperty;

exports.f = require('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes){
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if(IE8_DOM_DEFINE)try {
    return dP(O, P, Attributes);
  } catch(e){ /* empty */ }
  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
  if('value' in Attributes)O[P] = Attributes.value;
  return O;
};
},{"./_an-object":18,"./_descriptors":25,"./_ie8-dom-define":35,"./_to-primitive":69}],49:[function(require,module,exports){
var dP       = require('./_object-dp')
  , anObject = require('./_an-object')
  , getKeys  = require('./_object-keys');

module.exports = require('./_descriptors') ? Object.defineProperties : function defineProperties(O, Properties){
  anObject(O);
  var keys   = getKeys(Properties)
    , length = keys.length
    , i = 0
    , P;
  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
  return O;
};
},{"./_an-object":18,"./_descriptors":25,"./_object-dp":48,"./_object-keys":56}],50:[function(require,module,exports){
var pIE            = require('./_object-pie')
  , createDesc     = require('./_property-desc')
  , toIObject      = require('./_to-iobject')
  , toPrimitive    = require('./_to-primitive')
  , has            = require('./_has')
  , IE8_DOM_DEFINE = require('./_ie8-dom-define')
  , gOPD           = Object.getOwnPropertyDescriptor;

exports.f = require('./_descriptors') ? gOPD : function getOwnPropertyDescriptor(O, P){
  O = toIObject(O);
  P = toPrimitive(P, true);
  if(IE8_DOM_DEFINE)try {
    return gOPD(O, P);
  } catch(e){ /* empty */ }
  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
};
},{"./_descriptors":25,"./_has":32,"./_ie8-dom-define":35,"./_object-pie":57,"./_property-desc":58,"./_to-iobject":66,"./_to-primitive":69}],51:[function(require,module,exports){
// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = require('./_to-iobject')
  , gOPN      = require('./_object-gopn').f
  , toString  = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function(it){
  try {
    return gOPN(it);
  } catch(e){
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it){
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};

},{"./_object-gopn":52,"./_to-iobject":66}],52:[function(require,module,exports){
// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys      = require('./_object-keys-internal')
  , hiddenKeys = require('./_enum-bug-keys').concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
  return $keys(O, hiddenKeys);
};
},{"./_enum-bug-keys":27,"./_object-keys-internal":55}],53:[function(require,module,exports){
exports.f = Object.getOwnPropertySymbols;
},{}],54:[function(require,module,exports){
// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has         = require('./_has')
  , toObject    = require('./_to-object')
  , IE_PROTO    = require('./_shared-key')('IE_PROTO')
  , ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function(O){
  O = toObject(O);
  if(has(O, IE_PROTO))return O[IE_PROTO];
  if(typeof O.constructor == 'function' && O instanceof O.constructor){
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};
},{"./_has":32,"./_shared-key":61,"./_to-object":68}],55:[function(require,module,exports){
var has          = require('./_has')
  , toIObject    = require('./_to-iobject')
  , arrayIndexOf = require('./_array-includes')(false)
  , IE_PROTO     = require('./_shared-key')('IE_PROTO');

module.exports = function(object, names){
  var O      = toIObject(object)
    , i      = 0
    , result = []
    , key;
  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while(names.length > i)if(has(O, key = names[i++])){
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};
},{"./_array-includes":19,"./_has":32,"./_shared-key":61,"./_to-iobject":66}],56:[function(require,module,exports){
// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys       = require('./_object-keys-internal')
  , enumBugKeys = require('./_enum-bug-keys');

module.exports = Object.keys || function keys(O){
  return $keys(O, enumBugKeys);
};
},{"./_enum-bug-keys":27,"./_object-keys-internal":55}],57:[function(require,module,exports){
exports.f = {}.propertyIsEnumerable;
},{}],58:[function(require,module,exports){
module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};
},{}],59:[function(require,module,exports){
module.exports = require('./_hide');
},{"./_hide":33}],60:[function(require,module,exports){
var def = require('./_object-dp').f
  , has = require('./_has')
  , TAG = require('./_wks')('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};
},{"./_has":32,"./_object-dp":48,"./_wks":71}],61:[function(require,module,exports){
var shared = require('./_shared')('keys')
  , uid    = require('./_uid');
module.exports = function(key){
  return shared[key] || (shared[key] = uid(key));
};
},{"./_shared":62,"./_uid":70}],62:[function(require,module,exports){
var global = require('./_global')
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};
},{"./_global":31}],63:[function(require,module,exports){
var toInteger = require('./_to-integer')
  , defined   = require('./_defined');
// true  -> String#at
// false -> String#codePointAt
module.exports = function(TO_STRING){
  return function(that, pos){
    var s = String(defined(that))
      , i = toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};
},{"./_defined":24,"./_to-integer":65}],64:[function(require,module,exports){
var toInteger = require('./_to-integer')
  , max       = Math.max
  , min       = Math.min;
module.exports = function(index, length){
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};
},{"./_to-integer":65}],65:[function(require,module,exports){
// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};
},{}],66:[function(require,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./_iobject')
  , defined = require('./_defined');
module.exports = function(it){
  return IObject(defined(it));
};
},{"./_defined":24,"./_iobject":36}],67:[function(require,module,exports){
// 7.1.15 ToLength
var toInteger = require('./_to-integer')
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};
},{"./_to-integer":65}],68:[function(require,module,exports){
// 7.1.13 ToObject(argument)
var defined = require('./_defined');
module.exports = function(it){
  return Object(defined(it));
};
},{"./_defined":24}],69:[function(require,module,exports){
// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require('./_is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function(it, S){
  if(!isObject(it))return it;
  var fn, val;
  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  throw TypeError("Can't convert object to primitive value");
};
},{"./_is-object":38}],70:[function(require,module,exports){
var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};
},{}],71:[function(require,module,exports){
var store      = require('./_shared')('wks')
  , uid        = require('./_uid')
  , Symbol     = require('./_global').Symbol
  , USE_SYMBOL = typeof Symbol == 'function';
module.exports = function(name){
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};
},{"./_global":31,"./_shared":62,"./_uid":70}],72:[function(require,module,exports){
var classof   = require('./_classof')
  , ITERATOR  = require('./_wks')('iterator')
  , Iterators = require('./_iterators');
module.exports = require('./_core').getIteratorMethod = function(it){
  if(it != undefined)return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};
},{"./_classof":20,"./_core":22,"./_iterators":42,"./_wks":71}],73:[function(require,module,exports){
var anObject = require('./_an-object')
  , get      = require('./core.get-iterator-method');
module.exports = require('./_core').getIterator = function(it){
  var iterFn = get(it);
  if(typeof iterFn != 'function')throw TypeError(it + ' is not iterable!');
  return anObject(iterFn.call(it));
};
},{"./_an-object":18,"./_core":22,"./core.get-iterator-method":72}],74:[function(require,module,exports){
var classof   = require('./_classof')
  , ITERATOR  = require('./_wks')('iterator')
  , Iterators = require('./_iterators');
module.exports = require('./_core').isIterable = function(it){
  var O = Object(it);
  return O[ITERATOR] !== undefined
    || '@@iterator' in O
    || Iterators.hasOwnProperty(classof(O));
};
},{"./_classof":20,"./_core":22,"./_iterators":42,"./_wks":71}],75:[function(require,module,exports){
'use strict';
var addToUnscopables = require('./_add-to-unscopables')
  , step             = require('./_iter-step')
  , Iterators        = require('./_iterators')
  , toIObject        = require('./_to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = require('./_iter-define')(Array, 'Array', function(iterated, kind){
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , kind  = this._k
    , index = this._i++;
  if(!O || index >= O.length){
    this._t = undefined;
    return step(1);
  }
  if(kind == 'keys'  )return step(0, index);
  if(kind == 'values')return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');
},{"./_add-to-unscopables":17,"./_iter-define":40,"./_iter-step":41,"./_iterators":42,"./_to-iobject":66}],76:[function(require,module,exports){
// 19.1.3.1 Object.assign(target, source)
var $export = require('./_export');

$export($export.S + $export.F, 'Object', {assign: require('./_object-assign')});
},{"./_export":29,"./_object-assign":46}],77:[function(require,module,exports){

},{}],78:[function(require,module,exports){
'use strict';
var $at  = require('./_string-at')(true);

// 21.1.3.27 String.prototype[@@iterator]()
require('./_iter-define')(String, 'String', function(iterated){
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , index = this._i
    , point;
  if(index >= O.length)return {value: undefined, done: true};
  point = $at(O, index);
  this._i += point.length;
  return {value: point, done: false};
});
},{"./_iter-define":40,"./_string-at":63}],79:[function(require,module,exports){
'use strict';
// ECMAScript 6 symbols shim
var global         = require('./_global')
  , core           = require('./_core')
  , has            = require('./_has')
  , DESCRIPTORS    = require('./_descriptors')
  , $export        = require('./_export')
  , redefine       = require('./_redefine')
  , META           = require('./_meta').KEY
  , $fails         = require('./_fails')
  , shared         = require('./_shared')
  , setToStringTag = require('./_set-to-string-tag')
  , uid            = require('./_uid')
  , wks            = require('./_wks')
  , keyOf          = require('./_keyof')
  , enumKeys       = require('./_enum-keys')
  , isArray        = require('./_is-array')
  , anObject       = require('./_an-object')
  , toIObject      = require('./_to-iobject')
  , toPrimitive    = require('./_to-primitive')
  , createDesc     = require('./_property-desc')
  , _create        = require('./_object-create')
  , gOPNExt        = require('./_object-gopn-ext')
  , $GOPD          = require('./_object-gopd')
  , $DP            = require('./_object-dp')
  , gOPD           = $GOPD.f
  , dP             = $DP.f
  , gOPN           = gOPNExt.f
  , $Symbol        = global.Symbol
  , $JSON          = global.JSON
  , _stringify     = $JSON && $JSON.stringify
  , setter         = false
  , PROTOTYPE      = 'prototype'
  , HIDDEN         = wks('_hidden')
  , TO_PRIMITIVE   = wks('toPrimitive')
  , isEnum         = {}.propertyIsEnumerable
  , SymbolRegistry = shared('symbol-registry')
  , AllSymbols     = shared('symbols')
  , ObjectProto    = Object[PROTOTYPE]
  , USE_NATIVE     = typeof $Symbol == 'function'
  , QObject        = global.QObject;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function(){
  return _create(dP({}, 'a', {
    get: function(){ return dP(this, 'a', {value: 7}).a; }
  })).a != 7;
}) ? function(it, key, D){
  var protoDesc = gOPD(ObjectProto, key);
  if(protoDesc)delete ObjectProto[key];
  dP(it, key, D);
  if(protoDesc && it !== ObjectProto)dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function(tag){
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  DESCRIPTORS && setter && setSymbolDesc(ObjectProto, tag, {
    configurable: true,
    set: function(value){
      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    }
  });
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function(it){
  return typeof it == 'symbol';
} : function(it){
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D){
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if(has(AllSymbols, key)){
    if(!D.enumerable){
      if(!has(it, HIDDEN))dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
      D = _create(D, {enumerable: createDesc(0, false)});
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P){
  anObject(it);
  var keys = enumKeys(P = toIObject(P))
    , i    = 0
    , l = keys.length
    , key;
  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P){
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key){
  var E = isEnum.call(this, key = toPrimitive(key, true));
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
  var D = gOPD(it = toIObject(it), key = toPrimitive(key, true));
  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it){
  var names  = gOPN(toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i)if(!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META)result.push(key);
  return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
  var names  = gOPN(toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i)if(has(AllSymbols, key = names[i++]))result.push(AllSymbols[key]);
  return result;
};
var $stringify = function stringify(it){
  if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
  var args = [it]
    , i    = 1
    , replacer, $replacer;
  while(arguments.length > i)args.push(arguments[i++]);
  replacer = args[1];
  if(typeof replacer == 'function')$replacer = replacer;
  if($replacer || !isArray(replacer))replacer = function(key, value){
    if($replacer)value = $replacer.call(this, key, value);
    if(!isSymbol(value))return value;
  };
  args[1] = replacer;
  return _stringify.apply($JSON, args);
};
var BUGGY_JSON = $fails(function(){
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
});

// 19.4.1.1 Symbol([description])
if(!USE_NATIVE){
  $Symbol = function Symbol(){
    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor!');
    return wrap(uid(arguments.length > 0 ? arguments[0] : undefined));
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString(){
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f   = $defineProperty;
  require('./_object-gopn').f = gOPNExt.f = $getOwnPropertyNames;
  require('./_object-pie').f  = $propertyIsEnumerable
  require('./_object-gops').f = $getOwnPropertySymbols;

  if(DESCRIPTORS && !require('./_library')){
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, {Symbol: $Symbol});

// 19.4.2.2 Symbol.hasInstance
// 19.4.2.3 Symbol.isConcatSpreadable
// 19.4.2.4 Symbol.iterator
// 19.4.2.6 Symbol.match
// 19.4.2.8 Symbol.replace
// 19.4.2.9 Symbol.search
// 19.4.2.10 Symbol.species
// 19.4.2.11 Symbol.split
// 19.4.2.12 Symbol.toPrimitive
// 19.4.2.13 Symbol.toStringTag
// 19.4.2.14 Symbol.unscopables
for(var symbols = (
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), i = 0; symbols.length > i; ){
  var key     = symbols[i++]
    , Wrapper = core.Symbol
    , sym     = wks(key);
  if(!(key in Wrapper))dP(Wrapper, key, {value: USE_NATIVE ? sym : wrap(sym)});
};

// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
if(!QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild)setter = true;

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function(key){
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(key){
    if(isSymbol(key))return keyOf(SymbolRegistry, key);
    throw TypeError(key + ' is not a symbol!');
  },
  useSetter: function(){ setter = true; },
  useSimple: function(){ setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || BUGGY_JSON), 'JSON', {stringify: $stringify});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || require('./_hide')($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);
},{"./_an-object":18,"./_core":22,"./_descriptors":25,"./_enum-keys":28,"./_export":29,"./_fails":30,"./_global":31,"./_has":32,"./_hide":33,"./_is-array":37,"./_keyof":43,"./_library":44,"./_meta":45,"./_object-create":47,"./_object-dp":48,"./_object-gopd":50,"./_object-gopn":52,"./_object-gopn-ext":51,"./_object-gops":53,"./_object-pie":57,"./_property-desc":58,"./_redefine":59,"./_set-to-string-tag":60,"./_shared":62,"./_to-iobject":66,"./_to-primitive":69,"./_uid":70,"./_wks":71}],80:[function(require,module,exports){
require('./es6.array.iterator');
var global        = require('./_global')
  , hide          = require('./_hide')
  , Iterators     = require('./_iterators')
  , TO_STRING_TAG = require('./_wks')('toStringTag');

for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
  var NAME       = collections[i]
    , Collection = global[NAME]
    , proto      = Collection && Collection.prototype;
  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}
},{"./_global":31,"./_hide":33,"./_iterators":42,"./_wks":71,"./es6.array.iterator":75}],81:[function(require,module,exports){
/**
 * @module matrixmath/Matrix
 */
'use strict';

var arrays = require('./arrays');

/**
 * @classdesc A class for representing and working with a mathematical matrix.
 *
 * @property {number} rows Number of rows.
 * @property {number} cols Number of cols.
 * @property {number} length Number of values.
 *
 * @constructor
 *
 * @param {number=} opt_rows The number of rows for the matrix. Default is 0.
 * @param {number=} opt_cols The number of columns for the matrix. Default is same
 *     amount of columns as rows.
 * @param {boolean=} opt_setInitial Whether to set the initial data when created.
 *     The initial data will be set to the identity matrix if it specifies the same
 *     amount of rows as columns. Default is true.
 *
 * @example
 * // Create a 3x3 matrix with data
 * var matrix = new Matrix(3, 3);
 * matrix.setData(
 *   1, 0, 0,
 *   0, 1, 0,
 *   0, 0, 1
 * );
 *
 * // Create a matrix filled with zeros
 * // The matrix will be 3 rows and 2 columns
 * var matrix = new Matrix(3, 2);
 *
 * // Create an identity matrix
 * // The matrix will be 3 rows and 3 columns
 * var matrix = new Matrix(3);
 *
 * // Create a matrix with no data set
 * // The matrix will be 3 rows and 3 columns
 * var matrix = new Matrix(3, 3, false);
 */
function Matrix(opt_rows, opt_cols, opt_setInitial) {
  this.rows = opt_rows || 0;
  this.cols = opt_cols || this.rows;
  this.length = this.rows * this.cols;
  this._cache = null;

  var setInitial = opt_setInitial === undefined ? true : opt_setInitial;

  if (setInitial) {
    if (this.rows === this.cols) {
      this.setIdentityData();
    } else {
      this.setEmptyData();
    }
  }
}

/**
 * Add matrices together and return a new matrix.
 * It will clone the first matrix and add to that.
 *
 * @param {...Matrix} var_args At least two Matrix instances as
 *     multiple arguments.
 *
 * @return {Matrix} A new matrix for the result.
 */
Matrix.add = function(var_args) {
  var matrices = Array.prototype.slice.call(arguments);
  var firstMatrix = matrices.shift();

  var outputMatrix = firstMatrix.clone();
  outputMatrix.add.apply(outputMatrix, matrices);

  return outputMatrix;
};

/**
 * Subtract matrices and return a new matrix.
 * It will clone the first matrix and subtract from that.
 *
 * @param {...Matrix} var_args At least two Matrix instances as
 *     multiple arguments.
 *
 * @return {Matrix} A new matrix for the result.
 */
Matrix.subtract = function(var_args) {
  var matrices = Array.prototype.slice.call(arguments);
  var firstMatrix = matrices.shift();

  var outputMatrix = firstMatrix.clone();
  outputMatrix.subtract.apply(outputMatrix, matrices);

  return outputMatrix;
};

/**
 * Multiply matrices and return a new matrix.
 * It will clone the first matrix and multiply that.
 *
 * @param {...Matrix} var_args At least two Matrix instances as
 *     multiple arguments.
 *
 * @return {Matrix} A new matrix for the result.
 */
Matrix.multiply = function(var_args) {
  var matrices = Array.prototype.slice.call(arguments);
  var firstMatrix = matrices.shift();

  var outputMatrix = firstMatrix.clone();
  outputMatrix.multiply.apply(outputMatrix, matrices);

  return outputMatrix;
};

/**
 * Divide matrices and return a new matrix.
 * It will clone the first matrix and divide that.
 *
 * @param {...Matrix} var_args At least two Matrix instances as
 *     multiple arguments.
 *
 * @return {Matrix} A new matrix for the result.
 */
Matrix.divide = function(var_args) {
  var matrices = Array.prototype.slice.call(arguments);
  var firstMatrix = matrices.shift();

  var outputMatrix = firstMatrix.clone();
  outputMatrix.divide.apply(outputMatrix, matrices);

  return outputMatrix;
};

/**
 * Set the data for this matrix to be only zeros.
 *
 * @return {Matrix} This Matrix instance.
 */
Matrix.prototype.setEmptyData = function() {
  for (var i = 0, l = this.length; i < l; i++) {
    this[i] = 0;
  }

  return this;
};

/**
 * Set the data for this matrix to the identity data.
 *
 * @return {Matrix} This Matrix instance.
 */
Matrix.prototype.setIdentityData = function() {
  for (var i = 0, l = this.length; i < l; i++) {
    this[i] = i % (this.cols + 1) ? 0 : 1;
  }

  return this;
};

/**
 * Set the data for this matrix.
 *
 * @param {Array.<number>} data An array of values (numbers). Alternatively,
 *     the data can be provided as separate arguments, but if so, the size
 *     must match the current size.
 * @param {number=} opt_rows Number of rows in the new data. If not provided,
 *     the data must match the size of the previous data.
 * @param {number=} opt_cols Number of columns in the new data. If not provided,
 *     the data must match the size of the previous data.
 *
 * @return {Matrix} This Matrix instance.
 */
Matrix.prototype.setData = function(data, opt_rows, opt_cols) {
  var i, l;
  var isArray = Array.isArray(data);
  var rows = opt_rows;
  var cols = opt_cols;

  if (!isArray) {
    data = arguments;
    rows = undefined;
    cols = undefined;
  }

  // If the number of values is different than before, and there was no hint
  // provided for the size of the new matrix data, we can't modify the data
  // safely, so we do nothing.
  if (data.length !== this.length) {
    if (rows === undefined || cols === undefined) {
      return this;
    } else if (rows * cols !== data.length) {
      return this;
    }
  }

  // Clean out previous data
  for (i = data.length, l = this.length; i < l; i++) {
    delete this[i];
  }

  // Set new data
  for (i = 0, l = data.length; i < l; i++) {
    this[i] = data[i];
  }

  // Set new metadata
  this.length = data.length;
  this.rows = rows || this.rows;
  this.cols = cols || this.cols;

  return this;
};

/**
 * Get the data for this matrix as an array of numbers, with additional data
 * properties for rows and columns counts.
 *
 * @return {Array} An array of numbers, representing the data of the matrix.
 */
Matrix.prototype.getData = function() {
  return getData(this, new Array(this.length));
};

/**
 * Get the data for this matrix as a regular array.
 *
 * @return {Array} An array of numbers.
 */
Matrix.prototype.toArray = function() {
  return toArray(this, new Array(this.length));
};

/**
 * Get the data for this matrix as a formatted string, which is useful for
 * logging and debugging. It will be formatted with line breaks to visualize
 * the rows and columns.
 *
 * @param {number|string=} opt_indentation Optional argument to control
 *     indentation in the output string. If set to a number, the indentation
 *     will be that many spaces wide. If it is a string, the indentation will be
 *     this string. It will default to two spaces.
 * @param {string=} opt_separator Optional argument to control what separates
 *     the values in the output string. It will default to two spaces.
 * @param {string=} opt_start String to start the output with. Default is '['.
 * @param {string=} opt_end String to end the output with. Default is ']'.
 *
 * @return {string} A string representation of the data.
 */
Matrix.prototype.toLogString = function(opt_indentation, opt_separator, opt_start, opt_end) {
  var array = this.toArray();

  var beginning;
  var sep;

  var separator = typeof opt_separator === 'string' ? opt_separator : '  ';
  var indentation = '  ';

  if (typeof opt_indentation === 'number') {
    indentation = (new Array(Math.max(0, opt_indentation) + 1)).join(' ');
  } else if (typeof opt_indentation === 'string') {
    indentation = opt_indentation;
  }

  var start = typeof opt_start === 'string' ? opt_start : '[';
  var end = typeof opt_end === 'string' ? opt_end : ']';

  var string = start;
  for (var i = 0, l = array.length; i < l; i++) {
    beginning = i % this.cols === 0 ? '\n' + indentation : '';
    sep = i % this.cols === this.cols - 1 ? '' : separator;
    string += beginning + array[i] + sep;
  }
  string += '\n' + end;

  return string;
};

/**
 * Copy data from the input matrix to this matrix.
 *
 * @param {Matrix} matrix Input matrix to copy from.
 *
 * @return {Matrix} This Matrix instance.
 */
Matrix.prototype.copy = function(matrix) {
  var i, l;

  // If the input matrix is smaller, clear out the values not needed anymore
  if (matrix.length < this.length) {
    for (i = matrix.length, l = this.length; i < l; i++) {
      delete this[i];
    }
  }

  // Set new metadata if the matrices are of different size
  if (matrix.length !== this.length) {
    this.length = matrix.length;
    this.rows = matrix.rows;
    this.cols = matrix.cols;
  }

  // Copy the data from the input matrix to this matrix
  for (i = 0, l = this.length; i < l; i++) {
    this[i] = matrix[i];
  }

  return this;
};

/**
 * Clone this matrix to a new instance.
 *
 * @return {Matrix} A new matrix for the result.
 */
Matrix.prototype.clone = function() {
  return new Matrix(this.rows, this.cols, false).copy(this);
};

/**
 * Add matrices together into this matrix.
 *
 * @param {...Matrix} var_args At least one Matrix instance. If many,
 *     use multiple arguments.
 *
 * @return {Matrix} This Matrix instance.
 */
Matrix.prototype.add = function(var_args) {
  var matrices = arguments;

  var numValues = this.length;

  // Loop through all the matrices passed to the method
  for (var i = 0, l = matrices.length; i < l; i++) {
    var matrix = matrices[i];

    // The size of the matrices must match
    if (matrix.cols !== this.cols || matrix.rows !== this.rows) {
      continue;
    }

    // Loop through all values
    for (var n = 0; n < numValues; n++) {

      // Add the number in that position
      this[n] += matrix[n];
    }
  }

  return this;
};

/**
 * Subtract matrices from this matrix.
 *
 * @param {...Matrix} var_args At least one Matrix instance. If many,
 *     use multiple arguments.
 *
 * @return {Matrix} This Matrix instance.
 */
Matrix.prototype.subtract = function(var_args) {
  var matrices = arguments;

  var numValues = this.length;

  // Loop through all the matrices passed to the method
  for (var i = 0, l = matrices.length; i < l; i++) {
    var matrix = matrices[i];

    // The size of the matrices must match
    if (matrix.cols !== this.cols || matrix.rows !== this.rows) {
      continue;
    }

    // Loop through all values
    for (var n = 0; n < numValues; n++) {

      // Subtract the number in that position
      this[n] -= matrix[n];
    }
  }

  return this;
};

/**
 * Multiply matrices into this matrix.
 *
 * @param {...Matrix|number} var_args At least one Matrix instance or a number.
 *     If many, use multiple arguments. If a number, it will make a scalar
 *     multiplication.
 *
 * @return {Matrix} This Matrix instance.
 */
Matrix.prototype.multiply = function(var_args) {
  var matrices = arguments;
  var startIndex = 0;

  // If this matrix is an identity matrix, multiplying it with anything will
  // just result in this matrix having the exact same data as the matrix to
  // multiply by. We can avoid one step of multiplication if we make a shortcut
  // and just copy the data from the next matrix.
  if (this.isIdentity()) {
    var next;
    while ((next = matrices[startIndex]) !== undefined) {

      // If a number was found, we must break out and start the multiplication
      // with this number. Special case is the number 1 though, as that will
      // result in the same as well.
      if (typeof next === 'number') {
        if (next === 1) {
          startIndex++;
          continue;
        } else {
          break;
        }
      }

      // If a matrix was found, we can safely skip the matrix (either it's an
      // identity matrix and we'll continue looking for a matrix that isn't an
      // identity matrix, or it's not an identity matrix and we'll just copy
      // its data and start multiplying by the next matrix in line).
      startIndex++;
      if (!next.isIdentity()) break;
    }

    // No matrix was found in line, meaning we are only dealing with identity
    // matrices, so it's fine to bail out early, as it will just result in an
    // identity matrix.
    if (!next) return this;

    // If we did find a matrix, we will copy the data from that matrix into this
    // one and start multiplying by the next matrix in line.
    if (typeof next !== 'number') {
      this.copy(next);
    }
  }

  var newRows = getData(this, arrays.getWithLength(this.length));

  // Loop through all the matrices passed to the method
  for (var i = startIndex, l = matrices.length; i < l; i++) {
    var matrix = matrices[i];

    // Get the number of rows and columns for the target matrix
    var rowsInTarget = newRows.rows;
    var colsInTarget = newRows.cols;
    var numValuesInTarget = newRows.length;

    // A number means we should do a scalar multiplication.
    if (typeof matrix === 'number') {
      var scale = matrix;
      var factor = 1 / scale; // Used to not get floating point errors

      // Loop through all values
      for (var n = 0; n < numValuesInTarget; n++) {

        // Multiply the number in that position
        newRows[n] = newRows[n] * (scale * factor) / factor;
      }

      // Break this iteration here and continue with next matrix
      continue;
    }

    // Multiplying with an identity matrix will not make any changes
    if (matrix.isIdentity()) continue;

    // Get the number of rows and columns for the current matrix
    var rowsInCurrent = matrix.rows;
    var colsInCurrent = matrix.cols;

    // The number of rows must match the number of columns in the first matrix
    if (colsInTarget !== rowsInCurrent) {
      continue;
    }

    // Create a temporary data array.
    // This will be used to store values in while reading from newRows.
    var tempData = arrays.getWithLength(newRows.rows * matrix.cols);
    tempData.rows = newRows.rows;
    tempData.cols = matrix.cols;

    // Loop through each row from the first matrix
    for (var row = 0; row < rowsInTarget; row++) {

      // For each row, loop through all columns in second matrix
      for (var currentCol = 0; currentCol < colsInCurrent; currentCol++) {

        // For each column, loop through each row in the second matrix
        for (var currentRow = 0; currentRow < rowsInCurrent; currentRow++) {
          var outputIndex = row * tempData.cols + currentCol;

          // Create initial values when they don't exist
          if (!tempData[outputIndex]) tempData[outputIndex] = 0;

          // Calculate the product of the number at the current position in the first matrix
          // and the current position in the second matrix. Add the product to the previous
          // value at the current position in the output data array.
          tempData[outputIndex] += newRows[row * newRows.cols + currentRow] * matrix[currentRow * matrix.cols + currentCol];
        }
      }
    }
    arrays.giveBack(newRows);

    // Save the temporary data array in newRows, so that the next matrix can be applied
    // to the output of this iteration instead of the original data.
    newRows = tempData;
  }

  // Set the new data for this Matrix instance
  this.setData(newRows, newRows.rows, newRows.cols);

  arrays.giveBack(newRows);

  return this;
};

/**
 * Divide matrices from this matrix.
 * The matrices must be square.
 *
 * @param {...Matrix} var_args At least one Matrix instance. If many,
 *     use multiple arguments.
 *
 * @return {Matrix} This Matrix instance.
 */
Matrix.prototype.divide = function(var_args) {
  var matrices = Array.prototype.slice.call(arguments);

  // Loop through all the matrices passed to the method
  for (var i = 0, l = matrices.length; i < l; i++) {
    var matrix = matrices[i];

    // The matrix must be square. If it's not, remove the
    // matrix from the list.
    if (matrix.rows !== matrix.cols) {
      matrices.splice(i, 1);
      i--; l--;
      continue;
    }

    // To divide matrices, you multiply by the inverse.
    // So we first store the inverse of all matrices.
    matrices[i] = matrix.clone().invert();
  }

  // Multiply this matrix with the inverse of all the other matrices
  this.multiply.apply(this, matrices);

  return this;
};

/**
 * Raise the matrix to a given power.
 *
 * @param {number} power The power to raise it to.
 *
 * @return {Matrix} This Matrix instance.
 */
Matrix.prototype.power = function(power) {

  // Matrices that are not square can't be raised
  if (this.rows !== this.cols) {
    return this;
  }

  var matrices = new Array(power - 1);
  for (var i = 0, l = matrices.length; i < l; i++) {
    matrices[i] = this.clone();
  }

  this.multiply.apply(this, matrices);

  return this;
};

/**
 * Transpose the matrix.
 *
 * @return {Matrix} This Matrix instance.
 */
Matrix.prototype.transpose = function() {
  var numRows = this.rows;
  var numCols = this.cols;

  var newData = arrays.getWithLength(this.length);

  for (var row = 0; row < numRows; row++) {
    for (var col = 0; col < numCols; col++) {
      newData[col * numRows + row] = this[row * numCols + col];
    }
  }
  this.setData(newData, numCols, numRows);

  arrays.giveBack(newData);

  return this;
};

/**
 * Invert the matrix.
 * This only works if it is a square matrix. If it is not,
 * the matrix will stay the same.
 * For this to work, the determinant of the matrix must not
 * be zero. If it is, the matrix will stay the same.
 *
 * @return {Matrix} This Matrix instance.
 */
Matrix.prototype.invert = function() {
  var numRows = this.rows;
  var numCols = this.cols;

  // The matrix must be square
  if (numRows !== numCols) return this;

  // Simple solution for 2x2 matrices
  if (numRows === 2) {
    var determinant = this.getDeterminant();
    if (determinant === 0) return this;

    var invertedDeterminant = 1 / determinant;
    var m0 = invertedDeterminant * this[3];
    var m1 = invertedDeterminant * -this[1];
    var m2 = invertedDeterminant * -this[2];
    var m3 = invertedDeterminant * this[0];
    this[0] = m0;
    this[1] = m1;
    this[2] = m2;
    this[3] = m3;

    return this;
  }

  // By using a cache, only the first call to invert will cause a memory increase.
  var cache = this._cache || (this._cache = {});
  var matrixOfCoFactors = cache.matrixOfCoFactors || (cache.matrixOfCoFactors = new Matrix(numRows, numCols, false));
  var matrix = cache.tempMatrix || (cache.tempMatrix = new Matrix(this.rows, this.cols, false));

  // Loop through each number in the matrix
  var i = 0;
  for (var row = 0; row < numRows; row++) {
    for (var col = 0; col < numCols; col++) {

      // We need to get a temporary copy of the matrix data in an array
      var newData = arrays.getWithLength(this.length);
      for (var d = this.length; d--;) {
        newData[d] = this[d];
      }

      // We need to get the determinant of the matrix made by the area
      // that is not in the current number's row or column. To do this,
      // we remove the first row and the column where the number is.
      removeRow(newData, row, this.cols);
      removeColumn(newData, col, this.cols);
      matrix.setData(newData, this.rows - 1, this.cols - 1);

      // We're now done with the temporary copy of the matrix data
      arrays.giveBack(newData);

      // Some of the determinants need to change sign to become the cofactor.
      // This is applied as a checkerboard to the matrix.
      var coFactor = matrix.getDeterminant();
      var rowAlternate = row % 2 === 1;
      var colAlternate = col % 2 === 1;
      if ((rowAlternate && !colAlternate) || (colAlternate && !rowAlternate)) {
        coFactor *= -1;
      }

      // Set the cofactor in the correct position in the matrix of cofactors.
      matrixOfCoFactors[row * matrixOfCoFactors.cols + col] = coFactor;

      i++;
    }
  }

  // Get the determinant of the original matrix.
  // This could be done with the getDeterminant method, but this is faster.
  var originalDeterminant = 0;
  for (var n = 0; n < numCols; n++) {
    originalDeterminant += this[n] * matrixOfCoFactors[n];
  }

  // Cancel everything if the determinant is zero, since inversion can't be done then
  if (originalDeterminant === 0) return this;

  // Transpose the cofactor of cofactors to get the adjugate matrix
  matrixOfCoFactors.transpose();

  // Multiply the matrix of cofactors with the inverse of the determinant,
  // to get the final inverse of the original matrix.
  var product = matrixOfCoFactors.multiply(1 / originalDeterminant);

  // Copy the data from the inverted temp matrix to this matrix
  for (var x = 0, y = product.length; x < y; x++) {
    this[x] = product[x];
  }

  return this;
};

/**
 * Get the determinant of the matrix, if possible.
 *
 * @return {number?} The determinant. The matrix must be square for
 *     this to be possible, so if it's not, this will return null.
 */
Matrix.prototype.getDeterminant = function() {
  var rows = this.rows;
  var cols = this.cols;

  // The matrix must be square
  if (rows !== cols) return null;

  // For a 1x1 matrix ( [[a]] ), the determinant is: a
  if (rows === 1) {
    return this[0];
  }

  // For a 2x2 matrix ( [[a, b], [c, d]] ), the determinant is: a*d - b*c
  if (rows === 2) {
    return this[0] * this[3] - this[1] * this[2];
  }

  // For a 3x3 matrix ( [[a, b, c], [d, e, f], [g, h, i]] ), the determinant
  // is: a*(e*i - f*h) - b*(d*i - f*g) + c*(d*h - e*g)
  if (rows === 3) {
    var a = this[0];
    var b = this[1];
    var c = this[2];
    var d = this[3];
    var e = this[4];
    var f = this[5];
    var g = this[6];
    var h = this[7];
    var i = this[8];
    return a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
  }

  // For 4x4 or larger matrices
  if (rows >= 4) {

    var result = 0;

    // By using a cache, only the first call to the method will cause a memory increase.
    var cache = this._cache || (this._cache = {});
    var matrix = cache.tempMatrix || (cache.tempMatrix = new Matrix(this.rows, this.cols, false));

    // Loop through each number for the first row
    for (var col = 0; col < cols; col++) {

      // We need to get a temporary copy of the matrix data in an array
      var newData = arrays.getWithLength(this.length);
      for (var d = this.length; d--;) {
        newData[d] = this[d];
      }

      // We need to get the determinant of the matrix made by the area
      // that is not in the current number's row or column. To do this,
      // we remove the first row and the column where the number is.
      removeRow(newData, 0, this.cols);
      removeColumn(newData, col, this.cols);
      matrix.setData(newData, this.rows - 1, this.cols - 1);

      // We're now done with the temporary copy of the matrix data
      arrays.giveBack(newData);

      result += (col % 2 ? -1 : 1) * this[col] * matrix.getDeterminant();
    }

    return result;
  }
};

/**
 * Tests if the data of the matrix is the same as the input.
 *
 * @param {Matrix} input Another Matrix instance.
 *
 * @return {Boolean} True if it's the same.
 */
Matrix.prototype.equals = function(input) {
  if (!(input instanceof Matrix)) return false;

  // If the size does not match, it is not equal
  if (this.rows !== input.rows || this.cols !== input.cols) {
    return false;
  }

  // Check each number and return false if something doesn't match
  for (var i = 0, l = this.length; i < l; i++) {
    if (this[i] !== input[i]) return false;
  }

  // If it hasn't returned before, everything matches and is the same
  return true;
};

/**
 * Tests if the data of the matrix represents the identity matrix.
 *
 * @return {boolean} True if it is the identity matrix, false otherwise.
 */
Matrix.prototype.isIdentity = function() {
  for (var i = 0, l = this.length; i < l; i++) {
    if (this[i] !== (i % (this.cols + 1) ? 0 : 1)) {
      return false;
    }
  }

  return true;
};

/**
 * Remove a row from the values array.
 *
 * @param {Array} values Array of values.
 * @param {number} row Index of the row.
 * @param {number} colsPerRow Number of columns per row.
 *
 * @private
 */
function removeRow(values, row, colsPerRow) {
  values.splice(row * colsPerRow, colsPerRow);
}

/**
 * Remove a column from the values array.
 *
 * @param {Array} values Array of values.
 * @param {number} col Index of the column.
 * @param {number} colsPerRow Number of columns per row.
 *
 * @private
 */
function removeColumn(values, col, colsPerRow) {
  var n = 0;
  for (var i = 0, l = values.length; i < l; i++) {
    if (i % colsPerRow !== col) values[n++] = values[i];
  }
  values.length = n;
}

/**
 * Convert a matrix to an array with the values.
 *
 * @param {Matrix} matrix The matrix instance.
 * @param {Array} array The array to use.
 *
 * @return {Array} The array.
 *
 * @private
 */
function toArray(matrix, array) {
  for (var i = 0, l = matrix.length; i < l; i++) {
    array[i] = matrix[i];
  }

  return array;
}

/**
 * Get the matrix data as an array with properties for rows and cols.
 *
 * @param {Matrix} matrix The matrix instance.
 * @param {Array} array The array to use.
 *
 * @return {Array} The array.
 *
 * @private
 */
function getData(matrix, array) {
  toArray(matrix, array);

  array.rows = matrix.rows;
  array.cols = matrix.cols;

  return array;
}

module.exports = Matrix;

},{"./arrays":82}],82:[function(require,module,exports){
/**
 * @module matrixmath/arrays
 * @private
 */
'use strict';

/**
 * Pool of arrays.
 * Organized by array length to avoid changing lengths of arrays.
 * Each array gets a non-enumerable property `inUse` which is `true` when the
 * array is in use.
 *
 * @type {Object.<number, Array.<Array>>}
 */
var pool = {};

/**
 * Get an array from the pool.
 * This array will have a length of 0.
 *
 * @return {Array} An array.
 */
function get() {
  return getWithLength(0);
}

/**
 * Get an array with the specified length from the pool.
 *
 * @param {number} length The preferred length of the array.
 *
 * @return {Array} An array.
 */
function getWithLength(length) {
  var arrays = pool[length];
  var array;
  var i;

  // Create the first array for the specified length
  if (!arrays) {
    array = create(length);
  }

  // Find an unused array among the created arrays for the specified length
  if (!array) {
    for (i = arrays.length; i--;) {
      if (!arrays[i].inUse) {
        array = arrays[i];
        break;
      }
    }

    // If no array was found, create a new one
    if (!array) {
      array = create(length);
    }
  }

  array.inUse = true;
  return array;
}

/**
 * Give back an array to the pool.
 * This will reset the array to the original length and make all values
 * undefined.
 *
 * @param {Array} array An array that was gotten from this pool before.
 */
function giveBack(array) {

  // Don't return arrays that didn't originate from this pool
  if (!array.hasOwnProperty('originalLength')) return;

  // Reset all the elements
  for (var i = array.length; i--;) {
    array[i] = undefined;
  }

  // Reset the length
  array.length = array.originalLength;

  // Remove custom properties that the Matrix class might have added
  delete array.rows;
  delete array.cols;

  // Let the pool know that it's no longer in use
  array.inUse = false;
}

/**
 * Create a new array and add it to the pool for the specified length.
 *
 * @param {number} length The length of the array to create.
 *
 * @return {Array} The new array.
 */
function create(length) {
  var array = new Array(length);

  // Create a non-enumerable property as a flag to know if the array is in use
  Object.defineProperties(array, {
    inUse: {
      enumerable: false,
      writable: true,
      value: false
    },
    originalLength: {
      enumerable: false,
      value: length
    }
  });

  if (!pool[length]) pool[length] = [];
  pool[length].push(array);

  return array;
}

exports.get = get;
exports.getWithLength = getWithLength;
exports.giveBack = giveBack;

},{}],83:[function(require,module,exports){
/**
 * @module matrixmath
 *
 * @property {Object} Matrix The Matrix class.
 */
'use strict';

exports.Matrix = require('./Matrix');

},{"./Matrix":81}],84:[function(require,module,exports){
/*

*/
exports.Transform = require('./lib/Transform');
exports.estimateT = require('./lib/estimateT');
exports.estimateS = require('./lib/estimateS');
exports.estimateR = require('./lib/estimateR');
exports.estimateTS = require('./lib/estimateTS');
exports.estimateTR = require('./lib/estimateTR');
exports.estimateSR = require('./lib/estimateSR');
exports.estimateTSR = require('./lib/estimateTSR');
exports.version = require('./lib/version');

exports.estimate = function (type, domain, range, pivot) {
  // Parameter
  //   type
  //     string. One of the following: 'T', 'S', 'R', 'TS', 'TR', 'SR', 'TSR'
  //   domain
  //     array of 2d arrays
  //   range
  //     array of 2d arrays
  //   pivot
  //     optional 2d array, does nothing for translation estimators
  var name = 'estimate' + type.toUpperCase();
  if (exports.hasOwnProperty(name)) {
    return exports[name](domain, range, pivot);
  } // else
  throw new Error('Unknown estimator type: ' + type);
};

},{"./lib/Transform":85,"./lib/estimateR":86,"./lib/estimateS":87,"./lib/estimateSR":88,"./lib/estimateT":89,"./lib/estimateTR":90,"./lib/estimateTS":91,"./lib/estimateTSR":92,"./lib/version":93}],85:[function(require,module,exports){

var Transform = function (s, r, tx, ty) {

  // Public, to allow user access
  this.s = s;
  this.r = r;
  this.tx = tx;
  this.ty = ty;

  this.equals = function (t) {
    return (s === t.s && r === t.r && tx === t.tx && ty === t.ty);
  };

  this.transform = function (p) {
    // p
    //   point [x, y] or array of points [[x1,y1], [x2, y2], ...]

    if (typeof p[0] === 'number') {
      // Single point
      return [s * p[0] - r * p[1] + tx, r * p[0] + s * p[1] + ty];
    } // else

    var i, c = [];
    for (i = 0; i < p.length; i += 1) {
      c.push([s * p[i][0] - r * p[i][1] + tx, r * p[i][0] + s * p[i][1] + ty]);
    }
    return c;
  };

  this.getMatrix = function () {
    // Get the transformation matrix in the format common to
    // many APIs, including:
    // - kld-affine
    //
    // Return
    //   object o, having properties a, b, c, d, e, f:
    //   [ s  -r  tx ]   [ o.a  o.c  o.e ]
    //   [ r   s  ty ] = [ o.b  o.d  o.f ]
    //   [ 0   0   1 ]   [  -    -    -  ]
    return { a: s, b: r, c: -r, d: s, e: tx, f: ty };
  };

  this.getRotation = function () {
    // in rads
    return Math.atan2(r, s);
  };

  this.getScale = function () {
    // scale multiplier
    return Math.sqrt(r * r + s * s);
  };

  this.getTranslation = function () {
    return [tx, ty];
  };

  this.inverse = function () {
    // Return inversed transform instance
    // See note 2015-10-26-16-30
    var det = s * s + r * r;
    // Test if singular transformation. These might occur when all the range
    // points are the same, forcing the scale to drop to zero.
    var eps = 0.00000001;
    if (Math.abs(det) < eps) {
      throw new Error('Singular transformations cannot be inversed.');
    }
    var shat = s / det;
    var rhat = -r / det;
    var txhat = (-s * tx - r * ty) / det;
    var tyhat = ( r * tx - s * ty) / det;
    return new Transform(shat, rhat, txhat, tyhat);
  };

  this.translateBy = function (dx, dy) {
    return new Transform(s, r, tx + dx, ty + dy);
  };

  this.scaleBy = function (multiplier, pivot) {
    // Parameter
    //   multiplier
    //   pivot
    //     optional, a [x, y] point
    var m, x, y;
    m = multiplier; // alias
    if (typeof pivot === 'undefined') {
      x = y = 0;
    } else {
      x = pivot[0];
      y = pivot[1];
    }
    return new Transform(m * s, m * r, m * tx + (1-m) * x, m * ty + (1-m) * y);
  };

  this.rotateBy = function (radians, pivot) {
    // Parameter
    //   radians
    //     from positive x to positive y axis
    //   pivot
    //     optional, a [x, y] point
    var co, si, x, y, shat, rhat, txhat, tyhat;
    co = Math.cos(radians);
    si = Math.sin(radians);
    if (typeof pivot === 'undefined') {
      x = y = 0;
    } else {
      x = pivot[0];
      y = pivot[1];
    }
    shat = s * co - r * si;
    rhat = s * si + r * co;
    txhat = (tx - x) * co - (ty - y) * si + x;
    tyhat = (tx - x) * si + (ty - y) * co + y;
    return new Transform(shat, rhat, txhat, tyhat);
  };


  this.multiplyBy = function (transform) {
    // Multiply this transformation matrix A
    // from the right with the given transformation matrix B
    // and return the result AB

    // For reading aid:
    // s -r tx  t.s -r tx
    // r  s ty *  r  s ty
    // 0  0  1    0  0  1
    var t = transform; // alias
    var shat = s * t.s - r * t.r;
    var rhat = s * t.r + r * t.s;
    var txhat = s * t.tx - r * t.ty + tx;
    var tyhat = r * t.tx + s * t.ty + ty;
    return new Transform(shat, rhat, txhat, tyhat);
  };
};

Transform.IDENTITY = new Transform(1, 0, 0, 0);

module.exports = Transform;

},{}],86:[function(require,module,exports){
var Transform = require('./Transform');

module.exports = function (domain, range, pivot) {
  var i, N, D, a0, b0, a, b, c, d, ac, ad, bc, bd, shat, rhat, tx, ty;

  N = Math.min(domain.length, range.length);
  ac = ad = bc = bd = 0;

  if (typeof pivot === 'undefined') {
    a0 = b0 = 0;
  } else {
    a0 = pivot[0];
    b0 = pivot[1];
  }

  for (i = 0; i < N; i += 1) {
    a = domain[i][0] - a0;
    b = domain[i][1] - b0;
    c = range[i][0] - a0;
    d = range[i][1] - b0;
    ac += a * c;
    ad += a * d;
    bc += b * c;
    bd += b * d;
  }

  p = ac + bd;
  q = ad - bc;

  D = Math.sqrt(p * p + q * q);

  if (D === 0) {
    // D === 0
    // <=> q === 0 and p === 0.
    // <=> ad === bc and ac === -bd
    // <=> domain in pivot OR range in pivot OR yet unknown cases
    //     where the angle cannot be determined.
    // D === 0 also if N === 0.
    // Assume identity transform to be the best guess
    return Transform.IDENTITY;
  }

  shat = p / D;
  rhat = q / D;
  tx = a0 - a0 * shat + b0 * rhat;
  ty = b0 - a0 * rhat - b0 * shat;

  return new Transform(shat, rhat, tx, ty);
};

},{"./Transform":85}],87:[function(require,module,exports){
var Transform = require('./Transform');

module.exports = function (domain, range, pivot) {
  var i, N, D, a0, b0, a, b, c, d, ac, bd, aa, bb, shat, tx, ty;

  N = Math.min(domain.length, range.length);
  ac = bd = aa = bb = 0;

  if (typeof pivot === 'undefined') {
    a0 = b0 = 0;
  } else {
    a0 = pivot[0];
    b0 = pivot[1];
  }

  for (i = 0; i < N; i += 1) {
    a = domain[i][0] - a0;
    b = domain[i][1] - b0;
    c = range[i][0] - a0;
    d = range[i][1] - b0;
    ac += a * c;
    bd += b * d;
    aa += a * a;
    bb += b * b;
  }

  D = aa + bb;

  if (D === 0) {
    // All domain points equal the pivot.
    // Identity transform is then only solution.
    // D === 0 also if N === 0.
    // Assume identity transform to be the best guess
    return Transform.IDENTITY;
  }

  // Prevent negative scaling because it would be same as positive scaling
  // and rotation => limit to zero
  shat = Math.max(0, (ac + bd) / D);
  tx = (1 - shat) * a0;
  ty = (1 - shat) * b0;

  return new Transform(shat, 0, tx, ty);
};

},{"./Transform":85}],88:[function(require,module,exports){
var Transform = require('./Transform');

module.exports = function (domain, range, pivot) {
  // Estimate optimal transformation given the domain and the range
  // so that the pivot point remains the same.
  //
  // Use cases
  //   - transform an image that has one corner fixed with a pin.
  //   - allow only scale and rotation by fixing the middle of the object
  //     to transform.
  //
  // Parameters
  //   domain, an array of [x, y] points
  //   range, an array of [x, y] points
  //   pivot, optional
  //     the point [x, y] that must remain constant in the tranformation.
  //     Defaults to origo [0, 0]
  //
  //
  var X, Y, N, s, r, tx, ty;

  // Optional pivot
  if (typeof pivot === 'undefined') {
    pivot = [0, 0];
  }

  // Alias
  X = domain;
  Y = range;

  // Allow arrays of different length but
  // ignore the extra points.
  N = Math.min(X.length, Y.length);

  var v = pivot[0];
  var w = pivot[1];

  var i, a, b, c, d;
  var a2, b2;
  a2 = b2 = 0;
  var ac, bd, bc, ad;
  ac = bd = bc = ad = 0;

  for (i = 0; i < N; i += 1) {
    a = X[i][0] - v;
    b = X[i][1] - w;
    c = Y[i][0] - v;
    d = Y[i][1] - w;
    a2 += a * a;
    b2 += b * b;
    ac += a * c;
    bd += b * d;
    bc += b * c;
    ad += a * d;
  }

  // Denominator = determinant.
  // It becomes zero iff N = 0 or X[i] = [v, w] for every i in [0, n).
  // In other words, iff all the domain points are under the fixed point or
  // there is no domain points.
  var den = a2 + b2;

  var eps = 0.00000001;
  if (Math.abs(den) < eps) {
    // The domain points are under the pivot or there is no domain points.
    // We assume identity transform be the simplest guess. It keeps
    // the domain points under the pivot if there is some.
    return new Transform(1, 0, 0, 0);
  }

  // Estimators
  s = (ac + bd) / den;
  r = (-bc + ad) / den;
  tx =  w * r - v * s + v;
  ty = -v * r - w * s + w;

  return new Transform(s, r, tx, ty);
};

},{"./Transform":85}],89:[function(require,module,exports){
var Transform = require('./Transform');

module.exports = function (domain, range) {
  var i, N, a1, b1, c1, d1, txhat, tyhat;

  N = Math.min(domain.length, range.length);
  a1 = b1 = c1 = d1 = 0;

  if (N < 1) {
    // Assume identity transform be the best guess
    return Transform.IDENTITY;
  }

  for (i = 0; i < N; i += 1) {
    a1 += domain[i][0];
    b1 += domain[i][1];
    c1 += range[i][0];
    d1 += range[i][1];
  }

  txhat = (c1 - a1) / N;
  tyhat = (d1 - b1) / N;

  return new Transform(1, 0, txhat, tyhat);
};

},{"./Transform":85}],90:[function(require,module,exports){
var Transform = require('./Transform');

module.exports = function (domain, range) {
  // Parameters
  //   domain
  //     array of [x, y] 2D arrays
  //   range
  //     array of [x, y] 2D arrays

  // Alias
  var X = domain;
  var Y = range;

  // Allow arrays of different length but
  // ignore the extra points.
  var N = Math.min(X.length, Y.length);

  var i, a, b, c, d, a1, b1, c1, d1, ac, ad, bc, bd;
  a1 = b1 = c1 = d1 = ac = ad = bc = bd = 0;
  for (i = 0; i < N; i += 1) {
    a = X[i][0];
    b = X[i][1];
    c = Y[i][0];
    d = Y[i][1];
    a1 += a;
    b1 += b;
    c1 += c;
    d1 += d;
    ac += a * c;
    ad += a * d;
    bc += b * c;
    bd += b * d;
  }

  // Denominator.
  var v = N * (ad - bc) - a1 * d1 + b1 * c1;
  var w = N * (ac + bd) - a1 * c1 - b1 * d1;
  var D = Math.sqrt(v * v + w * w);

  if (D === 0) {
    // N === 0 => D === 0
    if (N === 0) {
      return new Transform(1, 0, 0, 0);
    } // else
    // D === 0 <=> undecidable
    // We guess the translation to the mean of the range to be the best guess.
    // Here a, b represents the mean of domain points.
    return new Transform(1, 0, (c1 - a1) / N, (d1 - b1) / N);
  }

  // Estimators
  var shat = w / D;
  var rhat = v / D;
  var txhat = (-a1 * shat + b1 * rhat + c1) / N;
  var tyhat = (-a1 * rhat - b1 * shat + d1) / N;

  return new Transform(shat, rhat, txhat, tyhat);
};

},{"./Transform":85}],91:[function(require,module,exports){
var Transform = require('./Transform');

module.exports = function (domain, range) {
  // Parameters
  //   domain
  //     array of [x, y] 2D arrays
  //   range
  //     array of [x, y] 2D arrays

  // Alias
  var X = domain;
  var Y = range;

  // Allow arrays of different length but
  // ignore the extra points.
  var N = Math.min(X.length, Y.length);

  var i, a, b, c, d, a1, b1, c1, d1, a2, b2, ac, bd;
  a1 = b1 = c1 = d1 = a2 = b2 = ac = bd = 0;
  for (i = 0; i < N; i += 1) {
    a = X[i][0];
    b = X[i][1];
    c = Y[i][0];
    d = Y[i][1];
    a1 += a;
    b1 += b;
    c1 += c;
    d1 += d;
    a2 += a * a;
    b2 += b * b;
    ac += a * c;
    bd += b * d;
  }

  // Denominator.
  var N2 = N * N;
  var a12 = a1 * a1;
  var b12 = b1 * b1;
  var p = a2 + b2;
  var q = ac + bd;
  var D = N2 * p - N * (a12 + b12);

  if (D === 0) {
    // N === 0 => D === 0
    if (N === 0) {
      return new Transform(1, 0, 0, 0);
    } // else
    // D === 0 <=> all the domain points are the same
    // We guess the translation to the mean of the range to be the best guess.
    // Here a, b represents the mean of domain points.
    return new Transform(1, 0, (c1 / N) - a, (d1 / N) - b);
  }

  // Estimators
  var shat = (N2 * q - N * (a1 * c1 + b1 * d1)) / D;
  var txhat = (-N * a1 * q + N * c1 * p - b12 * c1 + a1 * b1 * d1) / D;
  var tyhat = (-N * b1 * q + N * d1 * p - a12 * d1 + a1 * b1 * c1) / D;

  return new Transform(shat, 0, txhat, tyhat);
};

},{"./Transform":85}],92:[function(require,module,exports){
var Transform = require('./Transform');

module.exports = function (domain, range) {
  // Parameters
  //   domain
  //     array of [x, y] 2D arrays
  //   range
  //     array of [x, y] 2D arrays
  var X, Y, N, s, r, tx, ty;

  // Alias
  X = domain;
  Y = range;

  // Allow arrays of different length but
  // ignore the extra points.
  N = Math.min(X.length, Y.length);

  // If length is zero, no estimation can be done. We choose the indentity
  // transformation be the best quess.
  if (N === 0) {
    return new Transform(1, 0, 0, 0);
  } // else

  var i, a, b, c, d;
  var a1 = 0;
  var b1 = 0;
  var c1 = 0;
  var d1 = 0;
  var a2 = 0;
  var b2 = 0;
  var ad = 0;
  var bc = 0;
  var ac = 0;
  var bd = 0;
  for (i = 0; i < N; i += 1) {
    a = X[i][0];
    b = X[i][1];
    c = Y[i][0];
    d = Y[i][1];
    a1 += a;
    b1 += b;
    c1 += c;
    d1 += d;
    a2 += a * a;
    b2 += b * b;
    ad += a * d;
    bc += b * c;
    ac += a * c;
    bd += b * d;
  }

  // Denominator.
  // It is zero iff X[i] = X[j] for every i and j in [0, n).
  // In other words, iff all the domain points are the same or there is only one domain point.
  var den = N * a2 + N * b2 - a1 * a1 - b1 * b1;

  var eps = 0.00000001;
  if (-eps < den && den < eps) {
    // The domain points are the same.
    // We guess the translation to the mean of the range to be the best guess.
    // Here a, b represents the mean of domain points.
    return new Transform(1, 0, (c1 / N) - a, (d1 / N) - b);
  }

  // Estimators
  s = (N * (ac + bd) - a1 * c1 - b1 * d1) / den;
  r = (N * (ad - bc) + b1 * c1 - a1 * d1) / den;
  tx = (-a1 * (ac + bd) + b1 * (ad - bc) + a2 * c1 + b2 * c1) / den;
  ty = (-b1 * (ac + bd) - a1 * (ad - bc) + a2 * d1 + b2 * d1) / den;

  return new Transform(s, r, tx, ty);
};

},{"./Transform":85}],93:[function(require,module,exports){
module.exports = '1.0.1';

},{}],94:[function(require,module,exports){
'use strict';

var _leaflet = (window.L);

var _leaflet2 = _interopRequireDefault(_leaflet);

var _TransformPolygonWithImageOverlay = require('./feature/TransformPolygonWithImageOverlay');

var _TransformPolygonWithImageOverlay2 = _interopRequireDefault(_TransformPolygonWithImageOverlay);

var _TransformImageOverlay = require('./feature/TransformImageOverlay');

var _TransformImageOverlay2 = _interopRequireDefault(_TransformImageOverlay);

var _TransformPolygonWithMarkers = require('./feature/TransformPolygonWithMarkers');

var _TransformPolygonWithMarkers2 = _interopRequireDefault(_TransformPolygonWithMarkers);

var _DoubleBorderPolygon = require('./draw/handler/DoubleBorderPolygon');

var _DoubleBorderPolygon2 = _interopRequireDefault(_DoubleBorderPolygon);

var _PointAlignmentOverlay = require('./layer/PointAlignmentOverlay');

var _PointAlignmentOverlay2 = _interopRequireDefault(_PointAlignmentOverlay);

var _HeightMapLayer = require('./layer/HeightMapLayer');

var _HeightMapLayer2 = _interopRequireDefault(_HeightMapLayer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_leaflet2.default.TransformPolygonWithImageOverlay = _TransformPolygonWithImageOverlay2.default;
_leaflet2.default.TransformImageOverlay = _TransformImageOverlay2.default;
_leaflet2.default.TransformPolygonWithMarkers = _TransformPolygonWithMarkers2.default;
_leaflet2.default.DoubleBorderPolygon = _DoubleBorderPolygon2.default;
_leaflet2.default.PointAlignmentOverlay = _PointAlignmentOverlay2.default;
_leaflet2.default.HeightMapLayer = _HeightMapLayer2.default;

},{"./draw/handler/DoubleBorderPolygon":95,"./feature/TransformImageOverlay":108,"./feature/TransformPolygonWithImageOverlay":109,"./feature/TransformPolygonWithMarkers":110,"./layer/HeightMapLayer":111,"./layer/PointAlignmentOverlay":112}],95:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _leaflet = (window.L);

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

},{"../../edit/handler/PolyGroup":100,"babel-runtime/core-js/object/assign":6}],96:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _leaflet = (window.L);

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

},{"../../edit/handler/SimplePolyGroup":101}],97:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (options) {
  var proxy = new DragProxy(options.el);
  proxy._map = this._map;
  proxy.enable();

  return proxy;
};

var _leaflet = (window.L);

var _leaflet2 = _interopRequireDefault(_leaflet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DragProxy = _leaflet2.default.Draggable.extend({
  getLatLng: function getLatLng() {
    return this._map.layerPointToLatLng(this._newPos);
  },
  setLatLng: function setLatLng() {},
  _updatePosition: function _updatePosition() {
    this.fire('drag');
  },
  setOpacity: function setOpacity() {}
});

;

},{}],98:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _leaflet = (window.L);

var _leaflet2 = _interopRequireDefault(_leaflet);

var _SimpleShape = require('./SimpleShape');

var _SimpleShape2 = _interopRequireDefault(_SimpleShape);

var _AffineTransform = require('../../ext/AffineTransform');

var _LineMarker = require('../../ext/LineMarker');

var _LineMarker2 = _interopRequireDefault(_LineMarker);

var _MoveProxy = require('./MoveProxy');

var _MoveProxy2 = _interopRequireDefault(_MoveProxy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Path = _SimpleShape2.default.extend({
	includes: [_AffineTransform.SetProjections],
	initialize: function initialize() {
		this._setProjections(this.projectionMethods);
		_SimpleShape2.default.prototype.initialize.apply(this, arguments);

		this._shape.on("add", function () {
			this._initLatLngs = this._shape.getLatLngs();
		}.bind(this));
	},

	_onMarkerDragStart: function _onMarkerDragStart(e) {
		_SimpleShape2.default.prototype._onMarkerDragStart.call(this, e);

		this._origLatLngs = this._shape.getLatLngs();
		this._origTopLeft = this._shape.getBounds().getNorthWest();
		this._origCenter = this._getCenter();
		this._origAngle = this._angle;

		var corners = this._getCorners(),
		    marker = e.target,
		    currentCornerIndex = marker._cornerIndex;

		this._oppositeCorner = corners[(currentCornerIndex + 2) % 4];
		this._currentCorner = corners[currentCornerIndex];

		this._toggleCornerMarkers(0, currentCornerIndex);
	},

	_onMarkerDragEnd: function _onMarkerDragEnd(e) {
		this._origCenter = this._getCenter();
		this._toggleCornerMarkers(1);
		this._repositionAllMarkers();

		_SimpleShape2.default.prototype._onMarkerDragEnd.call(this, e);
	},

	projectionMethods: {
		pre: "latLngToLayerPoint",
		post: "layerPointToLatLng"
	},

	getMovePoint: function getMovePoint() {
		if (!this._origCenter) {
			this._origCenter = this._getCenter();
		}

		return this._origCenter;
	},

	_updateTransformLayers: function _updateTransformLayers() {},

	transforms: {
		ui: {
			move: function move(options) {
				if (options && options.proxy) {
					this._moveMarker = _MoveProxy2.default.call(this, options);

					this.getMovePoint = function () {
						return this._origTopLeft;
					}.bind(this);
					this._bindMarker(this._moveMarker);
				} else {
					this._moveMarker = this._createMarker(this._getCenter(), this.options.moveIcon);
				}
			},
			resize: function resize() {
				var corners = this._getCorners();

				this._resizeMarkers = [];

				for (var i = 0, l = corners.length; i < l; i++) {
					this._resizeMarkers.push(this._createMarker(corners[i], this.options.resizeIcon));
					this._resizeMarkers[i]._cornerIndex = i;
				}
			},
			rotate: function rotate() {
				var center = this._getCenter();

				this._rotateMarker = this._createMarker(center, this.options.rotateIcon, 0, -100);
				this._rotateLine = new _LineMarker2.default(center, 0, -100, {
					dashArray: [10, 7],
					color: 'black',
					weight: 2
				});
				this._angle = 0;

				this._bindMarker(this._rotateLine);
				this._markerGroup.addLayer(this._rotateLine);
			}
		},
		events: {
			move: function move(newPos) {
				var tx = new _AffineTransform.Transform(this._map, this.projectionMethods).move(this.getMovePoint(), newPos);
				this._shape.setLatLngs(tx.apply(this._origLatLngs));
				this._repositionAllMarkers();

				this._updateTransformLayers(tx);

				return tx;
			},
			resize: function resize(latlng) {
				var tx = new _AffineTransform.Transform(this._map, this.projectionMethods).resize(this._oppositeCorner, this._currentCorner, latlng);
				this._shape.setLatLngs(tx.apply(this._origLatLngs));
				delete this._origCenter;
				this._repositionAllMarkers();

				this._updateTransformLayers(tx);

				return tx;
			},
			rotate: function rotate(latlng) {
				var tx = new _AffineTransform.Transform(this._map, this.projectionMethods).rotateFrom(this._origAngle - Math.PI / 2, this._origCenter, latlng);
				this._angle = this._origAngle + tx.getAngle();
				this._shape.setLatLngs(tx.apply(this._origLatLngs));
				this._repositionAllMarkers();

				this._updateTransformLayers(tx);

				return tx;
			}
		}
	},

	_getCorners: function _getCorners() {
		var bounds = this._shape.getBounds(),
		    nw = bounds.getNorthWest(),
		    ne = bounds.getNorthEast(),
		    se = bounds.getSouthEast(),
		    sw = bounds.getSouthWest();

		return [nw, ne, se, sw];
	},

	_toggleCornerMarkers: function _toggleCornerMarkers(opacity) {
		if (!this._resizeMarkers) return;
		for (var i = 0, l = this._resizeMarkers.length; i < l; i++) {
			this._resizeMarkers[i].setOpacity(opacity);
		}
	},

	_repositionMoveMarker: function _repositionMoveMarker() {
		if (this._moveMarker) {
			this._moveMarker.setLatLng(this._getCenter());
		}
	},

	_repositionAllMarkers: function _repositionAllMarkers() {
		var corners = this._getCorners();

		if (this._resizeMarkers) {
			for (var i = 0, l = this._resizeMarkers.length; i < l; i++) {
				this._resizeMarkers[i].setLatLng(corners[i]);
			}
		}

		if (this._moveMarker) {
			this._moveMarker.setLatLng(this.getMovePoint());
		}

		if (this._rotateMarker) {
			var dx = 100 * Math.sin(this._angle),
			    dy = -100 * Math.cos(this._angle);

			this._rotateMarker.setLatLng(this._getCenter());
			this._rotateMarker.setOffset(dx, dy);

			this._rotateLine.setLatLng(this._getCenter());
			this._rotateLine.setMoveTo(dx, dy);
		}
	},

	_getCenter: function _getCenter() {
		var center = _leaflet2.default.point(0, 0);
		var pts = this._pre(this._shape.getLatLngs());
		for (var i = 0; i < pts.length; i++) {
			center._add(pts[i]);
		}
		return this._post(center._divideBy(pts.length));
	}
});

exports.default = Path;

},{"../../ext/AffineTransform":104,"../../ext/LineMarker":105,"./MoveProxy":97,"./SimpleShape":102}],99:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _leaflet = (window.L);

var _leaflet2 = _interopRequireDefault(_leaflet);

var _Path = require('./Path');

var _Path2 = _interopRequireDefault(_Path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Poly = _Path2.default.extend({
	_initMarkers: function _initMarkers() {
		_Path2.default.prototype._initMarkers.call(this);
		this._createEdgeMarkers();
	},

	_createEdgeMarkers: function _createEdgeMarkers() {
		this._markers = [];

		var latlngs = this._shape._latlngs,
		    i,
		    j,
		    len,
		    marker;

		// TODO refactor holes implementation in Polygon to support it here

		for (i = 0, len = latlngs.length; i < len; i++) {

			marker = this._createEdgeMarker(latlngs[i], i);
			marker.on('click', this._onMarkerClick, this);
			this._markers.push(marker);
		}

		var markerLeft, markerRight;

		for (i = 0, j = len - 1; i < len; j = i++) {
			if (i === 0 && !(_leaflet2.default.Polygon && this._shape instanceof _leaflet2.default.Polygon)) {
				continue;
			}

			markerLeft = this._markers[j];
			markerRight = this._markers[i];

			this._createMiddleMarker(markerLeft, markerRight);
			this._updatePrevNext(markerLeft, markerRight);
		}
	},

	_createEdgeMarker: function _createEdgeMarker(latlng, index) {
		var marker = new _leaflet2.default.Marker(latlng, {
			draggable: true,
			icon: this.options.edgeIcon
		});

		marker._origLatLng = latlng;
		marker._index = index;

		marker.on('drag', this._onEdgeMarkerDrag, this);
		marker.on('dragend', this._fireEdit, this);

		this._markerGroup.addLayer(marker);

		return marker;
	},

	_removeMarker: function _removeMarker(marker) {
		var i = marker._index;

		this._markerGroup.removeLayer(marker);
		this._markers.splice(i, 1);
		this._shape.spliceLatLngs(i, 1);
		this._updateIndexes(i, -1);
		this._repositionAllMarkers();

		marker.off('drag', this._onEdgeMarkerDrag, this).off('dragend', this._fireEdit, this).off('click', this._onMarkerClick, this);
	},

	_onEdgeMarkerDrag: function _onEdgeMarkerDrag(e) {
		var marker = e.target;

		_leaflet2.default.extend(marker._origLatLng, marker._latlng);

		if (marker._middleLeft) {
			marker._middleLeft.setLatLng(this._getMiddleLatLng(marker._prev, marker));
		}
		if (marker._middleRight) {
			marker._middleRight.setLatLng(this._getMiddleLatLng(marker, marker._next));
		}
		this._shape.getLatLngs()[marker._index] = marker._latlng;
		this._shape.redraw();
		this._repositionAllMarkers();
		this._repositionMoveMarker();
	},

	_onMarkerClick: function _onMarkerClick(e) {
		var minPoints = _leaflet2.default.Polygon && this._shape instanceof _leaflet2.default.Polygon ? 4 : 3,
		    marker = e.target;

		// If removing this point would create an invalid polyline/polygon don't remove
		if (this._shape._latlngs.length < minPoints) {
			return;
		}

		// remove the marker
		this._removeMarker(marker);

		// update prev/next links of adjacent markers
		this._updatePrevNext(marker._prev, marker._next);

		// remove ghost markers near the removed marker
		if (marker._middleLeft) {
			this._markerGroup.removeLayer(marker._middleLeft);
		}
		if (marker._middleRight) {
			this._markerGroup.removeLayer(marker._middleRight);
		}

		// create a ghost marker in place of the removed one
		if (marker._prev && marker._next) {
			this._createMiddleMarker(marker._prev, marker._next);
		} else if (!marker._prev) {
			marker._next._middleLeft = null;
		} else if (!marker._next) {
			marker._prev._middleRight = null;
		}

		this._fireEdit();
	},

	_updateIndexes: function _updateIndexes(index, delta) {
		this._markerGroup.eachLayer(function (marker) {
			if (marker._index > index) {
				marker._index += delta;
			}
		});
	},

	_createMiddleMarker: function _createMiddleMarker(marker1, marker2) {
		var latlng = this._getMiddleLatLng(marker1, marker2),
		    marker = this._createEdgeMarker(latlng),
		    onClick,
		    onDragStart,
		    _onDragEnd;

		marker.setOpacity(0.6);

		marker1._middleRight = marker2._middleLeft = marker;

		onDragStart = function onDragStart() {
			var i = marker2._index;

			marker._index = i;

			marker.off('click', onClick, this).on('click', this._onMarkerClick, this);

			latlng.lat = marker.getLatLng().lat;
			latlng.lng = marker.getLatLng().lng;
			this._shape.spliceLatLngs(i, 0, latlng);
			this._markers.splice(i, 0, marker);

			marker.setOpacity(1);

			this._updateIndexes(i, 1);
			marker2._index++;
			this._updatePrevNext(marker1, marker);
			this._updatePrevNext(marker, marker2);

			this._shape.fire('editstart');
		};

		_onDragEnd = function onDragEnd() {
			marker.off('dragstart', onDragStart, this);
			marker.off('dragend', _onDragEnd, this);

			this._createMiddleMarker(marker1, marker);
			this._createMiddleMarker(marker, marker2);
		};

		onClick = function onClick() {
			onDragStart.call(this);
			_onDragEnd.call(this);
			this._fireEdit();
		};

		marker.on('click', onClick, this).on('dragstart', onDragStart, this).on('dragend', _onDragEnd, this);

		this._markerGroup.addLayer(marker);
	},

	_updatePrevNext: function _updatePrevNext(marker1, marker2) {
		if (marker1) {
			marker1._next = marker2;
		}
		if (marker2) {
			marker2._prev = marker1;
		}
	},

	_getMiddleLatLng: function _getMiddleLatLng(marker1, marker2) {
		var map = this._shape._map,
		    p1 = map.project(marker1.getLatLng()),
		    p2 = map.project(marker2.getLatLng());

		return map.unproject(p1._add(p2)._divideBy(2));
	},

	_repositionAllMarkers: function _repositionAllMarkers() {
		_Path2.default.prototype._repositionAllMarkers.call(this);

		// reposition edge markers
		for (var i = 0; i < this._markers.length; i++) {
			var i1 = i,
			    i2 = (i + 1) % this._markers.length;
			var marker1 = this._markers[i1];
			var marker2 = this._markers[i2];
			marker1.setLatLng(this._shape._latlngs[i1]);
			marker2.setLatLng(this._shape._latlngs[i2]);
			if (marker1._middleRight) {
				marker1._middleRight.setLatLng(this._getMiddleLatLng(marker1, marker2));
			}
		}
	}

});

_leaflet2.default.Polyline.addInitHook(function () {
	this.editing = new Poly(this);

	if (this.options.editable) {
		this.editing.enable();
	}
});

exports.default = Poly;

},{"./Path":98}],100:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _leaflet = (window.L);

var _leaflet2 = _interopRequireDefault(_leaflet);

var _Poly = require('./Poly');

var _Poly2 = _interopRequireDefault(_Poly);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PolyGroup = _Poly2.default.extend({
  includes: [_leaflet2.default.Mixin.Events],

  _onMarkerDragEnd: function _onMarkerDragEnd(e) {
    _Poly2.default.prototype._onMarkerDragEnd.call(this, e);
    this._updateTransformLayers();
  },

  _updateTransformLayers: function _updateTransformLayers(tx) {
    for (var i = 0; i < this._shape._transformLayers.length; i++) {
      var layer = this._shape._transformLayers[i];
      layer.applyTransform(tx);
    }
  }
});

_leaflet2.default.Polygon.include({
  addTransformLayer: function addTransformLayer(layer) {
    this._transformLayers.push(layer);
  }
});

_leaflet2.default.Polygon.addInitHook(function () {
  this._transformLayers = [];
});

exports.default = PolyGroup;

},{"./Poly":99}],101:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _leaflet = (window.L);

var _leaflet2 = _interopRequireDefault(_leaflet);

var _Path = require('./Path');

var _Path2 = _interopRequireDefault(_Path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SimplePolyGroup = _Path2.default.extend({
  includes: [_leaflet2.default.Mixin.Events],

  _onMarkerDragEnd: function _onMarkerDragEnd(e) {
    _Path2.default.prototype._onMarkerDragEnd.call(this, e);
    this._updateTransformLayers();

    var current = this._boundsPoint(this._shape.getLatLngs());
    var orig = this._boundsPoint(this._initLatLngs);
    this.fire("done", {
      offset: _leaflet2.default.latLng(current.lat - orig.lat, current.lng - orig.lng),
      current: this._boundsPoint(this._shape.getLatLngs()),
      tx: this._tx
    });
  },

  _boundsPoint: function _boundsPoint(latLngs) {
    return _leaflet2.default.latLngBounds(latLngs).getNorthWest();
  },

  _updateTransformLayers: function _updateTransformLayers(tx) {
    for (var i = 0; i < this._shape._transformLayers.length; i++) {
      var layer = this._shape._transformLayers[i];
      layer.applyTransform(tx);
    }
  }
});

_leaflet2.default.Polygon.include({
  addTransformLayer: function addTransformLayer(layer) {
    this._transformLayers.push(layer);
  }
});

_leaflet2.default.Polygon.addInitHook(function () {
  this._transformLayers = [];
});

exports.default = SimplePolyGroup;

},{"./Path":98}],102:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _leaflet = (window.L);

var _leaflet2 = _interopRequireDefault(_leaflet);

var _MarkerExt = require('../../ext/MarkerExt');

var _MarkerExt2 = _interopRequireDefault(_MarkerExt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SimpleShape = _leaflet2.default.Handler.extend({
	options: {
		moveIcon: new _leaflet2.default.DivIcon({
			iconSize: new _leaflet2.default.Point(12, 12),
			className: 'leaflet-div-icon leaflet-editing-icon leaflet-edit-move'
		}),
		resizeIcon: new _leaflet2.default.DivIcon({
			iconSize: new _leaflet2.default.Point(8, 8),
			className: 'leaflet-div-icon leaflet-editing-icon leaflet-edit-resize'
		}),
		rotateIcon: new _leaflet2.default.DivIcon({
			iconSize: new _leaflet2.default.Point(8, 8),
			className: 'leaflet-div-icon leaflet-editing-icon leaflet-edit-rotate'
		}),
		edgeIcon: new _leaflet2.default.DivIcon({
			iconSize: new _leaflet2.default.Point(8, 8),
			className: 'leaflet-div-icon leaflet-editing-icon'
		}),
		transforms: ['move', 'rotate', 'resize']
	},

	initialize: function initialize(shape, options) {
		this._shape = shape;
		_leaflet2.default.Util.setOptions(this, options);
		var handlerOptions = this._shape.options.handler || {};
		_leaflet2.default.Util.setOptions(this, handlerOptions);
	},

	addHooks: function addHooks() {
		var shape = this._shape;

		shape.setStyle(shape.options.editing);

		if (shape._map) {
			this._map = shape._map;

			if (!this._markerGroup) {
				this._initMarkers();
			}
			this._map.addLayer(this._markerGroup);
		}
	},

	removeHooks: function removeHooks() {
		var shape = this._shape;

		shape.setStyle(shape.options.original);

		if (shape._map) {
			if (this._moveMarker) this._unbindMarker(this._moveMarker);
			if (this._rotateMarker) this._unbindMarker(this._rotateMarker);

			if (this._resizeMarkers) {
				for (var i = 0, l = this._resizeMarkers.length; i < l; i++) {
					this._unbindMarker(this._resizeMarkers[i]);
				}
				this._resizeMarkers = null;
			}

			this._map.removeLayer(this._markerGroup);
			delete this._markerGroup;
		}

		this._map = null;
	},

	updateMarkers: function updateMarkers() {
		this._markerGroup.clearLayers();
		this._initMarkers();
	},

	_initMarkers: function _initMarkers() {
		if (!this._markerGroup) {
			this._markerGroup = new _leaflet2.default.LayerGroup();
		}

		this.options.transforms.forEach(function (transform) {
			(typeof transform === 'undefined' ? 'undefined' : (0, _typeof3.default)(transform)) === 'object' ? this.transforms.ui[transform.type.toLowerCase()].call(this, transform) : this.transforms.ui[transform.toLowerCase()].call(this);
		}.bind(this));
	},

	// children override
	transforms: {
		ui: {
			move: function move() {},
			resize: function resize() {},
			rotate: function rotate() {}
		},

		events: {
			move: function move() {},
			resize: function resize() {},
			rotate: function rotate() {}
		}
	},

	_createMarker: function _createMarker(latlng, icon, dx, dy) {
		if (dx === undefined) {
			dx = 0;
			dy = 0;
		}
		var marker = new _MarkerExt2.default(latlng, {
			draggable: true,
			icon: icon,
			zIndexOffset: 10,
			dx: dx,
			dy: dy
		});

		this._bindMarker(marker);

		this._markerGroup.addLayer(marker);

		return marker;
	},

	_bindMarker: function _bindMarker(marker) {
		marker.on('dragstart', this._onMarkerDragStart, this).on('drag', this._onMarkerDrag, this).on('dragend', this._onMarkerDragEnd, this);
	},

	_unbindMarker: function _unbindMarker(marker) {
		marker.off('dragstart', this._onMarkerDragStart, this).off('drag', this._onMarkerDrag, this).off('dragend', this._onMarkerDragEnd, this);
	},

	_onMarkerDragStart: function _onMarkerDragStart(e) {
		var marker = e.target;
		marker.setOpacity(0);

		this._shape.fire('editstart');
	},

	_fireEdit: function _fireEdit() {
		this._shape.edited = true;
		this._shape.fire('edit');
	},

	_onMarkerDrag: function _onMarkerDrag(e) {
		var marker = e.target,
		    latlng = marker.getLatLng();

		if (marker === this._moveMarker) {
			this.transforms.events.move.call(this, latlng);
		} else if (marker === this._rotateMarker) {
			this.transforms.events.rotate.call(this, latlng);
		} else {
			this.transforms.events.resize.call(this, latlng);
		}
		this._shape.redraw();
	},

	_onMarkerDragEnd: function _onMarkerDragEnd(e) {
		var marker = e.target;
		marker.setOpacity(1);

		this._fireEdit();
	}
});

exports.default = SimpleShape;

},{"../../ext/MarkerExt":106,"babel-runtime/helpers/typeof":10}],103:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _leaflet = (window.L);

var _leaflet2 = _interopRequireDefault(_leaflet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _leaflet2.default.ImageOverlay.extend({
  initialize: function initialize(options) {
    this._url = options.url;
    _leaflet2.default.setOptions(this, options);
    this._initImage();
  },
  _initImage: function _initImage() {
    this._image = _leaflet2.default.DomUtil.create('img', 'leaflet-image-layer');
    _leaflet2.default.DomUtil.addClass(this._image, 'leaflet-zoom-hide');

    this._updateOpacity();

    //TODO createImage util method to remove duplication
    _leaflet2.default.extend(this._image, {
      galleryimg: 'no',
      onselectstart: _leaflet2.default.Util.falseFn,
      onmousemove: _leaflet2.default.Util.falseFn,
      onload: _leaflet2.default.bind(this._onImageLoad, this),
      src: this._url
    });
  },
  setPolygon: function setPolygon(polygon) {
    this._polygon = polygon;
    this._bounds = polygon.getBounds();
  },
  applyTransform: function applyTransform(tx) {
    if (tx) {
      if (this._lastTx) {
        tx = this._lastTx.clone(tx).applyTransform(tx);
      }

      var transform = [tx.getCSSTranslateString(this._origLeft), tx.getCSSTransformString(true)].join(" ");
      this._image.style[_leaflet2.default.DomUtil.TRANSFORM] = transform;
      this._tx = tx;

      this._image._leaflet_pos = tx._applyPts(this._origLeft);
    } else {
      this._lastTx = this._tx;
    }
  },
  _animateZoom: function _animateZoom() {
    this._bounds = this._polygon.getBounds();
    _leaflet2.default.ImageOverlay.prototype._animateZoom.apply(this, arguments);
  },
  _reset: function _reset() {
    var image = this._image,
        topLeft = this._map.latLngToLayerPoint(this._polygon.getBounds().getNorthWest()),
        size = this._map.latLngToLayerPoint(this._polygon.getBounds().getSouthEast())._subtract(topLeft);

    this._origLeft = topLeft;
    image.style.width = size.x + 'px';
    image.style.height = size.y + 'px';
    image.style.transformOrigin = '0 0 0';

    _leaflet2.default.DomUtil.setPosition(image, topLeft);
    delete this._lastTx;
  }
});

},{}],104:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Transform = exports.SetProjections = undefined;

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _leaflet = (window.L);

var _leaflet2 = _interopRequireDefault(_leaflet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
                if (_leaflet2.default.Util.isArray(pt)) {
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
        output[key] = (typeof v === 'undefined' ? 'undefined' : (0, _typeof3.default)(v)) === "object" ? copy(v) : v;
    }
    return output;
}

var Transform = _leaflet2.default.Class.extend({
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
        return _leaflet2.default.DomUtil.getTranslateString(this._applyPts(point));
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
        if (_leaflet2.default.Util.isArray(pts)) {
            var result = [],
                i,
                length = pts.length;
            for (i = 0; i < length; i++) {
                result.push(this._applyPts(pts[i]));
            }
            return result;
        } else {
            var xyz = this._applyXYZ([pts.x, pts.y, 1]);
            return _leaflet2.default.point(xyz[0], xyz[1]);
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

},{"babel-runtime/helpers/typeof":10}],105:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _leaflet = (window.L);

var _leaflet2 = _interopRequireDefault(_leaflet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _leaflet2.default.Polyline.extend({
    initialize: function initialize(latLng, dx, dy, options) {
        _leaflet2.default.Polyline.prototype.initialize.call(this, [latLng, latLng], options);
        this._dx = dx;
        this._dy = dy;
    },

    setLatLng: function setLatLng(latLng) {
        this.setLatLngs([latLng, latLng]);
        this.redraw();
    },

    setMoveTo: function setMoveTo(dx, dy) {
        this._dx = dx;
        this._dy = dy;
        this.redraw();
    },

    _simplifyPoints: function _simplifyPoints() {
        if (this._parts && this._parts.length != 0) {
            var pt1 = this._parts[0][0];
            // displace point 2
            var pt2 = _leaflet2.default.point(pt1.x + this._dx, pt1.y + this._dy);
            this._parts[0] = [pt1, pt2];
        }
        _leaflet2.default.Polyline.prototype._simplifyPoints.call(this);
    }
});

},{}],106:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _leaflet = (window.L);

var _leaflet2 = _interopRequireDefault(_leaflet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _leaflet2.default.Marker.extend({
    options: {
        dx: 0,
        dy: 0
    },

    initialize: function initialize(latlng, options) {
        _leaflet2.default.Marker.prototype.initialize.call(this, latlng, options);
        this._dx = this.options.dx;
        this._dy = this.options.dy;
    },

    setOffset: function setOffset(dx, dy) {
        this._dx = dx;
        this._dy = dy;
        this.update();
    },

    _setPos: function _setPos(pos) {
        pos.x += this._dx;
        pos.y += this._dy;
        _leaflet2.default.Marker.prototype._setPos.call(this, pos);
    }
});

},{}],107:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _leaflet = (window.L);

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

},{}],108:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _leaflet = (window.L);

var _leaflet2 = _interopRequireDefault(_leaflet);

var _ImageOverlay = require('../edit/layer/ImageOverlay');

var _ImageOverlay2 = _interopRequireDefault(_ImageOverlay);

var _HiddenPath = require('../draw/handler/HiddenPath');

var _HiddenPath2 = _interopRequireDefault(_HiddenPath);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _leaflet2.default.FeatureGroup.extend({
  initialize: function initialize(polygon, options) {
    this._layers = {};
    options = options || {};

    this._imageOverlay = new _ImageOverlay2.default(options);

    if (polygon) {
      var enabledTransforms = options.polygon && options.polygon.handler && options.polygon.handler.transforms ? options.polygon.handler.transforms : [];
      var i = enabledTransforms.indexOf('move');
      if (i != -1) {
        enabledTransforms[i] = { type: 'move', proxy: true, el: this._imageOverlay._image };
      }

      if (enabledTransforms.length) {
        options.polygon.handler.transforms = enabledTransforms;
      }

      this._polygon = new _HiddenPath2.default(polygon.coordinates[0].map(function (coord) {
        return _leaflet2.default.latLng(coord[1], coord[0]);
      }), options.polygon);

      this._imageOverlay.setPolygon(this._polygon);
      this._polygon.addTransformLayer(this._imageOverlay);
      this.addLayer(this._polygon);
    }

    this.addLayer(this._imageOverlay);

    var group = this;
    this.editing = {
      enable: function enable() {
        group._polygon.editing.enable();
      },
      disable: function disable() {
        group._polygon.editing.disable();
      },
      on: group._polygon.editing.on.bind(group._polygon.editing),
      off: group._polygon.editing.off.bind(group._polygon.editing)
    };
  },

  setUrl: function setUrl(url) {
    this._imageOverlay.setUrl(url);
  }
});

},{"../draw/handler/HiddenPath":96,"../edit/layer/ImageOverlay":103}],109:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _TransformPolygonWithMarkers = require('./TransformPolygonWithMarkers');

var _TransformPolygonWithMarkers2 = _interopRequireDefault(_TransformPolygonWithMarkers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _TransformPolygonWithMarkers2.default.extend({
  initialize: function initialize(polygon, markers, options) {
    _TransformPolygonWithMarkers2.default.prototype.initialize.apply(this, arguments);

    this._imageOverlay = new L.Edit.ImageOverlay(this._polygon, options.image);
    this.addLayer(this._imageOverlay);

    this._polygon.addTransformLayer(this._imageOverlay);
  }
});

},{"./TransformPolygonWithMarkers":110}],110:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _leaflet = (window.L);

var _leaflet2 = _interopRequireDefault(_leaflet);

var _DoubleBorderPolygon = require('../draw/handler/DoubleBorderPolygon');

var _DoubleBorderPolygon2 = _interopRequireDefault(_DoubleBorderPolygon);

var _TransformMarker = require('../ext/TransformMarker');

var _TransformMarker2 = _interopRequireDefault(_TransformMarker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _leaflet2.default.FeatureGroup.extend({
  includes: [_leaflet2.default.Mixin.Events],
  initialize: function initialize(polygon, markers, options) {
    this.options = options;
    this._layers = {};

    this.update(polygon, markers, true);

    var group = this;
    this.editing = {
      state: false,
      enable: function enable() {
        group.editing.state = true;
        group._polygon.editing.enable();
        group.fire("edit", { state: true });
        group._polygon._map.on('contextmenu', group._addMarker, group);
      },
      disable: function disable() {
        group.editing.state = false;
        group._polygon.editing.disable();
        group.fire("edit", { state: false });
        group._polygon._map.off('contextmenu', group._addMarker, group);
      },
      on: group.on.bind(group),
      off: group.off.bind(group)
    };
  },

  _addMarker: function _addMarker(e) {
    if (this._markers) {
      var marker = new _TransformMarker2.default(e.latlng, this.options.markers, this);
      this._polygon.addTransformLayer(marker);

      this._markers.eachLayer(function (layer) {
        layer.addLayer(marker);
      });

      this.onDoneEditing();
      e.originalEvent.preventDefault();
    }
  },

  _removeMarker: function _removeMarker(e) {
    this._markers.eachLayer(function (layer) {
      layer.removeLayer(e.target);
    });

    this.onDoneEditing();
    e.originalEvent.preventDefault();
  },

  update: function update(polygon, markers, init) {
    if (polygon) this._createPolygon(polygon);
    if (markers) {
      if (!this.options.markers.hidden) {
        this._createMarkers(markers);
        this.addLayer(this._markers);
      } else {
        this._uninitializedMarkers = markers;
      }
      if (!init) this._createMarkers(markers);
    }
  },

  _createPolygon: function _createPolygon(polygon) {
    if (this._polygon) {
      this.removeLayer(this._polygon);
      this._polygon.off('edit', this.onDoneEditing, this);
      delete this._polygon;
    }
    this._polygon = new _DoubleBorderPolygon2.default(polygon.coordinates[0].map(function (coord) {
      return _leaflet2.default.latLng(coord[1], coord[0]);
    }), this.options.polygon);

    this.addLayer(this._polygon);
    this._polygon.on('edit', this.onDoneEditing, this);
  },

  _createMarkers: function _createMarkers(markers) {
    if (this._markers) {
      this.removeLayer(this._markers);
      delete this._markers;
    }

    var group = this;
    this._markers = _leaflet2.default.geoJson(markers, {
      pointToLayer: function pointToLayer(geojson, latlng) {
        var marker = new _TransformMarker2.default(latlng, group.options.markers, group);
        group._polygon.addTransformLayer(marker);

        return marker;
      }
    });
  },

  onDoneEditing: function onDoneEditing() {
    var changes = {};
    if (this._polygon) changes.polygon = this._polygon.toGeoJSON().geometry;
    if (this._markers) changes.markers = this._markers.toGeoJSON().features.pop().geometry;

    this.fire('done', changes);
  },
  onAdd: function onAdd() {
    _leaflet2.default.FeatureGroup.prototype.onAdd.apply(this, arguments);
    this.fire("add");
  },
  toggleMarkers: function toggleMarkers(visibility) {
    if (!this._markers && this._uninitializedMarkers) {
      this._createMarkers(this._uninitializedMarkers);
    }
    if (!this._markers) return;
    if (visibility && !this.hasLayer(this._markers)) {
      this.addLayer(this._markers);
    } else if (!visibility) {
      this.removeLayer(this._markers);
    }
  }
});

},{"../draw/handler/DoubleBorderPolygon":95,"../ext/TransformMarker":107}],111:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _leaflet = (window.L);

var _leaflet2 = _interopRequireDefault(_leaflet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _leaflet2.default.TileLayer.extend({
  redraw: function redraw() {
    if (this._map) {
      this._reset({ hard: true });
      this._update();
    }

    for (var i in this._tiles) {
      this._redrawTile(this._tiles[i]);
    }
    return this;
  },
  _redrawTile: function _redrawTile(tile) {
    this._drawTile(tile, this._tilePoint, this._map._zoom);
  },
  _addTile: function _addTile(tilePoint, container) {
    var tilePos = this._getTilePos(tilePoint);

    var tile = this._getTile();
    _leaflet2.default.DomUtil.setPosition(tile.image, tilePos);
    _leaflet2.default.DomUtil.setPosition(tile.canvas, tilePos);

    this._tiles[tilePoint.x + ':' + tilePoint.y] = tile;
    this._loadTile(tile, tilePoint);

    if (tile.canvas.parentNode !== this._tileContainer) {
      container.appendChild(tile.canvas);
    }
  },

  _createTile: function _createTile() {
    var canvasTile = _leaflet2.default.DomUtil.create('canvas', 'leaflet-tile'),
        imgTile = _leaflet2.default.DomUtil.create('img', 'leaflet-tile');

    canvasTile.height = canvasTile.width = this.options.tileSize;
    imgTile.width = canvasTile.width = this.options.tileSize;
    canvasTile.onselectstart = canvasTile.onmouseove = _leaflet2.default.Util.falseFn;
    imgTile.onselectstart = imgTile.onmousemove = _leaflet2.default.Util.falseFn;

    return { image: imgTile, canvas: canvasTile };
  },

  _loadTile: function _loadTile(tile, tilePoint) {
    this._layer = this;
    this._tilePoint = tilePoint;

    this._adjustTilePoint(tilePoint);

    this.image.src = this.getTileUrl(tilePoint);
    this.image.onload = this._tileOnLoad(this, tile);
    this.image.onerror = this._tileOnError(this, tile);

    this.fire('tileloadstart', {
      tile: tile,
      url: tile.image.src
    });
  },

  _tileOnLoad: function _tileOnLoad(layer, tile) {
    return function () {
      if (this.src !== _leaflet2.default.Util.emptyImageUrl) {
        _leaflet2.default.DomUtil.addClass(tile.canvas, 'leaflet-tile-loaded');
        _leaflet2.default.DomUtil.addClass(tile.image, 'leaflet-tile-loaded');

        layer.fire('tileload', {
          tile: this,
          url: this.src
        });
      }

      layer._redrawTile(tile);
      layer._tileLoaded();
    };
  },

  _tileOnError: function _tileOnError(layer, tile) {
    return function () {
      layer.fire('tileerror', {
        tile: this,
        url: this.src
      });

      layer._tileLoaded();
    };
  },

  _tileLoaded: function _tileLoaded() {
    this._tilesToLoad--;

    if (!this._tilesToLoad) {
      this.fire('load');
    }
  },

  flipY: function flipY(y, z) {
    return Math.pow(2, z) - y - 1;
  },

  toRad: function toRad(n) {
    return n * Math.PI / 180;
  },

  getHeightForPoint: function getHeightForPoint(lat, lon) {
    var zoom = this._map.getZoom(),
        tileSize = this._getTileSize();
    x = (lon + 180) / 360 * (1 << zoom), y = (1 - Math.log(Math.tan(this.toRad(lat)) + 1 / Math.cos(this.toRad(lat))) / Math.PI) / 2 * (1 << zoom), xTile = parseInt(Math.floor(x)), yTile = parseInt(Math.floor(y)), tileX = Math.floor((x - xTile) * tileSize / 1.0), tileY = Math.floor((y - yTile) * tileSize / 1.0);

    var tile = this._tiles[xTile + ':' + yTile];
    var offset = tileY * tileSize + tileX;

    if (tile && tile.floatData) {
      if (this.options.debug) {
        $('canvas').css({
          border: 'none'
        });
        $(tile.canvas).css({
          border: '2px solid red'
        });
      }

      return tile.floatData[offset];
    }
  },

  drawTile: function drawTile(tile, tilePoint, zoom) {
    var ctx = tile.canvas.getContext('2d');
    ctx.drawImage(tile.image, 0, 0);
    var imageData = ctx.getImageData(0, 0, tile.canvas.width, tile.canvas.height);
    tile.buffer = imageData.data.buffer;
    this.floatData = new Float32Array(tile.buffer);
  },

  tileDrawn: function tileDrawn(tile) {
    this._tileOnLoad.call(tile);
  }
});

},{}],112:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = require("babel-runtime/helpers/slicedToArray");

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _leaflet = (window.L);

var _leaflet2 = _interopRequireDefault(_leaflet);

var _affinefit = require("affinefit");

var _affinefit2 = _interopRequireDefault(_affinefit);

var _nudged = require("nudged");

var _nudged2 = _interopRequireDefault(_nudged);

var _matrixmath = require("matrixmath");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var proto = _leaflet2.default.TileLayer.prototype;
var TRANSLATE_REGEX = /translate(3d)?\(.+?\)/gi;
var MATRIX_REGEX = /matrix\(.+?\)/gi;
var SCALE_REGEX = /scale\(.+?\)/gi;

exports.default = _leaflet2.default.TileLayer.extend({
  initialize: function initialize(url, options) {
    proto.initialize.call(this, url, options);
    this.setControlPoints(options.controlPoints);
  },

  setControlPoints: function setControlPoints(controlPoints) {
    this.controlPoints = controlPoints || { source: [], destination: [] };
    if (this._map) {
      this._updateLayerTransform();
    }
    return this;
  },

  /**
   * Applies the inverse transform on a point.
   */
  inverseTransformPoint: function inverseTransformPoint(point) {
    var projection = this._mapProjection.bind(this);
    var matrix = this._getTransformMatrix(projection, projection);
    if (matrix) {
      var inverse = matrix.clone().invert();
      return this._transformPoint(inverse, point);
    }
    return point;
  },

  /**
   * Applies the inverse transform on a latlng point.
   */
  inverseTransformLatLng: function inverseTransformLatLng(latlng) {
    var point = this._mapProjection(latlng);
    var transformed = this.inverseTransformPoint(point);
    return this._map.layerPointToLatLng([transformed.x, transformed.y]);
  },

  _reset: function _reset(e) {
    proto._reset.call(this, e);
    if (this._map) {
      this._resizeLayer();
      this._updateLayerTransform();
    }
  },

  /**
   * Override this method to record the previous zoom.
   */
  _animateZoom: function _animateZoom(e) {
    this._prevZoom = this._map.getZoom();
    proto._animateZoom.call(this, e);
  },

  /**
   * Override this method and subtract origin so that tiles are positioned relative to
   * the container.
   */
  _getTilePos: function _getTilePos(tilePoint) {
    var origin = this._getOrigin(this._mapProjection.bind(this));
    var pos = proto._getTilePos.call(this, tilePoint);
    return pos.subtract(origin);
  },

  /**
   * Override this method to load tiles correctly. The issue was that leaflet only loads tiles that
   * are visible in the map's viewport. Since our tiles are transformed, if the original
   * bounds of the tiles aren't visible, leaflet won't load them (even though the transformed bounds
   * are visible).
   */
  _addTilesFromCenterOut: function _addTilesFromCenterOut(pixelBounds) {
    var inversed = this._inverseTransformPixelBounds(pixelBounds);
    proto._addTilesFromCenterOut.call(this, inversed);
  },

  /**
   * Same as above.
   */
  _removeOtherTiles: function _removeOtherTiles(pixelBounds) {
    var inversed = this._inverseTransformPixelBounds(pixelBounds);
    proto._removeOtherTiles.call(this, inversed);
  },

  _inverseTransformPixelBounds: function _inverseTransformPixelBounds(pixelBounds) {
    var bounds = this._pixelToLatLngBounds(pixelBounds);
    var inversedBounds = _leaflet2.default.latLngBounds([this.inverseTransformLatLng(bounds.getNorthWest()), this.inverseTransformLatLng(bounds.getSouthEast())]);
    return this._latLngToPixelBounds(inversedBounds);
  },

  _pixelToLatLngBounds: function _pixelToLatLngBounds(pixelBounds) {
    var tileSize = this._getTileSize();
    var nwPoint = pixelBounds.min.multiplyBy(tileSize);
    var sePoint = pixelBounds.max.multiplyBy(tileSize);
    return _leaflet2.default.latLngBounds(this._map.unproject(nwPoint), this._map.unproject(sePoint));
  },

  _latLngToPixelBounds: function _latLngToPixelBounds(bounds) {
    var tileSize = this._getTileSize();
    var nwPoint = this._map.project(bounds.getNorthWest());
    var sePoint = this._map.project(bounds.getSouthEast());
    return new _leaflet2.default.Bounds(nwPoint.divideBy(tileSize).subtract([1, 1]).floor(), sePoint.divideBy(tileSize).add([1, 1]).round());
  },

  /**
   * Sets the correct size on the tile layer container as if it were a regular layer.
   */
  _resizeLayer: function _resizeLayer() {
    var bounds = this.options.bounds;

    var nw = this._mapProjection(bounds.getNorthWest());
    var se = this._mapProjection(bounds.getSouthEast());
    var size = se.subtract(nw);

    var translate = _leaflet2.default.DomUtil.getTranslateString(nw);
    this._updateElemTransform(this._tileContainer, { translate: translate });
    this._tileContainer.style.transformOrigin = "0 0 0";

    this._tileContainer.style.width = size.x + "px";
    this._tileContainer.style.height = size.y + "px";
    if (this._bgBuffer) {
      this._bgBuffer.style.width = size.x + "px";
      this._bgBuffer.style.height = size.y + "px";
    }
  },

  /**
   * Update the layer and position it based on the current control points.
   */
  _updateLayerTransform: function _updateLayerTransform() {
    if (this._map) {
      var projection = this._mapProjection.bind(this);
      this._applyTransform(this._tileContainer, projection);
      if (this._shouldApplyPrevZoomTransform()) {
        var prevZoomProjection = this._zoomProjection.bind(this, this._prevZoom);
        this._applyTransform(this._bgBuffer, prevZoomProjection);
      }
    }
  },

  _shouldApplyPrevZoomTransform: function _shouldApplyPrevZoomTransform() {
    return this._prevZoom && this._bgBuffer && this._bgBuffer.children.length > 0;
  },

  _mapProjection: function _mapProjection(latlng) {
    return this._map.latLngToLayerPoint(latlng);
  },

  _zoomProjection: function _zoomProjection(zoom, latlng) {
    return this._map._latLngToNewLayerPoint(latlng, zoom, this._map.getCenter());
  },

  _getOrigin: function _getOrigin(projection) {
    return projection(this.options.bounds.getNorthWest());
  },

  _ptToArr: function _ptToArr(_ref) {
    var x = _ref.x;
    var y = _ref.y;
    return [x, y];
  },

  _projectControlPoints: function _projectControlPoints(points, projection, origin) {
    var projected = points.map(projection).map(this._ptToArr);
    if (origin) {
      projected = this._subtractOrigin(projected, origin);
    }
    return projected;
  },

  _subtractOrigin: function _subtractOrigin(points, origin) {
    return points.map(function (_ref2) {
      var _ref3 = (0, _slicedToArray3.default)(_ref2, 2);

      var x = _ref3[0];
      var y = _ref3[1];
      return [x - origin.x, y - origin.y];
    });
  },

  _transformPoint: function _transformPoint(matrix, point) {
    var pointVector = new _matrixmath.Matrix(3, 1);
    pointVector.setData([point.x, point.y, 1]);

    var _matrix$clone$multipl = matrix.clone().multiply(pointVector).toArray();

    var _matrix$clone$multipl2 = (0, _slicedToArray3.default)(_matrix$clone$multipl, 2);

    var x = _matrix$clone$multipl2[0];
    var y = _matrix$clone$multipl2[1];

    return { x: x, y: y };
  },

  _getTransformMatrix: function _getTransformMatrix(sourceProjection, destinationProjection, origin) {
    var _controlPoints = this.controlPoints;
    var source = _controlPoints.source;
    var destination = _controlPoints.destination;

    var sourcePoints = this._projectControlPoints(source, sourceProjection, origin);
    var destinationPoints = this._projectControlPoints(destination, destinationProjection, origin);

    var transform;
    var matrix = new _matrixmath.Matrix(3, 3);
    if (sourcePoints.length >= 3) {
      // When we have 3 or more control points, use the affineFit library which produces better transforms.
      transform = (0, _affinefit2.default)(sourcePoints, destinationPoints);
      matrix.setData([
      /*      a      */ /*      c      */ /*      e      */
      transform.M[0][3], transform.M[1][3], transform.M[2][3],
      /*      b      */ /*      d      */ /*      f      */
      transform.M[0][4], transform.M[1][4], transform.M[2][4], 0, 0, 1]);
    } else {
      // When we have less than 3 control points, use Nudged which accepts any number of points.
      transform = _nudged2.default.estimate("TSR", sourcePoints, destinationPoints);

      var _transform$getMatrix = transform.getMatrix();

      var a = _transform$getMatrix.a;
      var b = _transform$getMatrix.b;
      var c = _transform$getMatrix.c;
      var d = _transform$getMatrix.d;
      var e = _transform$getMatrix.e;
      var f = _transform$getMatrix.f;

      matrix.setData([a, c, e, b, d, f, 0, 0, 1]);
    }
    return matrix;
  },

  _getCSSTransformMatrix: function _getCSSTransformMatrix(matrix) {
    //     [   a     ,    b     ,    c     ,    d     ,    e     ,    f     ]
    return [matrix[0], matrix[3], matrix[1], matrix[4], matrix[2], matrix[5]];
  },

  _applyTransform: function _applyTransform(elem, projection) {
    var origin = this._getOrigin(projection);
    var transformMatrix = this._getTransformMatrix(projection, projection, origin);
    if (transformMatrix) {
      var cssMatrix = this._getCSSTransformMatrix(transformMatrix);
      var matrix = "matrix(" + cssMatrix.join(",") + ")";
      this._updateElemTransform(elem, { matrix: matrix });
    }
  },

  _updateElemTransform: function _updateElemTransform(elem, _ref4) {
    var _this = this;

    var translate = _ref4.translate;
    var scale = _ref4.scale;
    var matrix = _ref4.matrix;

    var changes = [[TRANSLATE_REGEX, translate], [SCALE_REGEX, scale], [MATRIX_REGEX, matrix]];
    var newTransform = changes.reduce(function (transform, _ref5) {
      var _ref6 = (0, _slicedToArray3.default)(_ref5, 2);

      var regex = _ref6[0];
      var newValue = _ref6[1];
      return _this._replaceTransform(transform, regex, newValue);
    }, elem.style.transform || "");
    elem.style.transform = newTransform;
  },

  _replaceTransform: function _replaceTransform(transform, regex, newValue) {
    if (newValue) {
      return transform.replace(regex, "") + " " + newValue;
    }
    return transform;
  }
});

},{"affinefit":1,"babel-runtime/helpers/slicedToArray":9,"matrixmath":83,"nudged":84}]},{},[94]);
