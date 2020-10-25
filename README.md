# Vue MQ (MediaQuery)
Define your breakpoints and build responsive design semantically and declaratively in a mobile-first way with Vue 3.

_Use with `vue:  ^3.x.x`
_


## Table of Contents

- [Migration Guide](#migration-guide)
- [Installation](#installation)
- [Usage](#usage)
- [Browser Support](#browser-support)
- [Support](#support)

## Migration Guide

#### Filter
Since Vue 3 has dropped support for filters, the previous functionality has been removed 
#### SSR
Presently, support for SSR is not supported


## Installation

#### Using NPM

```sh
npm install @craigrileyuk/vue3-mq
```

## Usage

#### 1. Install plugin
Define your custom breakpoints by passing `breakpoints` option. This let you name the breakpoints as you want
**Eg**:
`{ phone: 500, tablet: 1200, other: Infinity }`
`{ small: 500, large: 1200, whatever: Infinity }`
`{ xs: 300, s: 500, m: 800, l: 1200, xl: Infinity }`
```js
import { createApp } from "vue";
import VueMq from "@craigrileyuk/vue3-mq";

const app = createApp({});

app.use(VueMq, {
  breakpoints: { // default breakpoints - customize this
    sm: 450,
    md: 1250,
    lg: Infinity,
  },
  defaultBreakpoint: 'sm'
})

app.mount('#app');
```
#### Use `$mq` property
After installing the plugin every instance of Vue component is given access to a reactive $mq property. Its value will be a `String` which is the current breakpoint.

**Eg:** _(with default breakpoints)_
`'sm'` => **0 > screenWidth < 450**
`'md'` => **450 >= screenWidth < 1250**
`'lg'` => **screenWidth >= 1250**

```html
//Use it in a component
<template>
  <div>{{ $mq }}</div>
</template>
```

#### Use `$mq` with a computed property
`$mq` property is fully reactive (like a data property) so feel free to use it in a computed.

```js
new Vue({
  computed: {
    displayText() {
      return this.$mq === 'sm' ? 'I am small' : 'I am large'
    }
  },
  template: `
    <h1>{{displayText}}</h1>
  `,
})
```

#### MqLayout component
In addition to `$mq` property this plugin provide a wrapper component to facilitate conditional rendering with media queries.

**Usage**:
```
<mq-layout mq="lg">
  <span> Display on lg </span>
</mq-layout>
<mq-layout mq="md+">
  <span> Display on md and larger </span>
</mq-layout>
<mq-layout :mq="['sm', 'lg']">
  <span> Display on sm and lg </span>
</mq-layout>
```
**Props**
mq => required : String | Array

*Important*: note that you can append a `+` modifier at the end of the string to specify that the conditional rendering happens for all greater breakpoints.

## Browser Support
This plugin relies on matchMedia API to detect screensize change. So for older browsers and IE, you should polyfill this out:
Paul Irish: [matchMedia polyfill](https://github.com/paulirish/matchMedia.js)

## Support

Please [open an issue](https://github.com/craigrileyuk/vue3-mq/issues/new) for support.
