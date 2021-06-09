import { selectBreakpoints } from "./helpers";
import { currentBreakpoint, shouldRender } from "./store";
import { computed, h, Transition, TransitionGroup } from "vue";

export const MqLayout = {
	name: "MqLayout",
	props: {
		mq: {
			type: [String, Array],
		},
		tag: {
			type: String,
			default: "div",
		},
		group: {
			type: Boolean,
			default: false,
		},
	},
	setup(props, context) {
		console.log("Running setup()");
		const defaultOptions = {
			name: "fade",
			mode: "out-in",
		};
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

		const activeBreakpoints = computed(() => {
			if (isMqArray.value) return props.mq;
			else if (!isMqPlus.value && !isMqMinus.value && !isMqRange.value)
				return [props.mq];
			else {
				return selectBreakpoints({
					mqProp: props.mq,
					isMqPlus,
					isMqMinus,
					isMqRange,
				});
			}
		});

		const shouldRenderChildren = computed(() =>
			activeBreakpoints.value.includes(currentBreakpoint.value)
		);

		const renderSlots = (tag) => {
			let slots = [];
			for (let slot in context.slots) {
				if (!props.group && slots.length > 0) return slots;
				let shouldRenderSlot = computed(() =>
					shouldRender(slot.split(":")[0])
				);
				if (shouldRenderSlot.value) {
					slots.push(
						h(
							tag ? tag : context.slots[slot],
							{ key: slot },
							tag ? context.slots[slot]() : undefined
						)
					);
				}
			}
			return slots.length > 0 ? slots : undefined;
		};
		console.log(context.slots.default);
		// If the user includes a bare element inside the mq-layout component
		// Uses the props.tag property to render an element
		if (context.slots.default) {
			return () =>
				shouldRenderChildren.value
					? h(props.tag, {}, context.slots.default())
					: undefined;
		} else {
			return () => {
				const transitionOptions = {
					...defaultOptions,
					...context.attrs,
				};
				const el = props.group ? TransitionGroup : Transition;
				return h(el, transitionOptions, renderSlots(props.tag));
			};
		}
	},
};
