import { ref, readonly } from "vue";
import { convertBreakpointsToMediaQueries, subscribeToMediaQuery, listeners } from "./helpers";
const state = {
  mqAvailableBreakpoints: ref({}),
  currentBreakpoint: ref("")
}

export const setAvailableBreakpoints = (v) => state.mqAvailableBreakpoints.value = v;
export const mqAvailableBreakpoints = readonly(state.mqAvailableBreakpoints);

export const setCurrentBreakpoint = (v) => state.currentBreakpoint.value = v;
export const currentBreakpoint = readonly(state.currentBreakpoint);

export function updateBreakpoints(breakpoints) {
  // Remove any existing MQ listeners
  for (let i = listeners.length - 1; i >= 0; i--) {
    const { mql, cb } = listeners[i];
    mql.removeEventListener('change', cb);
    listeners.splice(i,1);
  }

  // Save new breakpoints to reactive variable
  setAvailableBreakpoints(breakpoints);
  // Create css media queries from breakpoints
  const mediaQueries = convertBreakpointsToMediaQueries(breakpoints);

  // Add new MQ listeners
  for (const key in mediaQueries) {
    const mediaQuery = mediaQueries[key];
    const enter = () => { setCurrentBreakpoint(key) }
    subscribeToMediaQuery(mediaQuery, enter)
  }
}