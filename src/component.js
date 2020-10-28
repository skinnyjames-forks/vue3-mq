// USAGE // mq-layout(mq="lg") // p I’m lg
import {
    selectBreakpoints
} from "./helpers";
import {
    mqAvailableBreakpoints,
    currentBreakpoint
} from "./store";
import {
    computed,
    h
} from "vue";

export default {
    name: "MqLayout",
    props: {
        mq: {
            required: true,
            type: [Object]
        },
        tag: {
            type: String,
            default: "div"
        }
    },
    setup(props, context) {
        /*
        props.mq
        ['sm','md','lg'] ( respond to sm, md and lg )
        md+ ( respond to md and above )
        -lg ( respond to lg and below )
        sm-lg ( respond to sm, md and lg )
        */
        const isMqArray = computed(() => Array.isArray(props.mq));
        const isMqPlus = computed(
            () => !isMqArray.value && /\+$/.test(props.mq) === true
        );
        const isMqMinus = computed(
            () => !isMqArray.value && /-$/.test(props.mq) === true
        );
        const isMqRange = computed(
            () => !isMqArray.value && /^\w*-\w*/.test(props.mq) === true
        );
        /*
        const plusModifier = computed(
            () => !Array.isArray(props.mq) && props.mq.slice(-1) === "+"
        );
        */
        // Add a minus modifier here
        const activeBreakpoints = computed(() => {
            if (isMqArray.value) return props.mq;
            else if (!isMqPlus.value && !isMqMinus.value && !isMqRange.value) return [props.mq];
            else {
                console.log(mqAvailableBreakpoints.value)
                return selectBreakpoints({mqProp: props.mq, isMqPlus, isMqMinus, isMqRange });
            }
        });

        const shouldRenderChildren = computed(() =>
            activeBreakpoints.value.includes(currentBreakpoint.value)
        );
        return () =>
            shouldRenderChildren.value ?
            h(props.tag, {}, context.slots.default()) :
            h();
    }
};
