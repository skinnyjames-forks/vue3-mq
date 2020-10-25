import { subscribeToMediaQuery, convertBreakpointsToMediaQueries } from './helpers.js'
import MqLayout from './component.js'
import { setAvailableBreakpoints, setCurrentBreakpoint, currentBreakpoint } from "./utils";

const DEFAULT_BREAKPOINT = {
  sm: 450,
  md: 1250,
  lg: Infinity,
}

const install = function (app, { breakpoints = DEFAULT_BREAKPOINT, defaultBreakpoint = 'sm' } = {}) {  
  let hasSetupListeners = false
  setCurrentBreakpoint(defaultBreakpoint);

  // Init reactive component
  app.mixin({
    computed: {
      $mq() {
        return currentBreakpoint.value;
      },
    },
    mounted() {
      if (!hasSetupListeners) {
        const mediaQueries = convertBreakpointsToMediaQueries(breakpoints)
        // setup listeners
        for (const key in mediaQueries) {
          const mediaQuery = mediaQueries[key]
          const enter = () => { setCurrentBreakpoint(key) }
          subscribeToMediaQuery(mediaQuery, enter)
        }
        hasSetupListeners = true
      }
    }
  })

  app.config.globalProperties.$mqAvailableBreakpoints = breakpoints;
  setAvailableBreakpoints(breakpoints);
  app.component('mq-layout', MqLayout)
}

export default { install };
