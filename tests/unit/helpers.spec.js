import {
	convertBreakpointsToMediaQueries,
	sanitiseBreakpoints,
	selectBreakpoints,
} from "../../src/helpers.js";
import * as store from "../../src/store.js";

describe("convertBreakpointsToMediaQueries", () => {
	it("expected output with 3 breakpoints", () => {
		const breakpoints = {
			sm: 350,
			md: 900,
			lg: Infinity,
		};
		const expected = {
			sm: "(min-width: 0px) and (max-width: 349px)",
			md: "(min-width: 350px) and (max-width: 899px)",
			lg: "(min-width: 900px)",
		};
		const result = convertBreakpointsToMediaQueries(breakpoints);
		expect(result).toEqual(expected);
	});
});

describe("selectBreakpoints", () => {
	beforeAll(() => {
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
  });
  
	it('throws an error if a breakpoint key is missing', () => {
		expect(() =>
			sanitiseBreakpoints({
        md: 992,
				"": 1200,
        xl: 1400
      })
    ).toThrow("Invalid or missing breakpoint key");
  });

	it("returns the correct breakpoints in mq+ mode", () => {
		const result = selectBreakpoints({
			mqProp: "md+",
			isMqPlus: { value: true },
		});
		expect(result).toEqual(["md", "lg", "xl", "xxl"]);
	});

	it("returns the correct breakpoints in mq- mode", () => {
		const result = selectBreakpoints({
			mqProp: "lg-",
			isMqMinus: { value: true },
		});
		expect(result).toEqual(["xs", "sm", "md", "lg"]);
	});

	it("returns the correct breakpoints in mq range mode", () => {
		const result = selectBreakpoints({
			mqProp: "xs-md",
			isMqRange: { value: true },
		});
		expect(result).toEqual(["xs", "sm", "md"]);
	});

	it("throws an error if an invalid range is provided", () => {
		expect(() =>
			selectBreakpoints({
				mqProp: "md-lg-xl",
				isMqRange: { value: true },
			})
		).toThrow("Invalid MQ range provided");
	});

	it('throws an error if the "from" breakpoint is not found in range', () => {
		expect(() =>
			selectBreakpoints({
				mqProp: "error-xl",
				isMqRange: { value: true },
			})
		).toThrow("Range from breakpoint (error) not found");
  });
  
  it('throws an error if the "from" breakpoint is empty', () => {
		expect(() =>
			selectBreakpoints({
				mqProp: "-xl",
				isMqRange: { value: true },
			})
		).toThrow("Range from breakpoint () not found");
	});

	it('throws an error if the "to" breakpoint is not found in range', () => {
		expect(() =>
			selectBreakpoints({
				mqProp: "md-error",
				isMqRange: { value: true },
			})
		).toThrow("Range to breakpoint (error) not found");
  });
});
