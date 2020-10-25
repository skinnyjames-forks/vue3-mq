// USAGE
// mq-layout(mq="lg")
//   p I’m lg
import { selectBreakpoints } from "./helpers";
import { isArray } from "./utils";
import { mqAvailableBreakpoints, currentBreakpoint } from "./utils";
import { computed, h } from "vue";

export default {
    name: "MqLayout",
    props: {
        mq: {
            required: true,
            type: [String, Array],
        },
    },
    setup(props, context) {
        const plusModifier = computed(
            () => !isArray(props.mq) && props.mq.slice(-1) === "+"
        );
        const activeBreakpoints = computed(() => {
            const breakpoints = Object.keys(mqAvailableBreakpoints.value);
            const mq = plusModifier.value
                ? props.mq.slice(0, -1)
                : isArray(props.mq)
                ? props.mq
                : [props.mq];
            return plusModifier.value ? selectBreakpoints(breakpoints, mq) : mq;
        });

        const shouldRenderChildren = computed(() =>
            activeBreakpoints.value.includes(currentBreakpoint.value)
        );
        return () =>
            shouldRenderChildren.value
                ? h("div", {}, context.slots.default())
                : h();
    },
};
