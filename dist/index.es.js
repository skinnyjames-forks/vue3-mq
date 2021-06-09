import json2mq from 'json2mq';
import { ref, readonly } from 'vue';

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

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

var DEFAULT_BREAKPOINTS = {
  xs: 576,
  sm: 768,
  md: 992,
  lg: 1200,
  xl: 1400,
  xxl: Infinity
};
var state = {
  mqAvailableBreakpoints: ref({}),
  currentBreakpoint: ref("")
};
var setAvailableBreakpoints = function setAvailableBreakpoints(v) {
  return state.mqAvailableBreakpoints.value = v;
};
var mqAvailableBreakpoints = readonly(state.mqAvailableBreakpoints);
var setCurrentBreakpoint = function setCurrentBreakpoint(v) {
  return state.currentBreakpoint.value = v;
};
var currentBreakpoint = readonly(state.currentBreakpoint);
function updateBreakpoints(breakpoints) {
  // Remove any existing MQ listeners
  for (var i = listeners.length - 1; i >= 0; i--) {
    var _listeners$i = listeners[i],
        mql = _listeners$i.mql,
        cb = _listeners$i.cb;
    mql.removeEventListener('change', cb);
    listeners.splice(i, 1);
  }

  sanitiseBreakpoints(breakpoints); // Save new breakpoints to reactive variable

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
    var mediaQuery = json2mq(options);
    return Object.assign(accumulator, _defineProperty({}, keys[index], mediaQuery));
  }, {});
  return mediaQueries;
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

  if (mql.addEventListener && typeof mql.addEventListener === "function") {
    mql.addEventListener("change", cb); //subscribing
  } else {
    mql.addListener("change", cb);
  }

  cb(mql); //initial trigger
}
function sanitiseBreakpoints(breakpoints) {
  for (var bp in breakpoints) {
    if (!["string", "number"].includes(_typeof(bp)) || !bp) throw new Error("Invalid or missing breakpoint key");
    if (typeof breakpoints[bp] === "string") breakpoints[bp] = parseFloat(breakpoints[bp].replace(/[^0-9]/g, ""));
    if (typeof breakpoints[bp] !== "number" || breakpoints[bp] < 0) throw new Error("Invalid breakpoint value for " + bp + ". Please use a valid number.");
    if (!breakpoints[bp]) throw new Error("No valid breakpoint value for " + bp + " was found");
  }
}

var install = function install(app) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$breakpoints = _ref.breakpoints,
      breakpoints = _ref$breakpoints === void 0 ? DEFAULT_BREAKPOINTS : _ref$breakpoints,
      _ref$defaultBreakpoin = _ref.defaultBreakpoint,
      defaultBreakpoint = _ref$defaultBreakpoin === void 0 ? 'sm' : _ref$defaultBreakpoin;

  var hasSetupListeners = false;
  setCurrentBreakpoint(defaultBreakpoint);
  app.provide('updateBreakpoints', updateBreakpoints);
  app.provide('mq', readonly(currentBreakpoint)); // Init reactive component

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
};

var index = {
  install: install
};

export default index;
