import json2mq from 'json2mq';
export const listeners = [];

export function convertBreakpointsToMediaQueries(breakpoints) {
  const keys = Object.keys(breakpoints)
  const values = keys.map(key => breakpoints[key])
  const breakpointValues = [0, ...values.slice(0, -1)]
  const mediaQueries = breakpointValues.reduce((sum, value, index) => {
    const options = Object.assign(
      {
        minWidth: value,
      },
      index < keys.length - 1 ? { maxWidth: breakpointValues[index+1] - 1 } : {}
    )
    const mediaQuery = json2mq(options)
    return Object.assign(
      sum,
      {
        [keys[index]]: mediaQuery,
      }
    )
  }, {})
  return mediaQueries
}

export function selectBreakpoints(breakpoints, currentBreakpoint) {
  const index = breakpoints.findIndex(b => b === currentBreakpoint)
  // Need to have a slice for index < for minus
  return breakpoints.slice(index)
}

export function subscribeToMediaQuery(mediaQuery, enter) {
  const mql = window.matchMedia(mediaQuery)
  const cb = ({ matches }) => {
    if (matches) enter()
  }
  listeners.push({mql, cb});
  mql.addEventListener('change', cb) //subscribing
  cb(mql) //initial trigger
}