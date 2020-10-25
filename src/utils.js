import { ref, readonly } from "vue";
const state = {
  mqAvailableBreakpoints: ref({}),
  currentBreakpoint: ref("")
}

export const setAvailableBreakpoints = (v) => state.mqAvailableBreakpoints.value = v;
export const mqAvailableBreakpoints = readonly(state.mqAvailableBreakpoints);

export const setCurrentBreakpoint = (v) => state.currentBreakpoint.value = v;
export const currentBreakpoint = readonly(state.currentBreakpoint);

export function isArray (arg) {
  return Object.prototype.toString.call(arg) === '[object Array]';
}
