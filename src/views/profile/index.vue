<template>
  <div>
    <Skeleton
      class="profile"
      v-if="loading"
      type="avatar,heading, paragraph, paragraph, paragraph,paragraph"
    />
    <v-container v-else>
      <v-layout row wrap>
        <v-col offset-sm="2" sm="8" offset-xl="3" xl="6" xs="12">
          <div class="text-center" style="position: relative">
            <v-btn
              v-if="loggedIn && isUserProfile"
              class="mx-2  chatBtn"
              router
              to="/profile/edit"
              fab
              dark
              color="mainColor"
            >
              <v-icon dark>
                mdi-pencil
              </v-icon>
            </v-btn>
            <div class="profile-pic mb-4">
              <img
                class="profile-pic round"
                :src="user.avatar ? user.avatar : getImgUrl()"
              />
            </div>
            <h2 class="headline mainColor--text font-weight-bold">
              {{ user.name }}
            </h2>
            <p class="overline mt-2">
              {{ user.info }}
            </p>
          </div>
        </v-col>
      </v-layout>

      <v-layout row wrap>
        <v-col offset-xl="3" xl="4" md="5" offset-sm="1" sm="10">
          <p
            class="overline contact"
            v-for="(info, index) in information"
            :key="index"
          >
            <v-icon color="mainColor" class="pr-2">{{ info.icon }}</v-icon>
            <span>{{ info.text }}</span>
          </p>
        </v-col>
        <v-col
          class=""
          offset-md="0"
          offset-sm="1"
          md="5"
          sm="10"
          xs="12"
          xl="4"
        >
          <div class="text-center skills">
            <h2 class="title mainColor--text">Skills</h2>
            <v-chip
              outlined
              class="ma-2 mainColor"
              v-for="(skill, index) in user.skills"
              :key="index"
            >
              {{ skill }}
            </v-chip>
          </div>
        </v-col>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      user: {},
      loading: true
    };
  },
  computed: {
    ...mapState({
      authUser: "user"
    }),
    isUserProfile() {
      return this.user.id === this.authUser.id;
    },
    id() {
      return this.$route.params.id;
    },
    loggedIn() {
      return this.$store.getters.loggedIn;
    },
    information() {
      return [
        {
          icon: "mdi-email-check-outline",
          text: this.user.email
        },
        {
          icon: "mdi-folder-open",
          text: this.user.job
        },
        {
          icon: "mdi-cellphone-android",
          text: this.user.phone
        },
        {
          icon: "mdi-location-enter",
          text: this.user.country
        },
        {
          icon: "mdi-gender-female",
          text: this.user.gender
        }
      ];
    }
  },
  methods: {
    getImgUrl() {
      return require("@/assets/images/profile-pic.jpg");
    },
    getUserData() {
      this.axios.get(`api/profile/${this.id}`).then(res => {
        this.user = res.data;
        this.loading = false;
      });
    },
    setUserDate() {
      if (this.id) {
        this.getUserData();
      } else {
        if (this.loggedIn) {
          this.user = this.authUser;
          this.loading = false;
        } else {
          this.$router.push("/sign-in");
        }
      }
    }
  },
  created() {
    this.setUserDate();
  },
  watch: {
    id() {
      this.setUserDate();
    }
  }
};
</script>
<style scoped>
.profile-pic img {
  width: 150px;
  height: 150px;
  border: 0.5px solid #eee;
  border-radius: 50%;
  object-fit: cover;
}
@media screen and (max-width: 500px) {
  .contact {
    text-align: center;
  }
}
.chatBtn {
  position: absolute;
  right: 0;
  /* top: -54%; */
}
</style>
<style>
.profile .v-skeleton-loader__avatar {
  margin: auto !important;
}
.profile .v-skeleton-loader__heading {
  margin: 10px auto !important;
}
.profile .v-skeleton-loader__paragraph {
  width: 40%;
  display: inline-block;
  margin-right: 7%;
  margin-bottom: 20px;
}
.profile .v-skeleton-loader__paragraph {
  background-color: transparent !important;
  float: right;
}
</style>
