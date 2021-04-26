<template>
  <div>
    <!-- <Loader v-if="loading" :loader="true" /> -->
    <template>
      <v-row justify="center">
        <v-dialog v-model="confirmBox" persistent max-width="290">
          <v-card>
            <p class="text-center pa-4">Are You Sure To Delete This Job</p>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" text @click="confirmBox = false">
                No
              </v-btn>
              <v-btn color="error darken-1" text @click="process = true">
                Yes
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </template>

    <v-container>
      <v-layout row wrap>
        <v-col md="12">
          <v-card-title class="mainColor--text">
            My Jobs
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="items"
            v-bind="bindOptions"
            :search="search"
          >
            <template #item.name="{item}"
              ><router-link :to="`/job/view/${item.id}`">{{
                item.id + " " + item.name
              }}</router-link>
            </template>
            <template slot="item.actions" scope="props">
              <v-btn
                router
                :to="`/job/${props.item.id}/edit`"
                class="ma-2"
                fab
                dark
                small
                color="cyan"
              >
                <v-icon dark>
                  mdi-pencil
                </v-icon>
              </v-btn>
              <v-btn
                @click="deleteJob(props.index, props.item.id)"
                color="error"
                class="ma-2"
                fab
                dark
                small
              >
                <v-icon color="">mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-col>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      items: [],
      loading: false,
      confirmBox: false,
      process: false,
      search: ""
    };
  },
  computed: {
    ...mapState(["loader"]),

    bindOptions() {
      return {
        dense: true
      };
    },
    headers() {
      return [
        {
          text: "Name",
          sortable: true,
          value: "name"
        },
        {
          text: "Actions",
          align: "center",
          value: "actions"
        }
      ];
    }
  },
  methods: {
    ...mapActions({
      laodingStatus: "loader/laodingStatus",
      popupData: "popup/popupData"
    }),
    getData() {
      this.laodingStatus(true);
      this.axios.get(`http://localhost:8000/api/user/jobs`).then(res => {
        this.items = res.data;
        this.laodingStatus(false);
      });
    },
    deleteJob(index, jobId) {
      this.laodingStatus(true);
      this.axios.delete(`http://localhost:8000/api/job/${jobId}`).then(res => {
        this.items.splice(index, 1);
        this.laodingStatus(false);
        this.popupData({
          show: true,
          text: res.data.msg
        });
      });
    }
  },
  created() {
    this.getData();
  }
};
</script>
