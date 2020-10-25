'use strict';

var json2mq = require('json2mq');
var vue = require('vue');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var json2mq__default = /*#__PURE__*/_interopDefaultLegacy(json2mq);

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

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
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

function convertBreakpointsToMediaQueries(breakpoints) {
  var keys = Object.keys(breakpoints);
  var values = keys.map(function (key) {
    return breakpoints[key];
  });
  var breakpointValues = [0].concat(_toConsumableArray(values.slice(0, -1)));
  var mediaQueries = breakpointValues.reduce(function (sum, value, index) {
    var options = Object.assign({
      minWidth: value
    }, index < keys.length - 1 ? {
      maxWidth: breakpointValues[index + 1] - 1
    } : {});
    var mediaQuery = json2mq__default['default'](options);
    return Object.assign(sum, _defineProperty({}, keys[index], mediaQuery));
  }, {});
  return mediaQueries;
}
function selectBreakpoints(breakpoints, currentBreakpoint) {
  var index = breakpoints.findIndex(function (b) {
    return b === currentBreakpoint;
  });
  return breakpoints.slice(index);
}
function subscribeToMediaQuery(mediaQuery, enter) {
  var mql = window.matchMedia(mediaQuery);

  var cb = function cb(_ref) {
    var matches = _ref.matches;
    if (matches) enter();
  };

  mql.addListener(cb); //subscribing

  cb(mql); //initial trigger
}

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
function isArray(arg) {
  return Object.prototype.toString.call(arg) === '[object Array]';
}

// USAGE
var MqLayout = {
  name: "MqLayout",
  props: {
    mq: {
      required: true,
      type: [String, Array]
    }
  },
  setup: function setup(props, context) {
    var plusModifier = vue.computed(function () {
      return !isArray(props.mq) && props.mq.slice(-1) === "+";
    });
    var activeBreakpoints = vue.computed(function () {
      var breakpoints = Object.keys(mqAvailableBreakpoints.value);
      var mq = plusModifier.value ? props.mq.slice(0, -1) : isArray(props.mq) ? props.mq : [props.mq];
      return plusModifier.value ? selectBreakpoints(breakpoints, mq) : mq;
    });
    var shouldRenderChildren = vue.computed(function () {
      return activeBreakpoints.value.includes(currentBreakpoint.value);
    });
    return function () {
      return shouldRenderChildren.value ? vue.h("div", {}, context.slots["default"]()) : vue.h();
    };
  }
};

var DEFAULT_BREAKPOINT = {
  sm: 450,
  md: 1250,
  lg: Infinity
};

var install = function install(app) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$breakpoints = _ref.breakpoints,
      breakpoints = _ref$breakpoints === void 0 ? DEFAULT_BREAKPOINT : _ref$breakpoints,
      _ref$defaultBreakpoin = _ref.defaultBreakpoint,
      defaultBreakpoint = _ref$defaultBreakpoin === void 0 ? 'sm' : _ref$defaultBreakpoin;

  var hasSetupListeners = false;
  setCurrentBreakpoint(defaultBreakpoint); // Init reactive component

  app.mixin({
    computed: {
      $mq: function $mq() {
        return currentBreakpoint.value;
      }
    },
    created: function created() {
      if (this.$isServer) setCurrentBreakpoint(defaultBreakpoint);
    },
    mounted: function mounted() {
      if (!hasSetupListeners) {
        var mediaQueries = convertBreakpointsToMediaQueries(breakpoints); // setup listeners

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

        hasSetupListeners = true;
      }
    }
  });
  app.config.globalProperties.$mqAvailableBreakpoints = breakpoints;
  setAvailableBreakpoints(breakpoints);
  app.component('mq-layout', MqLayout);
};

var index = {
  install: install
};

module.exports = index;
