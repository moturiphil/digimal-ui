export default {
  todoReadBegin(state) {
    state.loading = true;
  },

  todoReadSuccess(state, data) {
    state.loading = false;
    state.data = data;
  },

  todoReadErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  starUpdateBegin(state) {
    state.loading = true;
  },

  starUpdateSuccess(state, data) {
    state.loading = false;
    state.data = data;
  },

  starUpdateErr(state, err) {
    state.loading = false;
    state.error = err;
  },
};
