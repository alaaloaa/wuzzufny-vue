<template>
  <div class="sittings">
    <input
      class="mainColor inputColor"
      type="color"
      @input="showColor"
      v-model="color"
    />
    <v-switch
      v-model="mode"
      :label="mode ? 'Light Mode' : 'Dark Mode'"
      color="mainColor"
      class="ml-2"
      @click="changeMode"
    ></v-switch>
    <v-icon color="">mdi-memory</v-icon>
  </div>
</template>

<script>
let root = document.documentElement;

export default {
  data: () => ({
    color: "#fff",
    mode: false
  }),
  methods: {
    showColor() {
      // update the main Color In local storage
      localStorage.mainColor = this.color;
      // update the main Color In Vuetify Theme
      let darkTheme = this.$vuetify.theme.dark;
      if (darkTheme) {
        this.$vuetify.theme.themes.dark.mainColor = this.color;
      } else {
        this.$vuetify.theme.themes.light.mainColor = this.color;
      }
      // update the main Color In Succ File
      root.style.setProperty("--mainColor", this.color);
    },
    changeMode() {
      // update the main Color In local storage
      // update the main Color In Vuetify Theme
      this.$store.dispatch("fireChangeDarkMode");
      localStorage.mode = this.mode;

      if (this.mode) {
        this.$vuetify.theme.dark = true;
      } else {
        this.$vuetify.theme.dark = false;
      }
    }
  },
  created() {
    // check if mode Exist in Local storage
    if (localStorage.mode) {
      if (String(localStorage.mode).toLowerCase() == "true") {
        this.$vuetify.theme.dark = true;
        this.mode = true;
      } else {
        this.$vuetify.theme.dark = false;
        this.mode = false;
      }
    } else {
      localStorage.setItem("mode", false);
    }

    //check if mainColor Exist in Local storage
    if (localStorage.mainColor) {
      // update color in input
      this.color = localStorage.mainColor;
      // update the main Color In Succ File
      root.style.setProperty("--mainColor", this.color);
    } else {
      localStorage.setItem("mainColor", "");
    }
  }
};
</script>

<style scoped>
.sittings {
  position: fixed;
  top: 100px;
  right: -140px;
  width: 150px;
  z-index: 2;
  transition: all 1s;
  border: 1px solid #ccc;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.7);
}
.sittings .inputColor {
  width: 100%;
  height: 50px;
  cursor: pointer;
  outline: none !important;
  border-radius: 5px;
  border: none !important;
}
.sittings .inputColor::after {
  content: "change color";
  color: aliceblue;
  position: absolute;
  top: 10px;
  right: 22px;
}
.sittings i {
  position: absolute;
  right: 145px;
  top: 50px;
  font-size: 30px;
}
.sittings:hover {
  right: 0px;
}
</style>
