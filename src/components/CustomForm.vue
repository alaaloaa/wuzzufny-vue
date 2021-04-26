<template>
  <div>
    <!-- <Loader v-if="loader" :loader="loading" />
    <Popup v-if="popup" :popup="popupData" /> -->
    <v-form @submit.prevent="send">
      <v-container>
        <v-layout row wrap pb-4>
          <v-col
            v-for="(field, index) in fields"
            :key="index"
            :sm="field.width.sm"
            :cols="field.width.xs"
            v-bind="field.mainOptions"
            :class="[errors.has(field.key) ? 'errors' : '', field.mainClass]"
          >
            <component
              :is="field.component"
              :label="field.label"
              :name="field.key"
              @input="funcioncall(field.input, field.key, field.value)"
              @change="$emit('change', $event, field.key)"
              @click="funcioncall(field.click, field.key)"
              @file="fileData($event, field.key)"
              v-model="field.value"
              v-bind="[field.bindOptions, formBindOptions]"
              :color="errors.has(field.key) ? 'error' : 'mainColor'"
              v-validate="field.rules"
              :true-value="1"
            />
            <component
              v-if="field.slot"
              :is="field.slot"
              :src="fileUrl ? fileUrl : field.AvatarSrc"
            />
            <span
              v-show="errors.has(field.key)"
              :class="errors.has(field.key) ? 'error--text' : 'mainColor--text'"
              >{{ errors.first(field.key) }}</span
            >
          </v-col>
          <v-col :class="['d-flex', { 'justify-center': formBtn.center }]">
            <v-btn v-bind="formBtn.bindOptions" color="mainColor" outlined
              ><span
                :class="
                  `${$vuetify.theme.dark ? 'white--text' : 'black--text'} ${
                    formBtn.color
                  }--text`
                "
                >{{ formBtn.text }}</span
              ></v-btn
            >
          </v-col>
        </v-layout>
      </v-container>
    </v-form>
  </div>
</template>

<script>
import {
  VTextField,
  VSwitch,
  VSelect,
  VTextarea,
  VFileInput
} from "vuetify/es5/components";
import Password from "./password";
// import Popup from "./popup";
import Avatar from "./Avatar";
import { mapActions } from "vuex";

export default {
  components: {
    VTextField,
    VSwitch,
    VSelect,
    VTextarea,
    VFileInput,
    Password,
    // Popup,
    Avatar
  },
  props: {
    fields: {
      type: Array,
      required: true
    },
    formBtn: {
      type: Object,
      required: true
    },
    formBindOptions: {
      type: Object
    },
    request: {
      type: Object,
      required: true
    },
    loader: {
      type: Boolean,
      default: false
    },
    popup: {
      type: Boolean,
      default: true
    },
    errorsMix: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    formData: [],
    loading: false,
    // popupData: {
    //   show: false
    // },
    fileUrl: ""
  }),
  computed: {},
  methods: {
    ...mapActions({
      laodingStatus: "loader/laodingStatus",
      popupData: "popup/popupData"
    }),
    fileData($e, fieldKey) {
      this.fields[fieldKey] = $e;
      console.log(this.fields[fieldKey]);
    },
    input(fieldName, fieldValue) {
      this.$emit("input", fieldName, fieldValue);
      // console.log(this.fields["avatar"]);
    },
    // changefile(file) {
    //   if (file) {
    //     this.laodingStatus(true);

    //     this.fileUrl = URL.createObjectURL(file);
    //     this.$nextTick(() => this.laodingStatus(false));
    //   } else {
    //     this.fileUrl = null;
    //   }

    //   this.fields["avatar"] = file;
    // },

    funcioncall(eventType, fieldName, fieldValue) {
      if (eventType) {
        this[eventType](fieldName, fieldValue);
      } else {
        return "";
      }
    },

    send() {
      this.$validator.validateAll().then(res => {
        if (res) {
          if (this.request.url) {
            this.laodingStatus(true);
            var result = this.fields.map(function(field) {
              return { [field.key]: field.value };
            });
            var data = Object.assign({}, ...result);
            var formData = new FormData();
            Object.keys(data).forEach(key => {
              formData.append(key, data[key]);
            });
            console.log(this.fields["avatar"]);
            this.axios({
              method: this.request.method,
              url: this.request.url,
              data: formData
            })
              .then(res => {
                this.laodingStatus(false);
                if (this.popup) {
                  this.popupData({
                    show: true,
                    text: res.data.msg
                  });
                }
                this.$emit("getResult", res);
              })
              .catch(err => {
                this.laodingStatus(false);
                if (this.errorsMix) {
                  this.$setLaravelValidationErrorsFromResponse(
                    err.response.data
                  );
                } else {
                  this.popupData({
                    show: true,
                    color: "#c92114",
                    text: Object.values(err.response.data.errors)[0].toString()
                  });
                }
                this.$emit("getResult", err.response);
              });
          } else {
            this.$emit("function");
          }
        }
      });
    }
  },
  created() {
    this.$on("change", (e, fieldKey) => {
      if (fieldKey == "avatar") {
        this.changefile(e);
      }
    });
  }
};
</script>

<style>
/* This Style To Change Style For Errors */
.errors .v-text-field__slot label,
.errors .v-select__slot label,
.errors .mdi:before,
.errors .v-icon {
  color: red !important;
}
.errors .theme--light.v-text-field > .v-input__control > .v-input__slot:before,
.errors .theme--dark.v-text-field > .v-input__control > .v-input__slot:before {
  border-color: red !important  ;
}
</style>
