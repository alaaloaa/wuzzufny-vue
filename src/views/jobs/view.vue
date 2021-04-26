<template>
  <div>
    <v-container>
      <v-layout row wrap>
        <v-col md="9" sm="9" xs="12" class="md-9 sm-9 xs-12" order="5">
          <v-card class="pa-3">
            <div class="head">
              <div class="jobName">
                <v-btn
                  small
                  class="float-right ml-4"
                  outlined
                  :loading="bookmarkLoading"
                  @click="bookmark"
                  :color="bookmarked ? 'primary' : 'success'"
                  ref="bookmark"
                >
                  <span v-if="bookmarked">
                    <span class="mr-1">Bookmarked</span>
                    <v-icon>mdi-bookmark-off-outline</v-icon>
                  </span>
                  <span v-else>
                    <span class="mr-1">Bookmark</span>
                    <v-icon>mdi-bookmark-outline</v-icon>
                  </span>
                </v-btn>
                <v-btn
                  small
                  class="float-right  white--text"
                  color="mainColor"
                  outlined
                  :disabled="applied"
                  @click="apply"
                >
                  <span v-if="!applied">Apply Now</span>
                  <span v-else>You've Applied Wait For Employer Response</span>
                </v-btn>

                <h1 class="headline  mainColor--text">{{ job.name }}</h1>
                <p class="caption">
                  {{ job.title }}
                </p>
              </div>
            </div>
            <div class="datails">
              <v-row>
                <v-col
                  class="text-center"
                  sm="4"
                  v-for="(info, index) in jobInfo"
                  :key="index"
                >
                  <h3 class="caption font-weight-bold">
                    <v-icon small class="mr-2">mdi-information-outline</v-icon>
                    <span>{{ info.name.toUpperCase() }}</span>
                  </h3>
                  <p class="caption">{{ info.value }}</p>
                </v-col>
              </v-row>
            </div>
            <div class="jobDesc">
              <h1 class="headline  mainColor--text">Job Description</h1>
              <p class="caption">
                {{ job.description }}
              </p>
            </div>
            <div class="jobDesc">
              <h1 class="headline  mainColor--text">Qualifications</h1>
              <p class="caption">
                {{ job.qualifications }}
              </p>
            </div>
            <div class="skills mb-4">
              <h1 class="headline mb-2  mainColor--text">Skills</h1>
              <v-chip
                color="mainColor"
                outlined
                class="ma-1"
                v-for="(skill, index) in job.skills"
                :key="index"
              >
                <span
                  :class="$vuetify.theme.dark ? 'white--text' : 'black--text'"
                  >{{ skill }}</span
                >
              </v-chip>
            </div>
          </v-card>
          <v-card class="mt-4 pa-4">
            <div class="smilarJobs">
              <h1 class="headline mb-2 mainColor--text">Smilar Jobs</h1>
              <v-chip
                color="mainColor"
                outlined
                class="ma-1"
                v-for="(similarJob, index) in similarJobs.slice(0, 20)"
                :key="index"
              >
                <router-link :to="`/job/view/${similarJob.id}`">
                  <span
                    :class="$vuetify.theme.dark ? 'white--text' : 'black--text'"
                    >{{ similarJob.name }}
                  </span>
                </router-link>
              </v-chip>
            </div>
          </v-card>
        </v-col>
        <v-col md="3" sm="3" xs="12" order="1">
          <v-card class="pa-3 pb-7 postedBy">
            <div class="name">
              <p class="text-center">Job Posted By</p>
              <p class="font-weight-bold mainColor--text text-center">
                <router-link
                  class="mainColor--text"
                  :to="`/profile/view/${job.user.id}`"
                >
                  {{ job.user.name }}</router-link
                >
              </p>
            </div>
            <div class="userInfo mt-3">
              <v-img class="mt-2" src="@/assets/images/profile-pic.jpg"></v-img>
              <div class="job">
                <span class="caption"
                  >{{ job.user.info.slice(0, 90) }} ... etc
                </span>
              </div>
              <!-- <div class="buttons mt-10">
                <v-btn small color="mainColor" outlined>Follow</v-btn>
                <v-btn small class="float-right" outlined>Bookmark</v-btn>
              </div> -->
            </div>
          </v-card>
          <v-card class="mt-10 pa-4 companyInfo">
            <h3 class="headline ml-4  mainColor--text text-center">
              About Company
            </h3>
            <v-img
              class="ma-4"
              aspect-ratio="1.7"
              src="@/assets/images/cover.jpg"
            ></v-img>
            <h4 class=" text-center">{{ job.companyName }}</h4>
            <p class="caption ml-4">
              {{ job.aboutCompany }}
            </p>
          </v-card>
        </v-col>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      job: {},
      similarJobs: {},
      loading: false,
      bookmarked: false,
      bookmarkLoading: false,
      applied: false
    };
  },
  computed: {
    id() {
      return this.$route.params.id;
    },
    loggedInuserId() {
      return this.$store.user.id;
    },
    jobInfo() {
      return [
        { name: "salary", value: "$ " + this.job.salary },
        { name: "type", value: this.job.type },
        {
          name: "experience",
          value:
            this.job.experience.from + " : " + this.job.experience.to + " years"
        },
        { name: "country", value: this.job.country },
        { name: "address", value: this.job.address },
        { name: "published at", value: this.job.created_at }
      ];
    }
  },
  methods: {
    ...mapActions({
      laodingStatus: "loader/laodingStatus"
    }),
    getData() {
      this.laodingStatus(true);
      this.axios
        .get(`http://localhost:8000/api/job/view/${this.id}`)
        .then(res => {
          this.job = res.data.job;
          this.similarJobs = res.data.similarJobs;
          this.bookmarked = this.job.bookmarks.length != 0 ? true : false;
          this.applied = this.job.applies.length != 0 ? true : false;
          this.laodingStatus(false);
        });
    },
    bookmark() {
      this.bookmarkLoading = true;
      this.axios
        .post(`http://localhost:8000/api/job/bookmark/${this.id}`)
        .then(res => {
          this.bookmarked = res.data;
          this.bookmarkLoading = false;
        });
    },
    apply() {
      this.axios
        .post(`http://localhost:8000/api/job/apply/${this.id}`)
        .then(() => {
          this.applied = true;
        });
    }
  },
  created() {
    this.getData();
  },
  watch: {
    id() {
      this.getData();
    }
  }
};
</script>

<style scoped>
.userInfo .v-image {
  height: 70px;
  width: 70px;
  display: inline-block;
}

.userInfo .job {
  float: right;
  width: calc(100% - 80px);
}

.headline {
  font-weight: bold;
}
</style>
