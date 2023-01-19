module.exports = {
  content: ["./views/**/*.{js,css,pug}"],
  theme: {
    extend: {
      fontFamily: {
        ds: ["Dancing Script"],
        pp: ["Poppins"]
      }
    }
  },
  daisyui: {
    themes: false
  },
  plugins: [require("daisyui")]
};
