(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/assign"), __esModule: true };
},{"core-js/library/fn/object/assign":5}],2:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/symbol"), __esModule: true };
},{"core-js/library/fn/symbol":6}],3:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/symbol/iterator"), __esModule: true };
},{"core-js/library/fn/symbol/iterator":7}],4:[function(require,module,exports){
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
},{"babel-runtime/core-js/symbol":2,"babel-runtime/core-js/symbol/iterator":3}],5:[function(require,module,exports){
require('../../modules/es6.object.assign');
module.exports = require('../../modules/_core').Object.assign;
},{"../../modules/_core":13,"../../modules/es6.object.assign":64}],6:[function(require,module,exports){
require('../../modules/es6.symbol');
require('../../modules/es6.object.to-string');
module.exports = require('../../modules/_core').Symbol;
},{"../../modules/_core":13,"../../modules/es6.object.to-string":65,"../../modules/es6.symbol":67}],7:[function(require,module,exports){
require('../../modules/es6.string.iterator');
require('../../modules/web.dom.iterable');
module.exports = require('../../modules/_wks')('iterator');
},{"../../modules/_wks":62,"../../modules/es6.string.iterator":66,"../../modules/web.dom.iterable":68}],8:[function(require,module,exports){
module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};
},{}],9:[function(require,module,exports){
module.exports = function(){ /* empty */ };
},{}],10:[function(require,module,exports){
var isObject = require('./_is-object');
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};
},{"./_is-object":29}],11:[function(require,module,exports){
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
},{"./_to-index":55,"./_to-iobject":57,"./_to-length":58}],12:[function(require,module,exports){
var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};
},{}],13:[function(require,module,exports){
var core = module.exports = {version: '2.2.1'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
},{}],14:[function(require,module,exports){
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
},{"./_a-function":8}],15:[function(require,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};
},{}],16:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./_fails":21}],17:[function(require,module,exports){
var isObject = require('./_is-object')
  , document = require('./_global').document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};
},{"./_global":22,"./_is-object":29}],18:[function(require,module,exports){
// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');
},{}],19:[function(require,module,exports){
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
},{"./_object-gops":44,"./_object-keys":47,"./_object-pie":48}],20:[function(require,module,exports){
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
},{"./_core":13,"./_ctx":14,"./_global":22,"./_hide":24}],21:[function(require,module,exports){
module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};
},{}],22:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
},{}],23:[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};
},{}],24:[function(require,module,exports){
var dP         = require('./_object-dp')
  , createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function(object, key, value){
  return dP.f(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};
},{"./_descriptors":16,"./_object-dp":39,"./_property-desc":49}],25:[function(require,module,exports){
module.exports = require('./_global').document && document.documentElement;
},{"./_global":22}],26:[function(require,module,exports){
module.exports = !require('./_descriptors') && !require('./_fails')(function(){
  return Object.defineProperty(require('./_dom-create')('div'), 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./_descriptors":16,"./_dom-create":17,"./_fails":21}],27:[function(require,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./_cof');
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};
},{"./_cof":12}],28:[function(require,module,exports){
// 7.2.2 IsArray(argument)
var cof = require('./_cof');
module.exports = Array.isArray || function isArray(arg){
  return cof(arg) == 'Array';
};
},{"./_cof":12}],29:[function(require,module,exports){
module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};
},{}],30:[function(require,module,exports){
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
},{"./_hide":24,"./_object-create":38,"./_property-desc":49,"./_set-to-string-tag":51,"./_wks":62}],31:[function(require,module,exports){
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
},{"./_export":20,"./_has":23,"./_hide":24,"./_iter-create":30,"./_iterators":33,"./_library":35,"./_object-gpo":45,"./_redefine":50,"./_set-to-string-tag":51,"./_wks":62}],32:[function(require,module,exports){
module.exports = function(done, value){
  return {value: value, done: !!done};
};
},{}],33:[function(require,module,exports){
module.exports = {};
},{}],34:[function(require,module,exports){
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
},{"./_object-keys":47,"./_to-iobject":57}],35:[function(require,module,exports){
module.exports = true;
},{}],36:[function(require,module,exports){
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
},{"./_fails":21,"./_has":23,"./_is-object":29,"./_object-dp":39,"./_uid":61}],37:[function(require,module,exports){
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
},{"./_fails":21,"./_iobject":27,"./_object-gops":44,"./_object-keys":47,"./_object-pie":48,"./_to-object":59}],38:[function(require,module,exports){
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
},{"./_an-object":10,"./_dom-create":17,"./_enum-bug-keys":18,"./_html":25,"./_object-dps":40,"./_shared-key":52}],39:[function(require,module,exports){
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
},{"./_an-object":10,"./_descriptors":16,"./_ie8-dom-define":26,"./_to-primitive":60}],40:[function(require,module,exports){
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
},{"./_an-object":10,"./_descriptors":16,"./_object-dp":39,"./_object-keys":47}],41:[function(require,module,exports){
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
},{"./_descriptors":16,"./_has":23,"./_ie8-dom-define":26,"./_object-pie":48,"./_property-desc":49,"./_to-iobject":57,"./_to-primitive":60}],42:[function(require,module,exports){
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

},{"./_object-gopn":43,"./_to-iobject":57}],43:[function(require,module,exports){
// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys      = require('./_object-keys-internal')
  , hiddenKeys = require('./_enum-bug-keys').concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
  return $keys(O, hiddenKeys);
};
},{"./_enum-bug-keys":18,"./_object-keys-internal":46}],44:[function(require,module,exports){
exports.f = Object.getOwnPropertySymbols;
},{}],45:[function(require,module,exports){
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
},{"./_has":23,"./_shared-key":52,"./_to-object":59}],46:[function(require,module,exports){
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
},{"./_array-includes":11,"./_has":23,"./_shared-key":52,"./_to-iobject":57}],47:[function(require,module,exports){
// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys       = require('./_object-keys-internal')
  , enumBugKeys = require('./_enum-bug-keys');

module.exports = Object.keys || function keys(O){
  return $keys(O, enumBugKeys);
};
},{"./_enum-bug-keys":18,"./_object-keys-internal":46}],48:[function(require,module,exports){
exports.f = {}.propertyIsEnumerable;
},{}],49:[function(require,module,exports){
module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};
},{}],50:[function(require,module,exports){
module.exports = require('./_hide');
},{"./_hide":24}],51:[function(require,module,exports){
var def = require('./_object-dp').f
  , has = require('./_has')
  , TAG = require('./_wks')('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};
},{"./_has":23,"./_object-dp":39,"./_wks":62}],52:[function(require,module,exports){
var shared = require('./_shared')('keys')
  , uid    = require('./_uid');
module.exports = function(key){
  return shared[key] || (shared[key] = uid(key));
};
},{"./_shared":53,"./_uid":61}],53:[function(require,module,exports){
var global = require('./_global')
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};
},{"./_global":22}],54:[function(require,module,exports){
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
},{"./_defined":15,"./_to-integer":56}],55:[function(require,module,exports){
var toInteger = require('./_to-integer')
  , max       = Math.max
  , min       = Math.min;
module.exports = function(index, length){
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};
},{"./_to-integer":56}],56:[function(require,module,exports){
// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};
},{}],57:[function(require,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./_iobject')
  , defined = require('./_defined');
module.exports = function(it){
  return IObject(defined(it));
};
},{"./_defined":15,"./_iobject":27}],58:[function(require,module,exports){
// 7.1.15 ToLength
var toInteger = require('./_to-integer')
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};
},{"./_to-integer":56}],59:[function(require,module,exports){
// 7.1.13 ToObject(argument)
var defined = require('./_defined');
module.exports = function(it){
  return Object(defined(it));
};
},{"./_defined":15}],60:[function(require,module,exports){
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
},{"./_is-object":29}],61:[function(require,module,exports){
var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};
},{}],62:[function(require,module,exports){
var store      = require('./_shared')('wks')
  , uid        = require('./_uid')
  , Symbol     = require('./_global').Symbol
  , USE_SYMBOL = typeof Symbol == 'function';
module.exports = function(name){
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};
},{"./_global":22,"./_shared":53,"./_uid":61}],63:[function(require,module,exports){
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
},{"./_add-to-unscopables":9,"./_iter-define":31,"./_iter-step":32,"./_iterators":33,"./_to-iobject":57}],64:[function(require,module,exports){
// 19.1.3.1 Object.assign(target, source)
var $export = require('./_export');

$export($export.S + $export.F, 'Object', {assign: require('./_object-assign')});
},{"./_export":20,"./_object-assign":37}],65:[function(require,module,exports){

},{}],66:[function(require,module,exports){
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
},{"./_iter-define":31,"./_string-at":54}],67:[function(require,module,exports){
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
},{"./_an-object":10,"./_core":13,"./_descriptors":16,"./_enum-keys":19,"./_export":20,"./_fails":21,"./_global":22,"./_has":23,"./_hide":24,"./_is-array":28,"./_keyof":34,"./_library":35,"./_meta":36,"./_object-create":38,"./_object-dp":39,"./_object-gopd":41,"./_object-gopn":43,"./_object-gopn-ext":42,"./_object-gops":44,"./_object-pie":48,"./_property-desc":49,"./_redefine":50,"./_set-to-string-tag":51,"./_shared":53,"./_to-iobject":57,"./_to-primitive":60,"./_uid":61,"./_wks":62}],68:[function(require,module,exports){
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
},{"./_global":22,"./_hide":24,"./_iterators":33,"./_wks":62,"./es6.array.iterator":63}],69:[function(require,module,exports){
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_leaflet2.default.TransformPolygonWithImageOverlay = _TransformPolygonWithImageOverlay2.default;
_leaflet2.default.TransformImageOverlay = _TransformImageOverlay2.default;
_leaflet2.default.TransformPolygonWithMarkers = _TransformPolygonWithMarkers2.default;
_leaflet2.default.DoubleBorderPolygon = _DoubleBorderPolygon2.default;

},{"./draw/handler/DoubleBorderPolygon":70,"./feature/TransformImageOverlay":83,"./feature/TransformPolygonWithImageOverlay":84,"./feature/TransformPolygonWithMarkers":85}],70:[function(require,module,exports){
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

},{"../../edit/handler/PolyGroup":75,"babel-runtime/core-js/object/assign":1}],71:[function(require,module,exports){
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

},{"../../edit/handler/SimplePolyGroup":76}],72:[function(require,module,exports){
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

},{}],73:[function(require,module,exports){
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
		this._toggleCornerMarkers(1);
		this._repositionAllMarkers();

		_SimpleShape2.default.prototype._onMarkerDragEnd.call(this, e);
	},

	projectionMethods: {
		pre: "latLngToLayerPoint",
		post: "layerPointToLatLng"
	},

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
		getMovePoint: function getMovePoint() {
			return this._origCenter();
		},
		events: {
			move: function move(newPos) {
				var tx = new _AffineTransform.Transform(this._map, this.projectionMethods).move(this.getMovePoint(), newPos);
				this._shape.setLatLngs(tx.apply(this._origLatLngs));
				this._repositionAllMarkers();

				return tx;
			},
			resize: function resize(latlng) {
				var tx = new _AffineTransform.Transform(this._map, this.projectionMethods).resize(this._oppositeCorner, this._currentCorner, latlng);
				this._shape.setLatLngs(tx.apply(this._origLatLngs));
				this._repositionAllMarkers();

				return tx;
			},
			rotate: function rotate(latlng) {
				var tx = new _AffineTransform.Transform(this._map, this.projectionMethods).rotateFrom(this._origAngle - Math.PI / 2, this._origCenter, latlng);
				this._angle = this._origAngle + tx.getAngle();
				this._shape.setLatLngs(tx.apply(this._origLatLngs));
				this._repositionAllMarkers();

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

	_repositionAllMarkers: function _repositionAllMarkers() {
		var corners = this._getCorners();

		if (this._resizeMarkers) {
			for (var i = 0, l = this._resizeMarkers.length; i < l; i++) {
				this._resizeMarkers[i].setLatLng(corners[i]);
			}
		}

		if (this._moveMarker) {
			this._moveMarker.setLatLng(this._getCenter());
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

},{"../../ext/AffineTransform":79,"../../ext/LineMarker":80,"./MoveProxy":72,"./SimpleShape":77}],74:[function(require,module,exports){
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

},{"./Path":73}],75:[function(require,module,exports){
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

var transforms = PolyGroup.prototype.transforms;
["move", "resize", "rotate"].forEach(function (mouseEvent) {
  var ev = transforms.events[mouseEvent];
  transforms.events[mouseEvent] = function (pt) {
    this._tx = ev.apply(this, arguments);
    this._updateTransformLayers(this._tx);
  };
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

},{"./Poly":74}],76:[function(require,module,exports){
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

var transforms = SimplePolyGroup.prototype.transforms;
["move", "resize", "rotate"].forEach(function (mouseEvent) {
  var ev = transforms.events[mouseEvent];
  transforms.events[mouseEvent] = function (pt) {
    this._tx = ev.apply(this, arguments);
    this._updateTransformLayers(this._tx);
  };
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

},{"./Path":73}],77:[function(require,module,exports){
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
			iconSize: new _leaflet2.default.Point(8, 8),
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

},{"../../ext/MarkerExt":81,"babel-runtime/helpers/typeof":4}],78:[function(require,module,exports){
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
  }
});

},{}],79:[function(require,module,exports){
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

},{"babel-runtime/helpers/typeof":4}],80:[function(require,module,exports){
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

},{}],81:[function(require,module,exports){
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

},{}],82:[function(require,module,exports){
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

},{}],83:[function(require,module,exports){
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

},{"../draw/handler/HiddenPath":71,"../edit/layer/ImageOverlay":78}],84:[function(require,module,exports){
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

},{"./TransformPolygonWithMarkers":85}],85:[function(require,module,exports){
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

    if (polygon) {
      this._polygon = new _DoubleBorderPolygon2.default(polygon.coordinates[0].map(function (coord) {
        return _leaflet2.default.latLng(coord[1], coord[0]);
      }), this.options.polygon);

      this.addLayer(this._polygon);
    }

    var group = this;
    if (markers) {
      this._markers = _leaflet2.default.geoJson(markers, {
        pointToLayer: function pointToLayer(geojson, latlng) {
          var marker = new _TransformMarker2.default(latlng, group.options.markers, group);
          group._polygon.addTransformLayer(marker);

          marker.on('dragend', group.onDoneEditing.bind(group));

          return marker;
        }
      });

      this.addLayer(this._markers);
    }

    this._polygon.on('edit', group.onDoneEditing.bind(group));

    this.editing = {
      state: false,
      enable: function enable() {
        group.editing.state = true;
        group._polygon.editing.enable();
        group.fire("edit", { state: true });
      },
      disable: function disable() {
        group.editing.state = false;
        group._polygon.editing.disable();
        group.fire("edit", { state: false });
      },
      on: group.on.bind(group),
      off: group.off.bind(group)
    };
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
  }
});

},{"../draw/handler/DoubleBorderPolygon":70,"../ext/TransformMarker":82}]},{},[69]);
