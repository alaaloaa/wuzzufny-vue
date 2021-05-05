import Vue from "vue";
import Vuetify from "vuetify/lib/framework";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    dark: String(localStorage.mode).toLowerCase() == "true" ? true : false,
    themes: {
      light: {
        error: "#ff3333",
        mainColor: localStorage.mainColor ? localStorage.mainColor : "#da7410"
      },
      dark: {
        error: "#ff3333",
        mainColor: localStorage.mainColor ? localStorage.mainColor : "#da7410"
      }
    }
  }
});
