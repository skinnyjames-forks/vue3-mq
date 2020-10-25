import MqLayout from './component.js'
import { setAvailableBreakpoints, setCurrentBreakpoint, currentBreakpoint, updateBreakpoints } from "./utils";

const DEFAULT_BREAKPOINTS = {
  sm: 450,
  md: 1250,
  lg: Infinity,
}

const install = function (app, { breakpoints = DEFAULT_BREAKPOINTS, defaultBreakpoint = 'sm' } = {}) {  
  let hasSetupListeners = false
  setCurrentBreakpoint(defaultBreakpoint);

  app.provide('updateBreakpoints', updateBreakpoints)

  // Init reactive component
  app.mixin({
    computed: {
      $mq() {
        return currentBreakpoint.value;
      },
    },
    mounted() {
      if (!hasSetupListeners) {
        updateBreakpoints(breakpoints)
        hasSetupListeners = true
      }
    }
  })

  app.config.globalProperties.$mqAvailableBreakpoints = breakpoints;
  app.component('mq-layout', MqLayout)
}

export default { install };
