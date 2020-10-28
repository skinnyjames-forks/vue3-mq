import MqLayout from './component';
import { setCurrentBreakpoint, currentBreakpoint, updateBreakpoints } from "./store";

const DEFAULT_BREAKPOINTS = {
  sm: 450,
  md: 1250,
  lg: Infinity,
}

const install = function (app, { breakpoints = DEFAULT_BREAKPOINTS, defaultBreakpoint = 'sm' } = {}) {  
  let hasSetupListeners = false
  setCurrentBreakpoint(defaultBreakpoint);

  app.provide('updateBreakpoints', updateBreakpoints);

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
  app.component('MqLayout', MqLayout)
}

export default {
  install
}