<template>
  <div>
    <v-toolbar dense>
      <v-app-bar-nav-icon
        class="d-sm-none"
        @click="drawer = true"
      ></v-app-bar-nav-icon>
      <router-link to="/" class="text-decoration-none mainColor--text">
        <v-toolbar-title left>Wuzzufny</v-toolbar-title>
      </router-link>
      <span class="ml-4">{{ user.name }}</span>
      <v-spacer></v-spacer>
      <v-btn
        class="d-none d-sm-flex font-weight-light py-6 rounded-0"
        text
        v-for="link in publicLinks"
        :key="link.name"
        router
        :to="link.route"
      >
        <span v-if="!link.dropdown">
          <v-icon left>{{ link.icon }}</v-icon>
          <span>{{ link.name }}</span>
        </span>
        <v-menu v-else open-on-hover offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              v-on="on"
              :color="$vuetify.theme.dark ? 'balck' : 'white'"
              depressed
              class="rounded-0 ma-n4 py-6"
            >
              <v-icon left>{{ link.icon }}</v-icon>
              <span>{{ link.name }}</span>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="item in link.dropdown.items"
              :key="item.name"
              router
              :to="item.route"
            >
              <v-list-item-title>
                <v-icon left>{{ item.icon }}</v-icon>
                <span>{{ item.name }}</span></v-list-item-title
              >
            </v-list-item>
          </v-list>
        </v-menu>
      </v-btn>
      <template v-if="loggedIn">
        <v-btn
          class="d-none d-sm-flex font-weight-light py-6 rounded-0"
          text
          v-for="(link, index) in userLinks"
          :key="index"
          router
          :to="link.route"
        >
          <span v-if="!link.dropdown">
            <v-icon left>{{ link.icon }}</v-icon>
            <span>{{ link.name }}</span>
          </span>
          <v-menu v-else open-on-hover offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                v-on="on"
                :color="$vuetify.theme.dark ? 'balck' : 'white'"
                depressed
                class="rounded-0 ma-n4 py-6"
              >
                <v-icon left>{{ link.icon }}</v-icon>
                <span>{{ link.name }}</span>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(item, index) in link.dropdown.items"
                :key="index"
                router
                :to="item.route"
              >
                <v-list-item-title>
                  <v-icon left>{{ item.icon }}</v-icon>
                  <span>{{ item.name }}</span></v-list-item-title
                >
              </v-list-item>
            </v-list>
          </v-menu>
        </v-btn>
      </template>
      <template v-else>
        <v-btn
          class="d-none d-sm-flex font-weight-light py-6 rounded-0"
          text
          v-for="(link, index) in guestLinks"
          :key="index"
          router
          :to="link.route"
        >
          <span v-if="!link.dropdown">
            <v-icon left>{{ link.icon }}</v-icon>
            <span>{{ link.name }}</span>
          </span>
          <v-menu v-else open-on-hover offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                v-on="on"
                :color="$vuetify.theme.dark ? 'balck' : 'white'"
                depressed
                class="rounded-0 ma-n4 py-6"
              >
                <v-icon left>{{ link.icon }}</v-icon>
                <span>{{ link.name }}</span>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(item, index) in link.dropdown.items"
                :key="index"
                router
                :to="item.route"
              >
                <v-list-item-title>
                  <v-icon left>{{ item.icon }}</v-icon>
                  <span>{{ item.name }}</span></v-list-item-title
                >
              </v-list-item>
            </v-list>
          </v-menu>
        </v-btn>
      </template>
      <div class="text-center"></div>
    </v-toolbar>

    <v-navigation-drawer dark v-model="drawer" absolute temporary>
      <v-list>
        <v-list-item-group>
          <v-list-item
            v-for="(link, index) in links"
            :key="index"
            router
            :to="link.route"
            no-action
          >
            <v-list-item-icon>
              <v-icon>{{ link.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ link.name }}</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Navbar",

  data: () => ({
    drawer: false,
    group: null
  }),
  computed: {
    ...mapState(["user"]),
    loggedIn() {
      return this.$store.getters.loggedIn;
    },
    userLinks() {
      return this.links.filter(link => link.status === "user");
    },
    guestLinks() {
      return this.links.filter(link => link.status === "guest");
    },
    publicLinks() {
      return this.links.filter(link => link.status === "public");
    },
    links() {
      return [
        { name: "Home", icon: "mdi-home", route: "/", status: "public" },
        {
          name: "Jobs",
          icon: "mdi-folder-open",
          route: "/jobs",
          status: "public"
        },
        {
          name: "Create Job",
          icon: "mdi-folder-plus",
          route: "/job/create",
          status: "user"
        },
        {
          name: "Profile",
          icon: "mdi-arrow-down-drop-circle-outline",
          route: "/profile/view",
          status: "user",
          dropdown: {
            items: [
              {
                name: "User Jobs",
                icon: "mdi-home",
                route: "/profile/jobs",
                status: "user"
              },
              {
                name: "Edit Profile",
                icon: "mdi-pencil",
                route: "/profile/edit",
                status: "user"
              },
              {
                name: "Log Out",
                icon: "mdi-account-plus",
                route: "/logout",
                status: "user"
              }
            ]
          }
        },
        {
          name: "Sign In",
          icon: "mdi-login",
          route: "/sign-in",
          status: "guest"
        },
        {
          name: "Sign Up",
          icon: "mdi-account-plus",
          route: "/sign-up",
          status: "guest"
        }
      ];
    }
  }
};
</script>
