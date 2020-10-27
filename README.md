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
Presently, support for SSR has been removed


## Installation

#### Using NPM

```sh
npm install vue3-mq
```

## Usage

#### 1.) Add plugin to Vue
Define your custom breakpoints by passing `breakpoints` option. This let you name the breakpoints as you want

**Eg**:

`{ phone: 500, tablet: 1200, other: Infinity }`

`{ small: 500, large: 1200, whatever: Infinity }`

`{ xs: 300, s: 500, m: 800, l: 1200, xl: Infinity }`

```js
import { createApp } from "vue";
import VueMq from "vue3-mq";

const app = createApp({});

app.use(VueMq, {
  breakpoints: { // default breakpoints - customize this
    sm: 450,
    md: 1250,
    lg: Infinity,
  }
})

app.mount('#app');
```

#### 2.) Use `$mq` property
After installing the plugin every instance of Vue component is given access to a reactive $mq property. Its value will be a `String` which is the current breakpoint.

**Eg:** _(with default breakpoints)_
`'sm'` => **0 > screenWidth < 450**
`'md'` => **450 >= screenWidth < 1250**
`'lg'` => **screenWidth >= 1250**

```html
<template>
  <div>{{ $mq }}</div>
</template>
```

#### 3.) Use `$mq` with a computed property

The `$mq` property is fully reactive (like a data property) so feel free to use it in a computed.

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

#### 4.) Update breakpoints

A function is available via Vue's `provide` method which allows you to dynamically change the breakpoints which are responded to. Simply `inject` it into any component where it's needed.

```js
import { inject, onMounted } from "vue";

setup() {
    const updateBreakpoints = inject("updateBreakpoints");

    onMounted() {
      updateBreakpoints({
            xs: 576,
            sm: 768,
            md: 992,
            lg: 1200,
            xl: 1400,
            xxl: Infinity
        })
    }
}
```

#### 5.) MqLayout component
In addition to `$mq` property this plugin provide a wrapper component to facilitate conditional rendering with media queries.

> **Usage**:
```html
<mq-layout mq="lg">
  <span> Display on lg </span>
</mq-layout>
<mq-layout mq="md+">
  <span> Display on md and larger </span>
</mq-layout>
<mq-layout :mq="['sm', 'lg']" tag="span">
  Display on sm and lg
</mq-layout>
```

> **Props**

`mq` => required : [String,Array]

`tag` => optional : String - sets the HTML tag to use for the rendered component (default 'div')

*Important*: note that you can append a `+` modifier at the end of the string to specify that the conditional rendering happens for all greater breakpoints.

## Browser Support
This plugin relies on matchMedia API to detect screensize change. So for older browsers and IE, you should polyfill this out:
Paul Irish: [matchMedia polyfill](https://github.com/paulirish/matchMedia.js)

## Support

Please [open an issue](https://github.com/craigrileyuk/vue3-mq/issues/new) for support.
