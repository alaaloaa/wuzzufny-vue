<template>
  <div>
    <!-- <Loader v-if="loading" :loader="true" /> -->
    <template>
      <v-row justify="center">
        <v-dialog v-model="dialogDelete" max-width="500px" persistent>
          <v-card>
            <v-card-title class="headline"
              >Are you sure you want to delete this item?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click="closeDelete" :disabled="btnLoading"
                >Cancel</v-btn
              >
              <v-btn
                color="error darken-1"
                text
                @click="deleteItemConfirm"
                :loading="btnLoading"
                >OK</v-btn
              >
              <v-spacer></v-spacer>
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
              ><v-btn router text :to="`/job/view/${item.id}`">
                <span>{{ item.name }}</span>
              </v-btn>
            </template>
            <template slot="item.actions" scope="props">
              <v-btn
                router
                :to="`/job/${props.item.id}/edit`"
                class="ma-2"
                text
                small
                color="cyan"
              >
                <v-icon dark>
                  mdi-pencil
                </v-icon>
              </v-btn>
              <v-btn
                @click="deleteItem(props.index, props.item.id)"
                color="#fff"
                class="ma-2"
                small
                text
              >
                <v-icon color="error">mdi-delete</v-icon>
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
      btnLoading: false,
      confirmBox: false,
      process: false,
      search: "",
      dialog: false,
      dialogDelete: false,
      index: -1,
      itemId: 1
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
      loadingStatus: "loader/loadingStatus",
      popupData: "popup/popupData"
    }),
    getData() {
      this.loadingStatus(true);
      this.axios.get(`http://localhost:8000/api/user/jobs`).then(res => {
        this.items = res.data;
        this.loadingStatus(false);
      });
    },
    deleteItem(index, itemId) {
      this.popupData({ show: false });
      this.index = index;
      this.itemId = itemId;
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.btnLoading = true;
      this.axios
        .delete(`http://localhost:8000/api/job/${this.itemId}`)
        .then(res => {
          this.items.splice(this.index, 1);
          this.closeDelete();
          this.btnLoading = false;
          this.popupData({
            show: true,
            text: res.data.msg
          });
        });
    },
    closeDelete() {
      this.dialogDelete = false;
      this.index = "";
      this.itemId = "";
    }
  },
  created() {
    this.getData();
  }
};
</script>
