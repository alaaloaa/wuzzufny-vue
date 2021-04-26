export const namespaced = true;

export const state = {
  loading: true,
  type: "circle"
};

export const mutations = {
  changeLaodingStatus(state, status) {
    state.loading = status;
  },
  changeType(state, type) {
    state.type = type;
  }
};

export const actions = {
  laodingStatus({ commit, dispatch }, status) {
    commit("changeLaodingStatus", status);
    // close popup if it opens
    dispatch(
      "popup/popupData",
      {
        show: false
      },
      { root: true }
    );
  },
  changeType({ commit }, type) {
    commit("changeType", type);
  }
};
