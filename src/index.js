import MqLayout from './component';
import { setCurrentBreakpoint, currentBreakpoint, updateBreakpoints, DEFAULT_BREAKPOINTS } from "./store";
import { readonly } from "vue";

const install = function (app, { breakpoints = DEFAULT_BREAKPOINTS, defaultBreakpoint = 'sm' } = {}) {  
  let hasSetupListeners = false
  setCurrentBreakpoint(defaultBreakpoint);

  app.provide('updateBreakpoints', updateBreakpoints);
  app.provide('mq', readonly(currentBreakpoint));

  // Init reactive component
  app.mixin({
    computed: {
      $mq() {
        return currentBreakpoint.value;
      }
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