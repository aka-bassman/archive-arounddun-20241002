const { createGlobPatternsForDependencies } = require("@nx/next/tailwind");
const { join } = require("path");

const directions = ["Right", "Left", "Up", "Down"];
const percentages = [5, 15, 30, 100];
const duration = [150, 500, 1000];

// fadeInRight5_150ms: "fadeInRight5 0.15s ease-in-out forwards",
// fadeInRight5_500ms: "fadeInRight5 0.5s ease-in-out forwards",
// fadeInRight5_1000ms: "fadeInRight5 1s ease-in-out forwards",
// delay 는 animation-delay-300 을 className에 추가해서 사용
// 그 외의 duration,timing function, fill mode 적용시, animate-[fadeInRight100_1s_ease-in-out_2s_forwards]
const animations = directions.reduce((acc, direction) => {
  percentages.forEach((percentage) => {
    duration.forEach((time) => {
      const key = `fadeIn${direction}${percentage}_${time}ms`;
      const value = `fadeIn${direction}${percentage} ${time / 1000}s ease-in-out forwards`;
      acc[key] = value;
    });
  });
  return acc;
}, {});

const keyframes = directions.reduce((acc, direction) => {
  percentages.forEach((percentage) => {
    const key = `fadeIn${direction}${percentage}`;
    const xPercentage = direction === "Left" ? -percentage : direction === "Right" ? percentage : 0;
    const yPercentage = direction === "Up" ? percentage : direction === "Down" ? -percentage : 0;

    const value = {
      "0%": {
        opacity: 0,
        transform: `translate(${xPercentage}%, ${yPercentage}%)`,
      },
      "100%": {
        opacity: 1,
        transform: "translate(0, 0)",
      },
    };

    acc[key] = value;
  });
  return acc;
}, {});

const defaultPlugin = require("tailwindcss/plugin")(
  // https://tailwindcss.com/docs/plugins
  ({ matchUtilities, theme, addUtilities, addComponents, addBase }) => {
    matchUtilities(
      {
        "animation-delay": (value) => {
          return { "animation-delay": value };
        },
      },
      { values: theme("transitionDelay") }
    );
    addUtilities({
      ".centric": {
        display: "flex",
        "justify-content": "center",
        "align-items": "center",
      },
      ".all-initial": { all: "initial" },
      ".all-inherit": { all: "inherit" },
      ".all-revert": { all: "revert" },
      ".all-unset": { all: "unset" },
    });
    addComponents({});
    addBase({});
  },
  {
    theme: {
      container: { center: true },
      extend: {
        colors: {
          "primary-light": "hsl(var(--primary-light) / <alpha-value>)",
          "primary-dark": "hsl(var(--primary-dark) / <alpha-value>)",
          "secondary-light": "hsl(var(--secondary-light) / <alpha-value>)",
          "secondary-dark": "hsl(var(--secondary-dark) / <alpha-value>)",
        },
        transitionProperty: {
          all: "all",
        },
        keyframes: {
          smaller: {
            "0%": { scale: 1, height: "100%" },
            "100%": { scale: 0, height: 0 },
          },
          fadeIn: {
            "0%": { opacity: 0 },
            "100%": { opacity: 1 },
          },
          flyOut: {
            "0%": { opacity: 1, transform: "translate(-50%, -100%)" },
            "100%": { opacity: 0, transform: "translate(-50%, -140%)" },
          },
          drop: {
            "0%": { opacity: 0, transform: "translate(-50%, -140%)" },
            "100%": { opacity: 1, transform: "translate(-50%, -100%)" },
          },
          fadeOut: {
            "0%": { opacity: 1 },
            "100%": { opacity: 0 },
          },
          flash: {
            "0%": { opacity: 1 },
            "50%": { opacity: 0.2 },
            "100%": { opacity: 1 },
          },
          spin: {
            "0%": { transform: "rotate(0deg)" },
            "100%": { transform: "rotate(360deg)" },
          },
          pop: {
            "0%": { transform: "scale(0, 0)" },
            "50%": { transform: "scale(1.5, 1.5)" },
            "100%": { transform: "scale(1, 1)" },
          },
          slideDown: {
            from: { height: 0 },
            to: { height: "var(--radix-accordion-content-height)" },
          },
          slideUp: {
            from: { height: "var(--radix-accordion-content-height)" },
            to: { height: 0 },
          },
          menuOpen: {
            "0%": {
              opacity: 0,
              width: 0,
            },
            "100%": {
              opacity: 1,
              width: 80,
            },
          },
          menuClose: {
            "0%": {
              opacity: 1,
              width: 80,
            },
            "100%": {
              opacity: 0,
              width: 0,
            },
          },
          "backdrop-blur": {
            "0%": { "backdrop-filter": "blur(0)" },
            "100%": { "backdrop-filter": "blur(5px)" },
          },
          zoomIn: {
            "0%": {
              opacity: 0,
              transform: "scale(0.6)",
            },
            "100%": {
              opacity: 1,
              transform: "scale(1)",
            },
          },
          bottomUp: {
            "0%": {
              transform: "translateY(100%)",
            },
            "100%": {
              transform: "translateY(0)",
            },
          },
          bottomDown: {
            "0%": {
              transform: "translateY(0)",
            },
            "100%": {
              transform: "translateY(100%)",
            },
          },
          wave: {
            "0%": {
              "box-shadow":
                "0 0 0 0 rgba(219, 39, 119, 0.3), 0 0 0 1em rgba(219, 39, 119, 0.3), 0 0 0 2em rgba(219, 39, 119, 0.3),0 0 0 3em rgba(219, 39, 119, 0.3)",
            },
            "100%": {
              "box-shadow":
                "0 0 0 1em rgba(219, 39, 119, 0.3), 0 0 0 2em rgba(219, 39, 119, 0.3), 0 0 0 3em rgba(219, 39, 119, 0.3), 0 0 0 4em rgba(219, 39, 119, 0)",
            },
          },
          translateUp: {
            "0%": {
              transform: "translateY(0)",
            },
            "100%": {
              transform: "translateY(-60%)",
            },
          },
          tranlateLeft: {
            "0%": {
              transform: "translateX(100%)",
            },
            "100%": {
              transform: "translateX(0)",
            },
          },
          tranlateRight: {
            "0%": {
              transform: "translateX(-100%)",
            },
            "100%": {
              transform: "translateX(0)",
            },
          },
          ...keyframes,
        },
        animation: {
          smaller: "smaller 0.15s ease-in-out forwards",
          fadeIn: "fadeIn 0.15s ease-in-out forwards",
          fadeIn_750ms: "fadeIn 0.75s ease-in-out forwards",
          fadeOut: "fadeOut 0.15s ease-in-out forwards",
          flyOut: "flyOut 0.15s ease-in-out forwards",
          drop: "drop 0.15s ease-in-out forwards",
          flash: "flash 1s linear infinite",
          spin: "spin 1s linear infinite",
          spin_15s: "spin 15s linear infinite",
          "backdrop-blur": "backdrop-blur 2s ease-in-out forwards",
          pop: "pop 0.15s ease-in-out forwards",
          menuOpen: "menuOpen 0.3s ease-in-out forwards",
          menuClose: "menuClose 0.3s ease-in-out forwards",
          slideDown: "slideDown 300ms cubic-bezier(0.87, 0, 0.13, 1)",
          slideUp: "slideUp 300ms cubic-bezier(0.87, 0, 0.13, 1)",
          zoomIn: "zoomIn 0.15s ease-in-out forwards",
          zoomIn_1000ms: "zoomIn 1s ease-in-out forwards",
          wave: "wave 1s linear infinite",
          fadeIn_delay_1s: "fadeIn 0.3s ease-in-out 1s forwards",
          translateUp: "translateUp 0.5s ease-in-out 0.5s forwards",
          bottomUp: "bottomUp 0.5s ease-in-out 0.5s forwards",
          translateLeft: "translateLeft 0.15s ease-in-out forwards",
          translateRight: "tranlateRight 0.15s ease-in-out forwards",
          ...animations,
        },
      },
    },
  }
);

const withBase = (
  dirname,
  { fonts = [], themes = [], config = {}, container = "normal", colors = {}, backgroundImage = {} } = {}
) => ({
  content: [
    join(dirname, "./app/**/*.{js,ts,jsx,tsx}"),
    join(dirname, "./lib/**/*.{js,ts,jsx,tsx}"),
    join(dirname, "./ui/**/*.{js,ts,jsx,tsx}"),
    ...createGlobPatternsForDependencies(dirname),
  ],
  theme: {
    ...config,
    ...(container === "compact"
      ? {
          container: {
            center: true,
            // padding: '1rem',
            screens: {
              sm: "600px",
              md: "768px",
              lg: "1024px",
              xl: "1280px",
              "2xl": "1280px",
            },
          },
        }
      : {}),
    extend: {
      fontFamily: Object.fromEntries(fonts.map((font) => [font, [`var(--font-${font})`]])),
      colors: colors || {},
      backgroundImage: backgroundImage || {},
    },
  },
  daisyui: {
    themes: Array.isArray(themes) ? (themes.length === 0 ? ["light", "dark"] : themes) : [themes],
  },
  plugins: [
    defaultPlugin,
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/container-queries"),
    require("tailwindcss-animation-delay"),
    require("tailwind-scrollbar"),
    require("daisyui"),
    require("tailwindcss-radix")(),
  ],
});

module.exports = { defaultPlugin, withBase };
