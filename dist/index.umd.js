(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('vue')) :
  typeof define === 'function' && define.amd ? define(['vue'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global['vue3-mq'] = factory(global.vue));
}(this, (function (vue) { 'use strict';

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var camel2hyphen = function (str) {
    return str
            .replace(/[A-Z]/g, function (match) {
              return '-' + match.toLowerCase();
            })
            .toLowerCase();
  };

  var camel2hyphen_1 = camel2hyphen;

  var isDimension = function (feature) {
    var re = /[height|width]$/;
    return re.test(feature);
  };

  var obj2mq = function (obj) {
    var mq = '';
    var features = Object.keys(obj);
    features.forEach(function (feature, index) {
      var value = obj[feature];
      feature = camel2hyphen_1(feature);
      // Add px to dimension features
      if (isDimension(feature) && typeof value === 'number') {
        value = value + 'px';
      }
      if (value === true) {
        mq += feature;
      } else if (value === false) {
        mq += 'not ' + feature;
      } else {
        mq += '(' + feature + ': ' + value + ')';
      }
      if (index < features.length-1) {
        mq += ' and ';
      }
    });
    return mq;
  };

  var json2mq = function (query) {
    var mq = '';
    if (typeof query === 'string') {
      return query;
    }
    // Handling array of media queries
    if (query instanceof Array) {
      query.forEach(function (q, index) {
        mq += obj2mq(q);
        if (index < query.length-1) {
          mq += ', ';
        }
      });
      return mq;
    }
    // Handling single media query
    return obj2mq(query);
  };

  var json2mq_1 = json2mq;

  var state = {
    mqAvailableBreakpoints: vue.ref({}),
    currentBreakpoint: vue.ref("")
  };
  var setAvailableBreakpoints = function setAvailableBreakpoints(v) {
    return state.mqAvailableBreakpoints.value = v;
  };
  var mqAvailableBreakpoints = vue.readonly(state.mqAvailableBreakpoints);
  var setCurrentBreakpoint = function setCurrentBreakpoint(v) {
    return state.currentBreakpoint.value = v;
  };
  var currentBreakpoint = vue.readonly(state.currentBreakpoint);
  function updateBreakpoints(breakpoints) {
    // Remove any existing MQ listeners
    for (var i = listeners.length - 1; i >= 0; i--) {
      var _listeners$i = listeners[i],
          mql = _listeners$i.mql,
          cb = _listeners$i.cb;
      mql.removeEventListener('change', cb);
      listeners.splice(i, 1);
    } // Save new breakpoints to reactive variable


    setAvailableBreakpoints(breakpoints); // Create css media queries from breakpoints

    var mediaQueries = convertBreakpointsToMediaQueries(breakpoints); // Add new MQ listeners

    var _loop = function _loop(key) {
      var mediaQuery = mediaQueries[key];

      var enter = function enter() {
        setCurrentBreakpoint(key);
      };

      subscribeToMediaQuery(mediaQuery, enter);
    };

    for (var key in mediaQueries) {
      _loop(key);
    }
  }

  var listeners = [];
  function convertBreakpointsToMediaQueries(breakpoints) {
    var keys = Object.keys(breakpoints);
    var values = keys.map(function (key) {
      return breakpoints[key];
    });
    var breakpointValues = [0].concat(_toConsumableArray(values.slice(0, -1)));
    var mediaQueries = breakpointValues.reduce(function (accumulator, current, index) {
      var options = Object.assign({
        minWidth: current
      }, index < keys.length - 1 ? {
        maxWidth: breakpointValues[index + 1] - 1
      } : {});
      var mediaQuery = json2mq_1(options);
      return Object.assign(accumulator, _defineProperty({}, keys[index], mediaQuery));
    }, {});
    return mediaQueries;
  }
  function selectBreakpoints(_ref) {
    var mqProp = _ref.mqProp,
        _ref$isMqPlus = _ref.isMqPlus,
        isMqPlus = _ref$isMqPlus === void 0 ? {
      value: false
    } : _ref$isMqPlus,
        _ref$isMqMinus = _ref.isMqMinus,
        isMqMinus = _ref$isMqMinus === void 0 ? {
      value: false
    } : _ref$isMqMinus,
        _ref$isMqRange = _ref.isMqRange,
        isMqRange = _ref$isMqRange === void 0 ? {
      value: false
    } : _ref$isMqRange;
    var ents = Object.entries(mqAvailableBreakpoints.value);
    if (ents.length === 0) return [];
    if (isMqPlus.value) mqProp = mqProp.replace(/\+$/, "");else if (isMqMinus.value) mqProp = mqProp.replace(/-$/, "");else if (isMqRange.value) {
      mqProp = mqProp.split("-");
      if (!mqProp || mqProp.length !== 2) throw new Error("Invalid MQ range provided");
    }
    var eligible;

    if (isMqRange.value) {
      var from = ents.find(function (_ref2) {
        var _ref3 = _slicedToArray(_ref2, 2),
            key = _ref3[0],
            value = _ref3[1];

        return key == mqProp[0].trim();
      });
      if (!from || from.length === 0) throw new Error('Range from breakpoint (' + mqProp[0].trim() + ') not found');
      var to = ents.find(function (_ref4) {
        var _ref5 = _slicedToArray(_ref4, 2),
            key = _ref5[0],
            value = _ref5[1];

        return key == mqProp[1].trim();
      });
      if (!to || to.length === 0) throw new Error('Range to breakpoint (' + mqProp[1].trim() + ') not found');

      if (from[1] > to[1]) {
        var _ref6 = [to, from];
        from = _ref6[0];
        to = _ref6[1];
      }

      eligible = ents.filter(function (_ref7) {
        var _ref8 = _slicedToArray(_ref7, 2),
            key = _ref8[0],
            value = _ref8[1];

        return value >= from[1] && value <= to[1];
      });
    } else {
      var base = ents.find(function (_ref9) {
        var _ref10 = _slicedToArray(_ref9, 2),
            key = _ref10[0],
            value = _ref10[1];

        return key == mqProp;
      });
      if (isMqPlus.value) eligible = ents.filter(function (_ref11) {
        var _ref12 = _slicedToArray(_ref11, 2),
            key = _ref12[0],
            value = _ref12[1];

        return value >= base[1];
      });else if (isMqMinus.value) eligible = ents.filter(function (_ref13) {
        var _ref14 = _slicedToArray(_ref13, 2),
            key = _ref14[0],
            value = _ref14[1];

        return value <= base[1];
      });
    }

    eligible.sort(function (a, b) {
      return a[1] - b[1];
    });
    return eligible.map(function (el) {
      return el[0];
    });
  }
  function subscribeToMediaQuery(mediaQuery, enter) {
    var mql = window.matchMedia(mediaQuery);

    var cb = function cb(_ref15) {
      var matches = _ref15.matches;
      if (matches) enter();
    };

    listeners.push({
      mql: mql,
      cb: cb
    });
    mql.addEventListener('change', cb); //subscribing

    cb(mql); //initial trigger
  }

  // USAGE // mq-layout(mq="lg") // p I’m lg
  var MqLayout = {
    name: "MqLayout",
    props: {
      mq: {
        required: true,
        type: [Object]
      },
      tag: {
        type: String,
        "default": "div"
      }
    },
    setup: function setup(props, context) {
      /*
      props.mq
      ['sm','md','lg'] ( respond to sm, md and lg )
      md+ ( respond to md and above )
      -lg ( respond to lg and below )
      sm-lg ( respond to sm, md and lg )
      */
      var isMqArray = vue.computed(function () {
        return Array.isArray(props.mq);
      });
      var isMqPlus = vue.computed(function () {
        return !isMqArray.value && /\+$/.test(props.mq) === true;
      });
      var isMqMinus = vue.computed(function () {
        return !isMqArray.value && /-$/.test(props.mq) === true;
      });
      var isMqRange = vue.computed(function () {
        return !isMqArray.value && /^\w*-\w*/.test(props.mq) === true;
      });
      /*
      const plusModifier = computed(
          () => !Array.isArray(props.mq) && props.mq.slice(-1) === "+"
      );
      */
      // Add a minus modifier here

      var activeBreakpoints = vue.computed(function () {
        if (isMqArray.value) return props.mq;else if (!isMqPlus.value && !isMqMinus.value && !isMqRange.value) return [props.mq];else {
          console.log(mqAvailableBreakpoints.value);
          return selectBreakpoints({
            mqProp: props.mq,
            isMqPlus: isMqPlus,
            isMqMinus: isMqMinus,
            isMqRange: isMqRange
          });
        }
      });
      var shouldRenderChildren = vue.computed(function () {
        return activeBreakpoints.value.includes(currentBreakpoint.value);
      });
      return function () {
        return shouldRenderChildren.value ? vue.h(props.tag, {}, context.slots["default"]()) : vue.h();
      };
    }
  };

  var DEFAULT_BREAKPOINTS = {
    sm: 450,
    md: 1250,
    lg: Infinity
  };

  var install = function install(app) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$breakpoints = _ref.breakpoints,
        breakpoints = _ref$breakpoints === void 0 ? DEFAULT_BREAKPOINTS : _ref$breakpoints,
        _ref$defaultBreakpoin = _ref.defaultBreakpoint,
        defaultBreakpoint = _ref$defaultBreakpoin === void 0 ? 'sm' : _ref$defaultBreakpoin;

    var hasSetupListeners = false;
    setCurrentBreakpoint(defaultBreakpoint);
    app.provide('updateBreakpoints', updateBreakpoints); // Init reactive component

    app.mixin({
      computed: {
        $mq: function $mq() {
          return currentBreakpoint.value;
        }
      },
      mounted: function mounted() {
        if (!hasSetupListeners) {
          updateBreakpoints(breakpoints);
          hasSetupListeners = true;
        }
      }
    });
    app.config.globalProperties.$mqAvailableBreakpoints = breakpoints;
    app.component('MqLayout', MqLayout);
  };

  var index = {
    install: install
  };

  return index;

})));
