<template>
  <div>
    <v-container fluid>
      <v-layout row wrap>
        <v-flex xs12 sm3 fixed app>
          <v-card class="mb-6" fixed app>
            <CustomForm
              :fields="fields"
              :formBtn="formBtn"
              :formBindOptions="formBindOptions"
              :request="request"
              @input="getInputsValues"
              @function="search"
            />
          </v-card>
        </v-flex>
        <v-flex xs12 sm9 px-2>
          <div class="text-capitalize text-center noData" v-if="noData">
            there is no any results related with this search
          </div>
          <v-card
            v-else
            router
            :to="`/job/view/${job.id}`"
            :class="['pa-4 mb-4', $vuetify.breakpoint.xs ? 'text-center' : '']"
            v-for="(job, index) in jobs"
            :key="index"
          >
            <div class="head mb-2">
              <h1
                class="d-inline-block headline font-weight-bold mainColor--text"
              >
                {{ job.name }}
              </h1>
              <span class="float-right">
                <v-chip outlined class="mr-3 mainColor" small>
                  {{ job.type }}
                </v-chip>
                <span class="mr-3 overline"
                  >{{ job.experience.from }} :
                  {{ job.experience.to }} Experience Years</span
                >
                <span class="caption">{{ job.created_at }}</span>
              </span>
            </div>
            <div class="caption">
              <p>
                {{ job.title }}
              </p>
              <p class="mt-n3">
                <span class="mainColor--text mr-2  caption">{{
                  job.companyName
                }}</span>
                <span>{{ job.country }}</span>
              </p>
            </div>
            <p class="subtitle-1" truncate-length="10">
              {{ job.description.slice(0, 500) }} ...etc
            </p>
            <div>
              <v-chip
                v-for="(skill, index) in job.skills.slice(0, 10)"
                :key="index"
                outlined
                small
                class="ma-2 mainColor"
              >
                {{ skill }}
              </v-chip>
            </div>
          </v-card>
        </v-flex>
      </v-layout>

      <v-card
        class="my-2 py-4 float-right"
        :min-width="$vuetify.breakpoint.xs ? '100%' : '75%'"
      >
        <Pagination @paginationData="getData" :url="url" />
      </v-card>
    </v-container>
  </div>
</template>

<script>
import CustomForm from "@/components/CustomForm.vue";
import Pagination from "@/components/Pagination.vue";
import { mapGetters } from "vuex";
import { bus } from "../../main";

export default {
  components: {
    CustomForm,
    Pagination
  },
  data() {
    return {
      noData: false,
      jobs: {},
      props: ["html", "css", "js"],
      isActive: false,
      url: "",
      name: "",
      country: ""
    };
  },
  computed: {
    ...mapGetters(["countriesData"]),
    disabled() {
      if (this.name == "" && this.country == "") {
        return true;
      } else {
        return false;
      }
    },
    query() {
      return `name=${this.name}&&country=${this.country}`;
    },
    formBtn() {
      return {
        text: "Search",
        bindOptions: {
          type: "submit",
          class: this.disabled ? "disabled" : ""
        }
      };
    },
    fields() {
      return [
        {
          component: "v-text-field",
          label: "Job Name",
          key: "name",
          value: "",
          input: "input",
          bindOptions: {
            rules: [],
            required: true,
            placeholder: "Search By Job's Name",
            counter: 20
          },
          width: { xs: 12, sm: 12, lg: 12 }
        },
        {
          component: "v-select",
          label: " Job Country",
          key: "country",
          value: "",
          input: "input",
          bindOptions: {
            items: this.countriesData,
            placeholder: "Search By Job's Country",
            menuProps: { offsetY: true },
            multiple: true,
            deletableChips: true,
            chips: true
          },
          width: { xs: 12, sm: 12, lg: 12 }
        }
      ];
    },
    request() {
      return {};
    },
    formBindOptions: {
      get() {
        return {
          color: "mainColor",
          class: "BaZoka",
          href: "www.facebook.com"
        };
      }
    }
  },
  methods: {
    getData(data) {
      this.url = `http://localhost:8000/api/jobs`;
      if (data == "") {
        this.noData = true;
      } else {
        this.noData = false;
      }
      this.jobs = data;
      window.scrollTo(0, 0);
    },
    search() {
      bus.$emit("search", this.query);
    },

    getInputsValues(fieldName, fieldValue) {
      if (fieldName === "name") {
        this.name = fieldValue;
      }

      if (fieldName === "country") {
        this.country = fieldValue;
      }
    }
  },
  created() {
    this.getData();
    this.$store.commit("getSkillsAndCountriesData");
  }
};
</script>
<style scoped>
.noData {
  line-height: 300px;
  margin-bottom: 20px;
}
@media screen and (max-width: 776px) {
  .noData {
    line-height: 50px;
  }
}

.pagination {
  display: flex;
  padding: 1rem;
  width: fit-content;
  border-radius: 0.25rem;
}

.crumbs {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  list-style-type: none;
  margin: 0;
  padding: 0;
  gap: 0.5rem;
}

.theme--light .pagination button {
  background-color: rgb(255, 255, 255) !important;
  color: #1d1f20;
}

.theme--light .pagination button:hover,
.theme--light .pagination .activeButton {
  background-color: #1d1f20 !important;
  color: #fdfdfd;
  border-color: #1d1f20;
  cursor: pointer;
}
.theme--light .pagination .disabled:hover,
.theme--light .pagination .disabled {
  background-color: #f3f3f3 !important;
  color: #ccc !important;
  border-color: none !important;
}

.theme--dark.pagination .disabled:hover,
.theme--dark .pagination .disabled {
  background-color: #000 !important;
  color: #333 !important;
  border-color: none !important;
}
</style>
