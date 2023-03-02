export default {
  eventCampaignBegin(state) {
    state.loading = true;
  },

  eventCampaignSuccess(state, data) {
    state.loading = false;
    state.singleData = data;
  },

  eventCampaignErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  filterProjectBegin(state) {
    state.loading = true;
  },

  filterProjectSuccess(state, data) {
    state.loading = false;
    state.data = data;
  },

  filterProjectErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  sortingProjectBegin(state) {
    state.loading = true;
  },

  sortingProjectSuccess(state, data) {
    state.loading = false;
    state.data = data;
  },

  sortingProjectErr(state, err) {
    state.loading = false;
    state.error = err;
  },
};
