import plugin from "../../src/index.js";
import MqLayout from "../../src/component.js";
import { mount } from "@vue/test-utils";
import { h } from "vue";
import MatchMediaMock from "../mock/MatchMediaMock";
import * as store from "../../src/store.js";

describe("index.js", () => {
	let results;
	let matchMediaMock;
	beforeEach(() => {
		results = new Set();
		matchMediaMock = MatchMediaMock.create();
		matchMediaMock.setConfig({ type: "screen", width: 1200 });
		window.matchMedia = jest.fn((...args) => {
			const result = matchMediaMock(...args);
			results.add(result);
			return result;
		});
	});

	it("should register $mq property", () => {
		const wrapper = mount(
			{
				render() {
					return h("div");
				}
			},
			{ global: { plugins: [plugin] }, shallow: true }
        );
		expect("$mq" in wrapper.vm).toBe(true);
	});

	test("should default to defaultBreakpoint in options", () => {
		matchMediaMock.setConfig({});
		const plugins = [
			[
				plugin,
				{
					defaultBreakpoint: "md"
				}
			]
		];
		const wrapper = mount(
			{
				render() {
					return h("div");
				}
			},
			{
				global: {
					plugins
				},
				shallow: true
			}
		);
		expect(wrapper.vm.$mq).toBe("md");
	});

	test("should subscribe to media queries", () => {
		const wrapper = mount(
			{
				render() {
					return h("div");
				}
			},
			{ global: { plugins: [plugin] }, shallow: true }
		);
		expect(window.matchMedia).toBeCalledWith("(min-width: 1400px)");
		expect(window.matchMedia).toBeCalledWith(
			"(min-width: 1200px) and (max-width: 1399px)"
		);
		expect(window.matchMedia).toBeCalledWith(
			"(min-width: 992px) and (max-width: 1199px)"
		);
		expect(window.matchMedia).toBeCalledWith(
			"(min-width: 768px) and (max-width: 991px)"
		);
		expect(window.matchMedia).toBeCalledWith(
			"(min-width: 576px) and (max-width: 767px)"
		);
		expect(window.matchMedia).toBeCalledWith(
			"(min-width: 0px) and (max-width: 575px)"
		);
	});

	test("should set $mq accordingly when media query change", () => {
		const wrapper = mount(
			{
				render() {
					return h("div");
				}
			},
			{ global: { plugins: [plugin] }, shallow: true }
		);
		matchMediaMock.setConfig({ type: "screen", width: 700 });
		Array.from(results)[1].callListeners();
		expect(wrapper.vm.$mq).toBe("sm");
	});
	
	it("should mount the mq-layout component", () => {
		store.mqAvailableBreakpoints = {
			value: {
				xs: 576,
				sm: 768,
				md: 992,
				lg: 1200,
				xl: 1400,
				xxl: Infinity,
			},
		};
		store.currentBreakpoint = {
			value: 'xl'
		}
		const wrapper = mount(MqLayout, { shallow: false, slots: {
			default: "<h1>This is a test</h1>"
		}, props: {
			mq: "xl"
		} });
		expect(wrapper.html()).toContain("This is a test");
	})
});
