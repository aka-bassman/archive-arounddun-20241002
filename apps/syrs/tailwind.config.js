const { withBase } = require("../../pkgs/core/next/tailwind.base");

module.exports = withBase(__dirname, {
  colors: {
    primary: "#413C33",
    secondary: "#E1D8CA",
    "syrs-brown": "#8A705C",
    "syrs-bg": "#ECEAE5",
    "syrs-brown-light": "#F6F3EE",
    "syrs-font": "#413C33", // 진한 색
    "syrs-selected": "#D1C2B6", // 선택된 색
    "syrs-logo": "#9F8B7B", // #9F8B7B 로고 색
    "syrs-label": "#BCAB9D", // 라벨 색
    "syrs-selector": "#F1EFEC", // 셀렉터 색
    "syrs-loading": "#807C74",
  },
  fonts: ["gilda"],
  backgroundImage: {
    "paper-bg": "url('/image copy.png')",
  },
  themes: {
    extend: {
      colors: {
        primary: "#413C33",
        secondary: "#E1D8CA",

        syrsBrown: "#8A705C",
        "syrs-brown": "#8A705C",
        "primary-content": "#8A705C",
      },
      fontFamily: {
        gilda: ['"Gilda Display"', "serif"],
      },
    },
    dark: {
      primary: "#413C33",
      secondary: "#E1D8CA",

      syrsBrown: "#8A705C",
    },
    light: {
      primary: "#413C33",
      secondary: "#E1D8CA",

      syrsBrown: "#8A705C",
      "primary-content": "#8A705C",
    },
  },
});
