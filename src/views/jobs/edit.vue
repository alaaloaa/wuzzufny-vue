<template>
  <v-card>
    <h1 class="headline text-center font-weight-bold py-4 mainColor--text">
      Edit
    </h1>
    <CustomForm
      :fields="fields"
      :formBtn="formBtn"
      :request="request"
      :loader="true"
      @getResult="update"
    />
  </v-card>
</template>

<script>
import CustomForm from "@/components/CustomForm.vue";
import { mapGetters, mapMutations, mapActions } from "vuex";

export default {
  components: {
    CustomForm
  },
  data: () => ({
    job: {},
    loading: false
  }),
  computed: {
    ...mapGetters(["countriesData", "skillsData"]),
    jobId() {
      return this.$route.params.id;
    },
    formBtn() {
      return {
        text: "Edit",
        bindOptions: {
          type: "submit",
          color: "mainColor"
        }
      };
    },
    fields() {
      return [
        {
          component: "v-text-field",
          label: "Job Name",
          key: "name",
          value: this.job.name,
          rules: "required|min:10|max:40",
          bindOptions: {
            required: true,
            placeholder: "Write Job's Name",
            counter: 40
          },
          width: { xs: 12, sm: 6, lg: 4 }
        },
        {
          component: "v-text-field",
          label: "Job Title",
          key: "title",
          value: this.job.title,
          rules: "required|min:10|max:60",
          bindOptions: {
            required: true,
            placeholder: "Write Job's Title",
            counter: 60
          },
          width: { xs: 12, sm: 6, lg: 4 }
        },
        {
          component: "v-textarea",
          label: "Job Description",
          key: "description",
          value: this.job.description,
          rules: "required|min:200|max:2000",
          bindOptions: {
            required: true,
            placeholder: "Write job Description",
            counter: 2000
          },
          width: { xs: 12, sm: 12, lg: 12 }
        },
        {
          component: "v-textarea",
          label: "Qualification",
          key: "qualifications",
          value: this.job.qualifications,
          rules: "required|min:100|max:2000",
          bindOptions: {
            required: true,
            placeholder: "Write job Employee Qualification",
            counter: 2000
          },
          width: { xs: 12, sm: 12, lg: 12 }
        },
        {
          component: "v-select",
          label: " Job Country",
          key: "country",
          value: this.job.country,
          rules: "required",
          bindOptions: {
            items: this.countriesData,
            menuProps: { offsetY: true },
            chips: true
          },
          width: { xs: 12, sm: 6, lg: 4 }
        },
        {
          component: "v-text-field",
          label: "From ? Years OF Experience",
          key: "experience->from",
          // value: this.job.experience.from,
          value: 3,
          rules: "required|integer|min:1|max:2",
          bindOptions: {
            placeholder: "From ? Years OF Experience",
            counter: 2,
            type: "number"
          },
          width: { xs: 6, sm: 3, lg: 2 }
        },
        {
          component: "v-text-field",
          label: "To ? Years OF Experience",
          key: "experience->to",
          // value: this.job.experience.to,
          value: 9,
          rules: "required|integer|min:1|max:2",
          bindOptions: {
            placeholder: "To ? Years OF Experience",
            type: "number"
          },
          width: { xs: 6, sm: 3, lg: 2 }
        },
        {
          component: "v-text-field",
          label: "Job Address",
          key: "address",
          value: this.job.address,
          rules: "required|min:20|max:100",
          bindOptions: {
            placeholder: "Write Job's Address",
            counter: 100
          },
          width: { xs: 12, sm: 12, lg: 8 }
        },
        {
          component: "v-select",
          label: "job Skills",
          key: "skills",
          value: this.job.skills,
          rules: "required|min: 2|max:50",
          bindOptions: {
            items: this.skillsData,
            menuProps: { offsetY: true },
            deletableChips: true,
            multiple: true,
            seachable: true,
            chips: true
          },
          width: { xs: 12, sm: 6, lg: 4 }
        },
        {
          component: "v-select",
          label: "Job Type",
          key: "type",
          value: this.job.type,
          rules: "required",
          bindOptions: {
            items: ["Full Time", "Part Time"],
            menuProps: { offsetY: true },
            chips: true
          },
          width: { xs: 12, sm: 6, lg: 4 }
        },

        {
          component: "v-text-field",
          label: "Company Name",
          key: "companyName",
          value: this.job.companyName,
          rules: "required|min:10|max:40",
          bindOptions: {
            placeholder: "Write Company Name",
            counter: 40
          },
          width: { xs: 12, sm: 6, lg: 4 }
        },
        {
          component: "v-text-field",
          label: "Salary",
          key: "salary",
          value: this.job.salary,
          rules: "required|integer",
          bindOptions: {
            placeholder: "Write Salary In Dollars",
            type: "number",
            prependIcon: "$"
          },
          width: { xs: 12, sm: 6, lg: 4 }
        },
        {
          component: "v-textarea",
          label: "About Company",
          key: "aboutCompany",
          value: this.job.aboutCompany,
          rules: "required|min:50|max:1000",
          bindOptions: {
            required: true,
            placeholder: "Write Brief About Company",
            counter: 1000,
            rows: "5"
          },
          width: { xs: 12, sm: 12, lg: 12 }
        },
        // {
        //   component: "v-file-input",
        //   label: "Company Logo",
        //   key: "companyLogo",
        //   value: this.job.companyLogo,

        //   rules: "",
        //   bindOptions: {
        //     placeholder: "Insert Company Logo",
        //     counter: 40,
        //     type: "file",
        //     prependIcon: "mdi-camera",
        //     chips: true
        //   },
        //   width: { xs: 12, sm: 12, lg: 12 }
        // },
        {
          component: "v-switch",
          label: "Availability",
          key: "status",
          value: this.job.status,
          bindOptions: {
            ["true-value"]: 1,
            ["false-value"]: 0
          },
          width: { xs: 12, sm: 12, lg: 12 }
        }
      ];
    },
    request() {
      return {
        method: "post",
        url: `http://localhost:8000/api/job/${this.jobId}`,
        data: this.job
      };
    }
  },
  methods: {
    ...mapMutations(["getSkillsAndCountriesData"]),
    ...mapActions({
      laodingStatus: "loader/laodingStatus"
    }),
    getData() {
      this.laodingStatus(true);
      this.axios
        .get(`http://localhost:8000/api/job/${this.jobId}/edit`)
        .then(res => {
          this.job = res.data;
          this.laodingStatus(false);

          console.log(res.data);
        });
    },
    update() {
      console.log("Updated");
    }
  },
  created() {
    // console.log(JSON.parse(this.job.experience));
    // console.log(this.job.experience.to);
    this.getData();
    this.getSkillsAndCountriesData();
  }
};
</script>
