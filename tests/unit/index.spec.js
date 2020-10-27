import plugin from "../../src/index.js";
import { shallowMount } from "@vue/test-utils";
import { h } from "vue";
import MatchMediaMock from "match-media-mock";

describe("index.js", () => {
    let results;
    let matchMediaMock;
    beforeEach(() => {
        results = new Set();
        matchMediaMock = MatchMediaMock.create();
        matchMediaMock.setConfig({ type: "screen", width: 1200 });
        window.matchMedia = jest.fn(query => {
            const result = matchMediaMock(query);
            results.add(result);
            return result;
        });
    });

    test("should register $mq property", () => {
        const wrapper = shallowMount(
            {
                render() {
                    return h("div");
                }
            },
            { global: { plugins: [plugin] } }
        );
        expect("$mq" in wrapper.vm).toBe(true);
    });

    test("should default to defaultBreakpoint in options", () => {
        const plugins = [
            [
                plugin,
                {
                    defaultBreakpoint: "md"
                }
            ]
        ];
        for (let plugin of plugins) {
            if (Array.isArray(plugin)) {
                continue;
            }
        }
        const wrapper = shallowMount(
            {
                render() {
                    return h("div");
                }
            },
            {
                global: {
                    plugins
                }
            }
        );
        expect(wrapper.vm.$mq).toBe("md");
    });

    test("should subscribe to media queries", () => {
        const wrapper = shallowMount(
            {
                render() {
                    return h("div");
                }
            },
            { global: { plugins: [plugin] } }
        );
        expect(window.matchMedia).toBeCalledWith("(min-width: 1250px)");
        expect(window.matchMedia).toBeCalledWith(
            "(min-width: 450px) and (max-width: 1249px)"
        );
        expect(window.matchMedia).toBeCalledWith(
            "(min-width: 0px) and (max-width: 449px)"
        );
    });

    test("should set $mq accordingly when media query change", () => {
        const wrapper = shallowMount(
            {
                render() {
                    return h("div");
                }
            },
            { global: { plugins: [plugin] } }
        );
        matchMediaMock.setConfig({ type: "screen", width: 700 });
        Array.from(results)[1].callListeners();
        expect(wrapper.vm.$mq).toBe("md");
    });
});
