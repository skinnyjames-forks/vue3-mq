import json2mq from 'json2mq';
import { mqAvailableBreakpoints } from "./store";
export const listeners = [];

export function convertBreakpointsToMediaQueries(breakpoints) {
  const keys = Object.keys(breakpoints)
  const values = keys.map(key => breakpoints[key])
  const breakpointValues = [0, ...values.slice(0, -1)]
  const mediaQueries = breakpointValues.reduce((accumulator, current, index) => {
    const options = Object.assign(
      {
        minWidth: current,
      },
      index < keys.length - 1 ? { maxWidth: breakpointValues[index+1] - 1 } : {}
    )
    const mediaQuery = json2mq(options)
    return Object.assign(
      accumulator,
      {
        [keys[index]]: mediaQuery,
      }
    )
  }, {});
  return mediaQueries
}

export function selectBreakpoints({mqProp, isMqPlus = {value: false}, isMqMinus = {value: false}, isMqRange = {value: false}}) {
  const ents = Object.entries(mqAvailableBreakpoints.value);
  if (ents.length === 0) return [];
  if (isMqPlus.value) mqProp = mqProp.replace(/\+$/,"");
  else if (isMqMinus.value) mqProp = mqProp.replace(/-$/,"");
  else if (isMqRange.value) {
    mqProp = mqProp.split("-");
    if (!mqProp || mqProp.length !== 2) throw new Error("Invalid MQ range provided");
  }
  let eligible;
  if (isMqRange.value) {
    let from = ents.find(([key,value]) => key == mqProp[0].trim());
    if (!from || from.length === 0) throw new Error('Range from breakpoint (' + mqProp[0].trim() + ') not found');
    let to = ents.find(([key,value]) => key == mqProp[1].trim());
    if (!to || to.length === 0) throw new Error('Range to breakpoint (' + mqProp[1].trim() + ') not found');
    if (from[1] > to[1]) [from,to] = [to,from];
    eligible = ents.filter(([key,value]) => value >= from[1] && value <= to[1]);
  }
  else {
    const base = ents.find(([key,value]) => key == mqProp);
    if (isMqPlus.value) eligible = ents.filter(([key,value]) => value >= base[1]);
    else if (isMqMinus.value) eligible = ents.filter(([key,value]) => value <= base[1]);
  }
  eligible.sort((a,b) => a[1] - b[1]);
  return eligible.map(el => el[0]);
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